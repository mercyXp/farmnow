import { PageHeader } from "@/components/page-header";
import { DataTable } from "@/components/data-table";
import { createClient } from "@/lib/supabase/server";
import { requirePagePermission } from "@/lib/supabase/server";

export default async function CustomersPage() {
  await requirePagePermission("viewCustomers");
  const supabase = await createClient();
  const { data: customers } = await supabase.from("customers").select("*").order("name");
  return (
    <div className="space-y-8">
      <PageHeader title="Customers" description="Buyers used on sales invoices. New customers are added from Settings when you have master-data access." />
      <DataTable
        rowKeyField="id"
        rows={customers ?? []}
        emptyTitle="No customers yet."
        emptyDescription="Add customers from Settings."
        columns={[
          { id: "name", header: "Name", field: "name" },
          { id: "contact", header: "Contact", field: "contact" },
          { id: "price_tier", header: "Tier", field: "price_tier" },
          { id: "payment_terms", header: "Terms", field: "payment_terms" },
        ]}
      />
    </div>
  );
}
