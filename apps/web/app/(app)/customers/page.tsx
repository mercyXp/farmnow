import { PageHeader } from "@/components/page-header";
import { DataRows } from "@/components/data-rows";
import { createClient } from "@/lib/supabase/server";
import { requirePagePermission } from "@/lib/supabase/server";

export default async function CustomersPage() {
  await requirePagePermission("viewCustomers");
  const supabase = await createClient();
  const { data: customers } = await supabase.from("customers").select("*").order("name");
  return (
    <div className="space-y-8">
      <PageHeader title="Customers" description="Buyers used on sales invoices. New customers are added from Settings when you have master-data access." />
      <DataRows
        headers={["Name", "Contact", "Tier", "Terms"]}
        rows={(customers ?? []).map((c) => [c.name, c.contact ?? "", c.price_tier, c.payment_terms])}
      />
    </div>
  );
}
