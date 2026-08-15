import { canMutateTransactions, hasPermission } from "@farmnow/domain";
import { PageHeader } from "@/components/page-header";
import { IncomeForm } from "@/features/transactions/forms";
import { RecordWorkbench } from "@/features/transactions/workbench";
import { lookup } from "@/features/transactions/queries";
import { requireUser } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import { formatZmw } from "@/lib/utils";

export default async function IncomePage() {
  const { profile } = await requireUser();
  const supabase = await createClient();
  const [sources, methods, { data: rows }] = await Promise.all([
    lookup("IncomeSource"),
    lookup("PaymentMethod"),
    supabase.from("other_income").select("*").eq("is_active", true).order("entry_date", { ascending: false }),
  ]);
  const records = (rows ?? []).map((r) => ({
    id: r.id,
    code: r.code,
    entryDate: r.entry_date,
    source: r.source,
    description: r.description,
    amount: Number(r.amount),
    amountLabel: formatZmw(Number(r.amount)),
    paymentMethod: r.payment_method,
    receivedBy: r.received_by,
  }));
  return (
    <div className="space-y-8">
      <PageHeader title="Other income" description="Manure, empty bags, and other non-bird income. Not included in estimated flock profit (Excel parity)." />
      <RecordWorkbench
        canRecord={hasPermission(profile.role, "recordIncome")}
        canMutate={canMutateTransactions(profile.role)}
        deleteTable="other_income"
        rows={records}
        columns={[
          { id: "code", header: "ID", field: "code" },
          { id: "entryDate", header: "Date", field: "entryDate" },
          { id: "source", header: "Source", field: "source" },
          { id: "description", header: "Description", field: "description" },
          { id: "amountLabel", header: "Amount", field: "amountLabel" },
        ]}
      >
        <IncomeForm sources={sources} methods={methods} />
      </RecordWorkbench>
    </div>
  );
}
