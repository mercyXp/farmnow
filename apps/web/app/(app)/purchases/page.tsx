import { hasPermission } from "@farmnow/domain";
import { PageHeader } from "@/components/page-header";
import { DataRows } from "@/components/data-rows";
import { FeedPurchaseForm } from "@/features/transactions/forms";
import { lookup, masters } from "@/features/transactions/queries";
import { requireUser } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import { formatZmw } from "@/lib/utils";
import { feedPurchaseTotals } from "@farmnow/domain";

export default async function PurchasesPage() {
  const { profile } = await requireUser();
  const supabase = await createClient();
  const [methods, m, { data: rows }] = await Promise.all([
    lookup("PaymentMethod"),
    masters(),
    supabase.from("feed_purchases").select("*, suppliers(name), feed_types(name)").eq("is_active", true).order("purchase_date", { ascending: false }),
  ]);
  return (
    <div className="space-y-8">
      <PageHeader title="Purchases" description="The workbook’s only purchase register is feed purchases. Saving a purchase increases feed stock." />
      {hasPermission(profile.role, "recordPurchase") || hasPermission(profile.role, "recordFeedPurchase") ? (
        <FeedPurchaseForm
          suppliers={m.suppliers.map((s) => ({ id: s.id, label: s.name }))}
          feed={m.feed.map((f) => ({ id: f.id, label: f.name }))}
          methods={methods}
        />
      ) : null}
      <DataRows
        headers={["ID", "Date", "Supplier", "Feed", "Bags", "Kg", "Cost", "Invoice"]}
        rows={(rows ?? []).map((r) => {
          const t = feedPurchaseTotals(r.number_of_bags, Number(r.bag_weight_kg), Number(r.unit_cost_per_bag));
          return [r.code, r.purchase_date, (r.suppliers as { name: string } | null)?.name ?? "", (r.feed_types as { name: string } | null)?.name ?? "", String(r.number_of_bags), String(t.totalWeightKg), formatZmw(t.totalCost), r.invoice_no];
        })}
      />
    </div>
  );
}
