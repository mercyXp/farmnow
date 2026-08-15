import { PageHeader } from "@/components/page-header";
import { ImportWizard } from "@/features/import/import-wizard";
import { requirePagePermission } from "@/lib/supabase/server";

export default async function ImportPage() {
  await requirePagePermission("importExcel");
  return (
    <div>
      <PageHeader
        title="Excel import"
        description="Parse a FarmNow workbook, validate required sheets, then confirm to insert masters and registers. Existing document numbers are skipped."
      />
      <ImportWizard />
    </div>
  );
}
