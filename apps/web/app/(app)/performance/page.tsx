import { canMutateTransactions, hasPermission } from "@farmnow/domain";
import { PageHeader } from "@/components/page-header";
import { DataTable } from "@/components/data-table";
import { WeightForm } from "@/features/transactions/forms";
import { RecordWorkbench } from "@/features/transactions/workbench";
import { activeFlocks } from "@/features/transactions/queries";
import { listFlockKpis } from "@/features/flocks/queries";
import { requireUser } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import { formatNumber, formatPct, formatZmw } from "@/lib/utils";

export default async function PerformancePage() {
  const { profile } = await requireUser();
  const canRecord = hasPermission(profile.role, "recordMortality");
  const canFin = hasPermission(profile.role, "viewFinancials");
  const [kpis, flocks] = await Promise.all([listFlockKpis(), activeFlocks()]);
  const supabase = await createClient();
  const { data: weights } = await supabase.from("weekly_weights").select("*, flocks(code)").eq("is_active", true).order("entry_date", { ascending: false }).limit(500);
  const kpiRows = kpis.map((k) => ({
    id: k.flock_id,
    flock: k.flock_code,
    status: k.status,
    livability: formatPct(Number(k.livability_pct)),
    fcr: formatNumber(Number(k.fcr), 2),
    adg: formatNumber(Number(k.adg_g), 1),
    costPerBird: formatZmw(Number(k.cost_per_bird)),
  }));
  const weightRows = (weights ?? []).map((r) => ({
    id: r.id,
    code: r.code,
    flockId: r.flock_id,
    flock: (r.flocks as { code: string } | null)?.code ?? "",
    entryDate: r.entry_date,
    weekNo: r.week_no,
    sampleSize: r.sample_size,
    avgBodyWeightG: Number(r.avg_body_weight_g),
  }));
  return (
    <div className="space-y-8">
      <PageHeader title="Flock performance" description="KPI snapshot plus weekly weigh-ins. FCR and ADG follow the Excel KPI engine." />
      <DataTable
        rowKeyField="id"
        rows={kpiRows}
        emptyTitle="No flock KPIs yet."
        emptyDescription="Create a flock and record activity to see performance."
        columns={[
          { id: "flock", header: "Flock", field: "flock" },
          { id: "status", header: "Status", field: "status" },
          { id: "livability", header: "Livability", field: "livability" },
          { id: "fcr", header: "FCR", field: "fcr" },
          { id: "adg", header: "ADG", field: "adg" },
          ...(canFin ? [{ id: "costPerBird" as const, header: "Cost/bird", field: "costPerBird" as const }] : []),
        ]}
      />
      <h2 className="font-serif text-xl">Record weigh-in</h2>
      <RecordWorkbench
        canRecord={canRecord}
        canMutate={canMutateTransactions(profile.role)}
        deleteTable="weekly_weights"
        rows={weightRows}
        columns={[
          { id: "code", header: "ID", field: "code" },
          { id: "flock", header: "Flock", field: "flock" },
          { id: "entryDate", header: "Date", field: "entryDate" },
          { id: "weekNo", header: "Week", field: "weekNo" },
          { id: "avgBodyWeightG", header: "Avg g", field: "avgBodyWeightG" },
        ]}
      >
        <WeightForm flocks={flocks.map((f) => ({ id: f.id, label: f.code }))} />
      </RecordWorkbench>
    </div>
  );
}
