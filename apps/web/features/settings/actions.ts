"use server";

import { requirePermission } from "@/lib/supabase/server";
import { writeAudit } from "@/lib/audit";
import { publicError } from "@/lib/utils";
import { revalidatePath } from "next/cache";

type Result = { ok: true } | { ok: false; error: string };

async function created(
  entity: string,
  insert: Record<string, unknown>,
): Promise<Result> {
  try {
    const { supabase, user } = await requirePermission("manageMasters");
    const { data, error } = await supabase.from(entity as never).insert(insert as never).select("id").single();
    if (error) throw error;
    const id = (data as { id: string }).id;
    await writeAudit(supabase, user, { action: "create", entityType: entity, entityId: id, newData: insert });
    revalidatePath("/settings");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: publicError(error) };
  }
}

export async function updateSettings(entries: { key: string; value: string }[]) {
  try {
    const { supabase, user } = await requirePermission("manageSettings");
    for (const row of entries) {
      const { error } = await supabase.from("settings").upsert({ key: row.key, value: row.value });
      if (error) throw error;
    }
    await writeAudit(supabase, user, { action: "update", entityType: "settings", entityId: "settings", newData: entries });
    revalidatePath("/settings");
    revalidatePath("/dashboard");
    return { ok: true as const };
  } catch (error) {
    return { ok: false as const, error: publicError(error) };
  }
}

export async function createHouse(input: { code: string; capacity: number; location_zone: string }) {
  return created("houses", { ...input, status: "Active" });
}

export async function createBreed(input: { name: string; standard_fcr: number; standard_adg_g: number }) {
  return created("breeds", input);
}

export async function createFeedType(input: {
  name: string;
  stage: string;
  unit_cost_per_kg: number;
  standard_bag_weight_kg: number;
  min_stock_kg: number;
}) {
  return created("feed_types", input);
}

export async function createSupplier(input: {
  name: string;
  contact: string;
  email: string;
  category: string;
  lead_time_days: number;
}) {
  return created("suppliers", input);
}

export async function createCustomer(input: {
  name: string;
  contact: string;
  address: string;
  price_tier: string;
  payment_terms: string;
}) {
  return created("customers", input);
}

export async function createProduct(input: {
  name: string;
  type: string;
  dosage_unit: string;
  withdrawal_days: number;
}) {
  return created("products", input);
}

export async function createEmployee(input: {
  name: string;
  position: string;
  contact_number: string;
  nrc: string;
  date_hired: string;
  salary_zmw: number;
}) {
  return created("employees", { ...input, status: "Active" });
}
