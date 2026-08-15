"use server";

import { parseFarmNowWorkbook } from "@/features/import/parse";
import { applyFarmNowImport } from "@/features/import/apply";
import { requirePermission } from "@/lib/supabase/server";
import { uploadPrivateFile } from "@/lib/storage";
import { writeAudit } from "@/lib/audit";
import { publicError } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export type ImportPreview = {
  counts: Record<string, number>;
  errors: string[];
};

function fromBase64(bytesB64: string): Buffer {
  return Buffer.from(bytesB64, "base64");
}

export async function previewExcelImport(
  bytesB64: string,
): Promise<{ ok: true; preview: ImportPreview } | { ok: false; error: string }> {
  try {
    await requirePermission("importExcel");
    const parsed = await parseFarmNowWorkbook(fromBase64(bytesB64));
    return { ok: true, preview: { counts: parsed.counts, errors: parsed.errors } };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : publicError(error) };
  }
}

export async function confirmExcelImport(
  bytesB64: string,
): Promise<{ ok: true; inserted: Record<string, number> } | { ok: false; error: string }> {
  try {
    const { supabase, user } = await requirePermission("importExcel");
    const parsed = await parseFarmNowWorkbook(fromBase64(bytesB64));
    if (parsed.errors.length > 0) {
      return { ok: false, error: parsed.errors.slice(0, 8).join(" ") };
    }
    const buffer = fromBase64(bytesB64);
    const storagePath = `${user.id}/${Date.now()}.xlsx`;
    await uploadPrivateFile(
      supabase,
      "imports",
      storagePath,
      buffer,
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    const { inserted } = await applyFarmNowImport(supabase, user.id, parsed);
    await writeAudit(supabase, user, {
      action: "import",
      entityType: "excel",
      entityId: storagePath,
      newData: inserted,
    });
    revalidatePath("/");
    return { ok: true, inserted };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : publicError(error) };
  }
}
