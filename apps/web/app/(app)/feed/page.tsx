import { canMutateTransactions, feedConsumptionCost, feedPurchaseTotals, hasPermission } from "@farmnow/domain";
import { PageHeader } from "@/components/page-header";
import { FeedPurchaseForm, FeedUsageForm } from "@/features/transactions/forms";
import { RecordWorkbench } from "@/features/transactions/workbench";
import { activeFlocks, lookup, masters } from "@/features/transactions/queries";
import { requireUser } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import { formatZmw } from "@/lib/utils";

export default async function FeedPage() {
  const { profile } = await requireUser();
  const supabase = await createClient();
  const [flocks, methods, m, usage, purchases] = await Promise.all([
    activeFlocks(),
    lookup("PaymentMethod"),
    masters(),
    supabase.from("feed_consumption").select("*, flocks(code), feed_types(name, unit_cost_per_kg)").eq("is_active", true).order("entry_date", { ascending: false }).limit(500),
    supabase.from("feed_purchases").select("*, suppliers(name), feed_types(name)").eq("is_active", true).order("purchase_date", { ascending: false }).limit(500),
  ]);
  const flockOpts = flocks.map((f) => ({ id: f.id, label: f.code }));
  const feedOpts = m.feed.map((f) => ({ id: f.id, label: f.name }));
  const canUsage = hasPermission(profile.role, "recordFeedUsage");
  const canPurchase = hasPermission(profile.role, "recordFeedPurchase");
  const canViewPurchases = hasPermission(profile.role, "viewPurchases") || canPurchase;
  const canMutate = canMutateTransactions(profile.role);

  const usageRows = (usage.data ?? []).map((r) => {
    const ft = r.feed_types as { name: string; unit_cost_per_kg: number } | null;
    return {
      id: r.id,
      code: r.code,
      flockId: r.flock_id,
      flock: (r.flocks as { code: string } | null)?.code ?? "",
      entryDate: r.entry_date,
      feedTypeId: r.feed_type_id,
      feed: ft?.name ?? "",
      kgUsed: Number(r.kg_used),
      cost: formatZmw(feedConsumptionCost(Number(r.kg_used), Number(ft?.unit_cost_per_kg ?? 0))),
    };
  });
  const purchaseRows = (purchases.data ?? []).map((r) => {
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
    <div className="space-y-10">
      <PageHeader title="Feed" description="Purchases increase stock. Usage is costed at the feed type unit cost, matching Excel." />
      <section className="space-y-4">
        <h2 className="font-serif text-xl">Record usage</h2>
        <RecordWorkbench
          canRecord={canUsage}
          canMutate={canMutate}
          deleteTable="feed_consumption"
          rows={usageRows}
          columns={[
            { id: "code", header: "ID", field: "code" },
            { id: "flock", header: "Flock", field: "flock" },
            { id: "entryDate", header: "Date", field: "entryDate" },
            { id: "feed", header: "Feed", field: "feed" },
            { id: "kgUsed", header: "Kg", field: "kgUsed" },
            { id: "cost", header: "Cost", field: "cost" },
          ]}
        >
          <FeedUsageForm flocks={flockOpts} feed={feedOpts} />
        </RecordWorkbench>
      </section>
      {canViewPurchases ? (
        <section className="space-y-4">
          <h2 className="font-serif text-xl">Record purchase</h2>
          <RecordWorkbench
            canRecord={canPurchase}
            canMutate={canMutate}
            deleteTable="feed_purchases"
            rows={purchaseRows}
            columns={[
              { id: "code", header: "ID", field: "code" },
              { id: "purchaseDate", header: "Date", field: "purchaseDate" },
              { id: "supplier", header: "Supplier", field: "supplier" },
              { id: "feed", header: "Feed", field: "feed" },
              { id: "kg", header: "Kg", field: "kg" },
              { id: "cost", header: "Cost", field: "cost" },
            ]}
          >
            <FeedPurchaseForm
              suppliers={m.suppliers.map((s) => ({ id: s.id, label: s.name }))}
              feed={feedOpts}
              methods={methods}
            />
          </RecordWorkbench>
        </section>
      ) : null}
    </div>
  );
}
