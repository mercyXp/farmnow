import { canMutateTransactions, hasPermission, outstandingBalance, saleTotalValue } from "@farmnow/domain";
import { PageHeader } from "@/components/page-header";
import { SaleForm } from "@/features/transactions/forms";
import { RecordWorkbench } from "@/features/transactions/workbench";
import { activeFlocks, masters } from "@/features/transactions/queries";
import { requireUser } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import { formatZmw } from "@/lib/utils";

export default async function SalesPage() {
  const { profile } = await requireUser();
  const supabase = await createClient();
  const [flocks, m, { data: rows }] = await Promise.all([
    activeFlocks(),
    masters(),
    supabase.from("sales").select("*, flocks(code), customers(name)").eq("is_active", true).order("entry_date", { ascending: false }),
  ]);
  const records = (rows ?? []).map((r) => {
    const total = saleTotalValue({
      birdsDispatched: r.birds_dispatched,
      liveWeightKg: Number(r.live_weight_kg),
      pricePerKg: Number(r.price_per_kg),
      pricePerBird: Number(r.price_per_bird),
      transportCost: Number(r.transport_cost),
    });
    return {
      id: r.id,
      code: r.code,
      flockId: r.flock_id,
      flock: (r.flocks as { code: string } | null)?.code ?? "",
      entryDate: r.entry_date,
      customerId: r.customer_id,
      customer: (r.customers as { name: string } | null)?.name ?? "",
      birdsDispatched: r.birds_dispatched,
      liveWeightKg: Number(r.live_weight_kg),
      pricePerKg: Number(r.price_per_kg),
      pricePerBird: Number(r.price_per_bird),
      transportCost: Number(r.transport_cost),
      amountPaid: Number(r.amount_paid),
      invoiceNo: r.invoice_no,
      value: formatZmw(total),
      outstanding: formatZmw(outstandingBalance(total, Number(r.amount_paid))),
    };
  });
  return (
    <div className="space-y-8">
      <PageHeader title="Sales & dispatch" description="Priced per bird if price/bird > 0, otherwise live weight × price/kg, plus transport. Birds cannot exceed remaining stock." />
      <RecordWorkbench
        canRecord={hasPermission(profile.role, "recordSale")}
        canMutate={canMutateTransactions(profile.role)}
        deleteTable="sales"
        rows={records}
        columns={[
          { id: "code", header: "ID", field: "code" },
          { id: "flock", header: "Flock", field: "flock" },
          { id: "entryDate", header: "Date", field: "entryDate" },
          { id: "customer", header: "Customer", field: "customer" },
          { id: "birdsDispatched", header: "Birds", field: "birdsDispatched" },
          { id: "value", header: "Value", field: "value" },
          { id: "outstanding", header: "Outstanding", field: "outstanding" },
        ]}
      >
        <SaleForm
          flocks={flocks.map((f) => ({ id: f.id, label: f.code }))}
          customers={m.customers.map((c) => ({ id: c.id, label: c.name }))}
        />
      </RecordWorkbench>
    </div>
  );
}
