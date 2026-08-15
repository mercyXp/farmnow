import { hasPermission } from "@farmnow/domain";
import { PageHeader } from "@/components/page-header";
import { DataRows } from "@/components/data-rows";
import { IncomeForm } from "@/features/transactions/forms";
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
  return (
    <div className="space-y-8">
      <PageHeader title="Other income" description="Manure, empty bags, and other non-bird income. Not included in estimated flock profit (Excel parity)." />
      {hasPermission(profile.role, "recordIncome") ? <IncomeForm sources={sources} methods={methods} /> : null}
      <DataRows
        headers={["ID", "Date", "Source", "Description", "Amount"]}
        rows={(rows ?? []).map((r) => [r.code, r.entry_date, r.source, r.description, formatZmw(Number(r.amount))])}
      />
    </div>
  );
}
