import { hasPermission } from "@farmnow/domain";
import { PageHeader } from "@/components/page-header";
import { DataRows } from "@/components/data-rows";
import { SaleForm } from "@/features/transactions/forms";
import { activeFlocks, masters } from "@/features/transactions/queries";
import { requireUser } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import { formatZmw } from "@/lib/utils";
import { outstandingBalance, saleTotalValue } from "@farmnow/domain";

export default async function SalesPage() {
  const { profile } = await requireUser();
  const supabase = await createClient();
  const [flocks, m, { data: rows }] = await Promise.all([
    activeFlocks(),
    masters(),
    supabase.from("sales").select("*, flocks(code), customers(name)").eq("is_active", true).order("entry_date", { ascending: false }),
  ]);
  return (
    <div className="space-y-8">
      <PageHeader title="Sales & dispatch" description="Priced per bird if price/bird > 0, otherwise live weight × price/kg, plus transport. Birds cannot exceed remaining stock." />
      {hasPermission(profile.role, "recordSale") ? (
        <SaleForm flocks={flocks.map((f) => ({ id: f.id, label: f.code }))} customers={m.customers.map((c) => ({ id: c.id, label: c.name }))} />
      ) : null}
      <DataRows
        headers={["ID", "Flock", "Date", "Customer", "Birds", "Value", "Outstanding"]}
        rows={(rows ?? []).map((r) => {
          const total = saleTotalValue({
            birdsDispatched: r.birds_dispatched,
            liveWeightKg: Number(r.live_weight_kg),
            pricePerKg: Number(r.price_per_kg),
            pricePerBird: Number(r.price_per_bird),
            transportCost: Number(r.transport_cost),
          });
          return [
            r.code,
            (r.flocks as { code: string } | null)?.code ?? "",
            r.entry_date,
            (r.customers as { name: string } | null)?.name ?? "",
            String(r.birds_dispatched),
            formatZmw(total),
            formatZmw(outstandingBalance(total, Number(r.amount_paid))),
          ];
        })}
      />
    </div>
  );
}
