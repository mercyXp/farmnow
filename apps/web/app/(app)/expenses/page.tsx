import { hasPermission } from "@farmnow/domain";
import { PageHeader } from "@/components/page-header";
import { DataRows } from "@/components/data-rows";
import { ExpenseForm } from "@/features/transactions/forms";
import { activeFlocks, lookup, masters } from "@/features/transactions/queries";
import { requireUser } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import { formatZmw } from "@/lib/utils";
import { expenseAmount } from "@farmnow/domain";

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
  return (
    <div className="space-y-8">
      <PageHeader title="Expenses" description={`Leave flock blank for overhead. Amount = quantity × unit cost. Total shown: ${formatZmw(total)}`} />
      {hasPermission(profile.role, "recordExpense") ? (
        <ExpenseForm
          flocks={flocks.map((f) => ({ id: f.id, label: f.code }))}
          suppliers={m.suppliers.map((s) => ({ id: s.id, label: s.name }))}
          categories={cats}
          methods={methods}
        />
      ) : null}
      <DataRows
        headers={["ID", "Date", "Flock", "Category", "Amount", "Method"]}
        rows={(rows ?? []).map((r) => [
          r.code,
          r.entry_date,
          (r.flocks as { code: string } | null)?.code ?? "Overhead",
          r.category,
          formatZmw(expenseAmount(Number(r.quantity), Number(r.unit_cost))),
          r.payment_method,
        ])}
      />
    </div>
  );
}
