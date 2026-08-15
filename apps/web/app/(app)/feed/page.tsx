import { hasPermission } from "@farmnow/domain";
import { PageHeader, EmptyState } from "@/components/page-header";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { FeedPurchaseForm, FeedUsageForm } from "@/features/transactions/forms";
import { activeFlocks, lookup, masters } from "@/features/transactions/queries";
import { requireUser } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import { formatZmw } from "@/lib/utils";
import { feedConsumptionCost, feedPurchaseTotals } from "@farmnow/domain";

export default async function FeedPage() {
  const { profile } = await requireUser();
  const supabase = await createClient();
  const [flocks, methods, m, usage, purchases] = await Promise.all([
    activeFlocks(),
    lookup("PaymentMethod"),
    masters(),
    supabase.from("feed_consumption").select("*, flocks(code), feed_types(name, unit_cost_per_kg)").eq("is_active", true).order("entry_date", { ascending: false }).limit(80),
    supabase.from("feed_purchases").select("*, suppliers(name), feed_types(name)").eq("is_active", true).order("purchase_date", { ascending: false }).limit(80),
  ]);
  const flockOpts = flocks.map((f) => ({ id: f.id, label: f.code }));
  const feedOpts = m.feed.map((f) => ({ id: f.id, label: f.name }));
  const canUsage = hasPermission(profile.role, "recordFeedUsage");
  const canPurchase = hasPermission(profile.role, "recordFeedPurchase");
  const canViewPurchases = hasPermission(profile.role, "viewPurchases") || canPurchase;

  return (
    <div className="space-y-10">
      <PageHeader title="Feed" description="Purchases increase stock. Usage is costed at the feed type unit cost, matching Excel." />
      <section className="space-y-4">
        <h2 className="font-serif text-xl">Record usage</h2>
        {canUsage ? <FeedUsageForm flocks={flockOpts} feed={feedOpts} /> : null}
        <Rows
          headers={["ID", "Flock", "Date", "Feed", "Kg", "Cost"]}
          rows={(usage.data ?? []).map((r) => {
            const ft = r.feed_types as { name: string; unit_cost_per_kg: number } | null;
            return [r.code, (r.flocks as { code: string } | null)?.code ?? "", r.entry_date, ft?.name ?? "", String(r.kg_used), formatZmw(feedConsumptionCost(Number(r.kg_used), Number(ft?.unit_cost_per_kg ?? 0)))];
          })}
        />
      </section>
      {canViewPurchases ? (
        <section className="space-y-4">
          <h2 className="font-serif text-xl">Record purchase</h2>
          {canPurchase ? (
            <FeedPurchaseForm suppliers={m.suppliers.map((s) => ({ id: s.id, label: s.name }))} feed={feedOpts} methods={methods} />
          ) : null}
        <Rows
          headers={["ID", "Date", "Supplier", "Feed", "Kg", "Cost"]}
          rows={(purchases.data ?? []).map((r) => {
            const t = feedPurchaseTotals(r.number_of_bags, Number(r.bag_weight_kg), Number(r.unit_cost_per_bag));
            return [r.code, r.purchase_date, (r.suppliers as { name: string } | null)?.name ?? "", (r.feed_types as { name: string } | null)?.name ?? "", String(t.totalWeightKg), formatZmw(t.totalCost)];
          })}
        />
      </section>
      ) : null}
    </div>
  );
}

function Rows({ headers, rows }: { headers: string[]; rows: string[][] }) {
  if (rows.length === 0) return <EmptyState title="No rows yet." description="Save a transaction to see it here." />;
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Table>
        <THead>
          <TR>
            {headers.map((h) => (
              <TH key={h}>{h}</TH>
            ))}
          </TR>
        </THead>
        <TBody>
          {rows.map((row, i) => (
            <TR key={i}>
              {row.map((c, j) => (
                <TD key={j}>{c}</TD>
              ))}
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  );
}
