import { canMutateTransactions, hasPermission, medicineExpiryStatus } from "@farmnow/domain";
import { PageHeader } from "@/components/page-header";
import { HealthForm, MedicineLotForm } from "@/features/transactions/forms";
import { RecordWorkbench } from "@/features/transactions/workbench";
import { activeFlocks, lookup, masters } from "@/features/transactions/queries";
import { requireUser } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";

export default async function MedicinePage() {
  const { profile } = await requireUser();
  const canRecord = hasPermission(profile.role, "recordMedicine");
  const canMutate = canMutateTransactions(profile.role);
  const supabase = await createClient();
  const [flocks, routes, m, lots, health, { data: settings }] = await Promise.all([
    activeFlocks(),
    lookup("VaccinationRoute"),
    masters(),
    supabase.from("medicine_lots").select("*, products(name), flocks(code)").eq("is_active", true).order("expiry_date"),
    supabase.from("health_entries").select("*, flocks(code), products(name)").eq("is_active", true).order("entry_date", { ascending: false }).limit(500),
    supabase.from("settings").select("key, value").eq("key", "MedicineExpiryWarningDays"),
  ]);
  const flockOpts = flocks.map((f) => ({ id: f.id, label: f.code }));
  const productOpts = m.products.map((p) => ({ id: p.id, label: p.name }));
  const warningDays = Number(settings?.[0]?.value ?? 30);
  const today = new Date();

  const lotRows = (lots.data ?? []).map((r) => ({
    id: r.id,
    flockId: r.flock_id,
    flock: (r.flocks as { code: string } | null)?.code ?? "",
    productId: r.product_id,
    product: (r.products as { name: string } | null)?.name ?? "",
    supplierId: r.supplier_id,
    lotNumber: r.lot_number,
    expiryDate: r.expiry_date,
    quantityReceived: Number(r.quantity_received),
    quantityUsed: Number(r.quantity_used),
    unitCost: Number(r.unit_cost),
    balance: Number(r.quantity_received) - Number(r.quantity_used),
    status: medicineExpiryStatus(new Date(r.expiry_date), today, warningDays),
  }));
  const healthRows = (health.data ?? []).map((r) => ({
    id: r.id,
    code: r.code,
    flockId: r.flock_id,
    flock: (r.flocks as { code: string } | null)?.code ?? "",
    entryDate: r.entry_date,
    productId: r.product_id,
    product: (r.products as { name: string } | null)?.name ?? "",
    dosageGiven: r.dosage_given,
    route: r.route,
  }));

  return (
    <div className="space-y-10">
      <PageHeader title="Medicine" description="Lot stock with expiry status, plus vaccination/treatment records." />
      <section className="space-y-4">
        <h2 className="font-serif text-xl">Receive lot</h2>
        <RecordWorkbench
          canRecord={canRecord}
          canMutate={canMutate}
          deleteTable="medicine_lots"
          rows={lotRows}
          columns={[
            { id: "lotNumber", header: "Lot", field: "lotNumber" },
            { id: "flock", header: "Flock", field: "flock" },
            { id: "product", header: "Product", field: "product" },
            { id: "expiryDate", header: "Expiry", field: "expiryDate" },
            { id: "balance", header: "Balance", field: "balance" },
            { id: "status", header: "Status", field: "status" },
          ]}
        >
          <MedicineLotForm flocks={flockOpts} products={productOpts} suppliers={m.suppliers.map((s) => ({ id: s.id, label: s.name }))} />
        </RecordWorkbench>
      </section>
      <section className="space-y-4">
        <h2 className="font-serif text-xl">Treatment / vaccination</h2>
        <RecordWorkbench
          canRecord={canRecord}
          canMutate={canMutate}
          deleteTable="health_entries"
          rows={healthRows}
          columns={[
            { id: "code", header: "ID", field: "code" },
            { id: "flock", header: "Flock", field: "flock" },
            { id: "entryDate", header: "Date", field: "entryDate" },
            { id: "product", header: "Product", field: "product" },
            { id: "route", header: "Route", field: "route" },
          ]}
        >
          <HealthForm flocks={flockOpts} products={productOpts} routes={routes} />
        </RecordWorkbench>
      </section>
    </div>
  );
}
