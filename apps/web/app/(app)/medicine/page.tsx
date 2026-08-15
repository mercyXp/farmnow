import { hasPermission } from "@farmnow/domain";
import { PageHeader } from "@/components/page-header";
import { DataRows } from "@/components/data-rows";
import { HealthForm, MedicineLotForm } from "@/features/transactions/forms";
import { activeFlocks, lookup, masters } from "@/features/transactions/queries";
import { requireUser } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";

export default async function MedicinePage() {
  const { profile } = await requireUser();
  const canRecord = hasPermission(profile.role, "recordMedicine");
  const supabase = await createClient();
  const [flocks, routes, m, lots, health] = await Promise.all([
    activeFlocks(),
    lookup("VaccinationRoute"),
    masters(),
    supabase.from("medicine_lots").select("*, products(name), flocks(code)").eq("is_active", true).order("expiry_date"),
    supabase.from("health_entries").select("*, flocks(code), products(name)").eq("is_active", true).order("entry_date", { ascending: false }).limit(80),
  ]);
  const flockOpts = flocks.map((f) => ({ id: f.id, label: f.code }));

  return (
    <div className="space-y-10">
      <PageHeader title="Medicine" description="Lot stock with expiry status, plus vaccination/treatment records." />
      <section className="space-y-4">
        <h2 className="font-serif text-xl">Receive lot</h2>
        {canRecord ? (
          <MedicineLotForm
            flocks={flockOpts}
            products={m.products.map((p) => ({ id: p.id, label: p.name }))}
            suppliers={m.suppliers.map((s) => ({ id: s.id, label: s.name }))}
          />
        ) : null}
        <DataRows
          headers={["Lot", "Flock", "Product", "Expiry", "Balance", "Status"]}
          rows={(lots.data ?? []).map((r) => {
            const row = r as {
              lot_number: string;
              expiry_date: string;
              quantity_received: number;
              quantity_used: number;
              products?: { name: string } | null;
              flocks?: { code: string } | null;
            };
            return [row.lot_number, row.flocks?.code ?? "", row.products?.name ?? "", row.expiry_date, String(row.quantity_received - row.quantity_used), ""];
          })}
        />
      </section>
      <section className="space-y-4">
        <h2 className="font-serif text-xl">Treatment / vaccination</h2>
        {canRecord ? (
          <HealthForm flocks={flockOpts} products={m.products.map((p) => ({ id: p.id, label: p.name }))} routes={routes} />
        ) : null}
        <DataRows
          headers={["ID", "Flock", "Date", "Product", "Route"]}
          rows={(health.data ?? []).map((r) => [
            r.code,
            (r.flocks as { code: string } | null)?.code ?? "",
            r.entry_date,
            (r.products as { name: string } | null)?.name ?? "",
            r.route,
          ])}
        />
      </section>
    </div>
  );
}
