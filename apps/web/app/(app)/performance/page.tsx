import { hasPermission } from "@farmnow/domain";
import { PageHeader } from "@/components/page-header";
import { DataRows } from "@/components/data-rows";
import { WeightForm } from "@/features/transactions/forms";
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
  const { data: weights } = await supabase.from("weekly_weights").select("*, flocks(code)").eq("is_active", true).order("entry_date", { ascending: false }).limit(80);
  return (
    <div className="space-y-8">
      <PageHeader title="Flock performance" description="KPI snapshot plus weekly weigh-ins. FCR and ADG follow the Excel KPI engine." />
      <DataRows
        headers={canFin ? ["Flock", "Status", "Livability", "FCR", "ADG", "Cost/bird"] : ["Flock", "Status", "Livability", "FCR", "ADG"]}
        rows={kpis.map((k) =>
          canFin
            ? [k.flock_code, k.status, formatPct(Number(k.livability_pct)), formatNumber(Number(k.fcr), 2), formatNumber(Number(k.adg_g), 1), formatZmw(Number(k.cost_per_bird))]
            : [k.flock_code, k.status, formatPct(Number(k.livability_pct)), formatNumber(Number(k.fcr), 2), formatNumber(Number(k.adg_g), 1)],
        )}
      />
      {canRecord ? (
        <>
          <h2 className="font-serif text-xl">Record weigh-in</h2>
          <WeightForm flocks={flocks.map((f) => ({ id: f.id, label: f.code }))} />
        </>
      ) : null}
      <DataRows
        headers={["ID", "Flock", "Date", "Week", "Avg g"]}
        rows={(weights ?? []).map((r) => [r.code, (r.flocks as { code: string } | null)?.code ?? "", r.entry_date, String(r.week_no), String(r.avg_body_weight_g)])}
      />
    </div>
  );
}
