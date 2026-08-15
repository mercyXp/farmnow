import { canMutateTransactions, hasPermission } from "@farmnow/domain";
import { PageHeader } from "@/components/page-header";
import { MortalityForm } from "@/features/transactions/forms";
import { RecordWorkbench } from "@/features/transactions/workbench";
import { activeFlocks, lookup } from "@/features/transactions/queries";
import { requireUser } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";

export default async function MortalityPage() {
  const { profile } = await requireUser();
  const supabase = await createClient();
  const [{ data: rows }, flocks, causes] = await Promise.all([
    supabase.from("mortality_entries").select("*, flocks(code)").eq("is_active", true).order("entry_date", { ascending: false }).limit(500),
    activeFlocks(),
    lookup("MortalityCause"),
  ]);
  const named = flocks.map((f) => ({ id: f.id, label: f.code }));
  const records = (rows ?? []).map((r) => ({
    id: r.id,
    code: r.code,
    flockId: r.flock_id,
    flock: (r.flocks as { code: string } | null)?.code ?? "",
    entryDate: r.entry_date,
    mortalityCount: r.mortality_count,
    cause: r.cause,
  }));

  return (
    <div className="space-y-8">
      <PageHeader title="Daily mortality" description="One entry per flock per day. Count cannot exceed remaining birds." />
      <RecordWorkbench
        canRecord={hasPermission(profile.role, "recordMortality")}
        canMutate={canMutateTransactions(profile.role)}
        deleteTable="mortality_entries"
        emptyTitle="No mortality recorded yet."
        emptyDescription="Log the first daily count for an active flock."
        rows={records}
        columns={[
          { id: "code", header: "ID", field: "code" },
          { id: "flock", header: "Flock", field: "flock" },
          { id: "entryDate", header: "Date", field: "entryDate" },
          { id: "mortalityCount", header: "Count", field: "mortalityCount" },
          { id: "cause", header: "Cause", field: "cause" },
        ]}
      >
        <MortalityForm flocks={named} causes={causes} />
      </RecordWorkbench>
    </div>
  );
}
