import { canMutateTransactions, feedPurchaseTotals, hasPermission } from "@farmnow/domain";
import { PageHeader } from "@/components/page-header";
import { FeedPurchaseForm } from "@/features/transactions/forms";
import { RecordWorkbench } from "@/features/transactions/workbench";
import { lookup, masters } from "@/features/transactions/queries";
import { requireUser } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import { formatZmw } from "@/lib/utils";

export default async function PurchasesPage() {
  const { profile } = await requireUser();
  const supabase = await createClient();
  const [methods, m, { data: rows }] = await Promise.all([
    lookup("PaymentMethod"),
    masters(),
    supabase.from("feed_purchases").select("*, suppliers(name), feed_types(name)").eq("is_active", true).order("purchase_date", { ascending: false }),
  ]);
  const records = (rows ?? []).map((r) => {
    const t = feedPurchaseTotals(r.number_of_bags, Number(r.bag_weight_kg), Number(r.unit_cost_per_bag));
    return {
      id: r.id,
      code: r.code,
      purchaseDate: r.purchase_date,
      supplierId: r.supplier_id,
      supplier: (r.suppliers as { name: string } | null)?.name ?? "",
      feedTypeId: r.feed_type_id,
      feed: (r.feed_types as { name: string } | null)?.name ?? "",
      numberOfBags: r.number_of_bags,
      bagWeightKg: Number(r.bag_weight_kg),
      unitCostPerBag: Number(r.unit_cost_per_bag),
      invoiceNo: r.invoice_no,
      paymentMethod: r.payment_method,
      kg: t.totalWeightKg,
      cost: formatZmw(t.totalCost),
    };
  });
  return (
    <div className="space-y-8">
      <PageHeader title="Purchases" description="The workbook’s only purchase register is feed purchases. Saving a purchase increases feed stock." />
      <RecordWorkbench
        canRecord={hasPermission(profile.role, "recordPurchase") || hasPermission(profile.role, "recordFeedPurchase")}
        canMutate={canMutateTransactions(profile.role)}
        deleteTable="feed_purchases"
        rows={records}
        columns={[
          { id: "code", header: "ID", field: "code" },
          { id: "purchaseDate", header: "Date", field: "purchaseDate" },
          { id: "supplier", header: "Supplier", field: "supplier" },
          { id: "feed", header: "Feed", field: "feed" },
          { id: "numberOfBags", header: "Bags", field: "numberOfBags" },
          { id: "kg", header: "Kg", field: "kg" },
          { id: "cost", header: "Cost", field: "cost" },
          { id: "invoiceNo", header: "Invoice", field: "invoiceNo" },
        ]}
      >
        <FeedPurchaseForm
          suppliers={m.suppliers.map((s) => ({ id: s.id, label: s.name }))}
          feed={m.feed.map((f) => ({ id: f.id, label: f.name }))}
          methods={methods}
        />
      </RecordWorkbench>
    </div>
  );
}
