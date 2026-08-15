"use server";

import { requirePermission } from "@/lib/supabase/server";
import { nextCode, writeAudit } from "@/lib/audit";
import { publicError } from "@/lib/utils";
import { flockCreateSchema } from "@farmnow/domain";

export type ActionResult = { ok: true; id?: string } | { ok: false; error: string };

export async function createFlock(input: unknown): Promise<ActionResult> {
  try {
    const parsed = flockCreateSchema.parse(input);
    const { supabase, user } = await requirePermission("createFlock");
    const code = await nextCode(supabase, "FLK");
    const { data, error } = await supabase
      .from("flocks")
      .insert({
        code,
        house_id: parsed.houseId,
        breed_id: parsed.breedId,
        supplier_id: parsed.supplierId,
        placed_date: parsed.placedDate.toISOString().slice(0, 10),
        initial_bird_count: parsed.initialBirdCount,
        expected_dispatch_date: parsed.expectedDispatchDate.toISOString().slice(0, 10),
        status: "Active",
        created_by: user.id,
      })
      .select("id, code")
      .single();
    if (error) throw error;
    await writeAudit(supabase, user, {
      action: "create",
      entityType: "flocks",
      entityId: data.id,
      newData: { code: data.code, ...parsed, placedDate: parsed.placedDate.toISOString() },
    });
    return { ok: true, id: data.id };
  } catch (error) {
    return { ok: false, error: publicError(error) };
  }
}

export async function closeFlock(flockId: string): Promise<ActionResult> {
  try {
    const { supabase, user } = await requirePermission("closeFlock");
    const { data: before } = await supabase.from("flocks").select("*").eq("id", flockId).single();
    const { error } = await supabase.from("flocks").update({ status: "Closed" }).eq("id", flockId);
    if (error) throw error;
    await writeAudit(supabase, user, {
      action: "update",
      entityType: "flocks",
      entityId: flockId,
      oldData: before,
      newData: { status: "Closed" },
    });
    return { ok: true, id: flockId };
  } catch (error) {
    return { ok: false, error: publicError(error) };
  }
}
