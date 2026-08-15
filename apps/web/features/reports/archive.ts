import { uploadPrivateFile } from "@/lib/storage";
import type { createClient } from "@/lib/supabase/server";
import type { ReportType } from "@farmnow/domain";

type ServerClient = Awaited<ReturnType<typeof createClient>>;

export async function archiveGeneratedPdf(
  supabase: ServerClient,
  userId: string,
  reportType: ReportType,
  fileName: string,
  buf: Buffer,
  flockId?: string | null,
) {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const path = `${reportType}/${stamp}_${fileName}`;
  await uploadPrivateFile(supabase, "reports", path, buf, "application/pdf");
  const { error } = await supabase.from("generated_reports").insert({
    report_type: reportType,
    flock_id: flockId ?? null,
    storage_path: path,
    file_name: fileName,
    generated_by: userId,
  });
  if (error) {
    throw new Error("Could not archive the generated report.");
  }
}
