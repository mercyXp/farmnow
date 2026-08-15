import { PageHeader } from "@/components/page-header";
import { DataRows } from "@/components/data-rows";
import { createClient } from "@/lib/supabase/server";
import { requirePagePermission } from "@/lib/supabase/server";

export default async function SuppliersPage() {
  await requirePagePermission("viewSuppliers");
  const supabase = await createClient();
  const { data: suppliers } = await supabase.from("suppliers").select("*").order("name");
  return (
    <div className="space-y-8">
      <PageHeader title="Suppliers" description="Vendors for feed, medicine, and expenses. New suppliers are added from Settings when you have master-data access." />
      <DataRows
        headers={["Name", "Category", "Contact", "Lead time (days)"]}
        rows={(suppliers ?? []).map((s) => [s.name, s.category, s.contact ?? "", String(s.lead_time_days)])}
      />
    </div>
  );
}
