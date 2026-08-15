import { canMutateTransactions, expenseAmount, hasPermission } from "@farmnow/domain";
import { PageHeader } from "@/components/page-header";
import { ExpenseForm } from "@/features/transactions/forms";
import { RecordWorkbench } from "@/features/transactions/workbench";
import { activeFlocks, lookup, masters } from "@/features/transactions/queries";
import { requireUser } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import { formatZmw } from "@/lib/utils";

export default async function ExpensesPage() {
  const { profile } = await requireUser();
  const supabase = await createClient();
  const [flocks, cats, methods, m, { data: rows }] = await Promise.all([
    activeFlocks(),
    lookup("ExpenseCategory"),
    lookup("PaymentMethod"),
    masters(),
    supabase.from("expenses").select("*, flocks(code)").eq("is_active", true).order("entry_date", { ascending: false }),
  ]);
  const total = (rows ?? []).reduce((a, r) => a + expenseAmount(Number(r.quantity), Number(r.unit_cost)), 0);
  const records = (rows ?? []).map((r) => ({
    id: r.id,
    code: r.code,
    flockId: r.flock_id,
    flock: (r.flocks as { code: string } | null)?.code ?? "Overhead",
    entryDate: r.entry_date,
    category: r.category,
    supplierId: r.supplier_id,
    quantity: Number(r.quantity),
    unitCost: Number(r.unit_cost),
    paymentMethod: r.payment_method,
    paymentRef: r.payment_ref ?? "",
    approvedBy: r.approved_by ?? "",
    amount: formatZmw(expenseAmount(Number(r.quantity), Number(r.unit_cost))),
  }));
  return (
    <div className="space-y-8">
      <PageHeader title="Expenses" description={`Leave flock blank for overhead. Amount = quantity × unit cost. Total shown: ${formatZmw(total)}`} />
      <RecordWorkbench
        canRecord={hasPermission(profile.role, "recordExpense")}
        canMutate={canMutateTransactions(profile.role)}
        deleteTable="expenses"
        rows={records}
        columns={[
          { id: "code", header: "ID", field: "code" },
          { id: "entryDate", header: "Date", field: "entryDate" },
          { id: "flock", header: "Flock", field: "flock" },
          { id: "category", header: "Category", field: "category" },
          { id: "amount", header: "Amount", field: "amount" },
          { id: "paymentMethod", header: "Method", field: "paymentMethod" },
        ]}
      >
        <ExpenseForm
          flocks={flocks.map((f) => ({ id: f.id, label: f.code }))}
          suppliers={m.suppliers.map((s) => ({ id: s.id, label: s.name }))}
          categories={cats}
          methods={methods}
        />
      </RecordWorkbench>
    </div>
  );
}
