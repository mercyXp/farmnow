import { PageHeader } from "@/components/page-header";
import { DataTable } from "@/components/data-table";
import { createClient } from "@/lib/supabase/server";
import { requirePagePermission } from "@/lib/supabase/server";

export default async function SuppliersPage() {
  await requirePagePermission("viewSuppliers");
  const supabase = await createClient();
  const { data: suppliers } = await supabase.from("suppliers").select("*").order("name");
  const rows = (suppliers ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    category: s.category,
    contact: s.contact ?? "",
    leadTime: s.lead_time_days,
  }));
  return (
    <div className="space-y-8">
      <PageHeader title="Suppliers" description="Vendors for feed, medicine, and expenses. New suppliers are added from Settings when you have master-data access." />
      <DataTable
        rowKeyField="id"
        rows={rows}
        emptyTitle="No suppliers yet."
        emptyDescription="Add suppliers from Settings."
        columns={[
          { id: "name", header: "Name", field: "name" },
          { id: "category", header: "Category", field: "category" },
          { id: "contact", header: "Contact", field: "contact" },
          { id: "leadTime", header: "Lead time (days)", field: "leadTime" },
        ]}
      />
    </div>
  );
}
