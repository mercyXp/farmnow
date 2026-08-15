import { hasPermission } from "@farmnow/domain";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requirePagePermission } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import { formatNumber, formatPct, formatZmw } from "@/lib/utils";

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ flockId?: string }>;
}) {
  const { profile } = await requirePagePermission("viewOperationalReports", "viewFinancialReports");
  const canOps = hasPermission(profile.role, "viewOperationalReports");
  const canFin = hasPermission(profile.role, "viewFinancialReports");
  const { flockId } = await searchParams;
  const supabase = await createClient();
  const { data: flocks } = await supabase.from("v_flock_kpis").select("flock_id, flock_code, status").order("flock_code");
  const selected = flockId ?? flocks?.[0]?.flock_id;
  const { data: kpi } = selected
    ? await supabase.from("v_flock_kpis").select("*").eq("flock_id", selected).maybeSingle()
    : { data: null };

  return (
    <div className="space-y-8">
      <PageHeader title="Reports" description="Preview KPIs, then export the Excel-equivalent PDF." />
      <form className="flex flex-wrap items-end gap-3">
        <label className="space-y-1 text-sm">
          <span>Flock</span>
          <select name="flockId" defaultValue={selected} className="block h-10 rounded-md border bg-card px-3">
            {(flocks ?? []).map((f) => (
              <option key={f.flock_id} value={f.flock_id}>
                {f.flock_code} ({f.status})
              </option>
            ))}
          </select>
        </label>
        <Button type="submit" variant="secondary">
          Preview
        </Button>
      </form>
      {kpi ? (
        <Card>
          <CardHeader>
            <CardTitle>{kpi.flock_code} snapshot</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-sm">
            <p>Livability {formatPct(Number(kpi.livability_pct))}</p>
            <p>FCR {formatNumber(Number(kpi.fcr), 2)}</p>
            <p>ADG {formatNumber(Number(kpi.adg_g), 1)} g</p>
            {canFin ? <p>Sales {formatZmw(Number(kpi.total_sales_value))}</p> : null}
            {canFin ? <p>Profit {formatZmw(Number(kpi.estimated_profit))}</p> : null}
            <p>Mortality {kpi.total_mortality}</p>
          </CardContent>
        </Card>
      ) : null}
      <div className="flex flex-wrap gap-3">
        {canOps || canFin ? (
          <Button asChild>
            <a href={`/reports/download?type=flock&flockId=${selected ?? ""}`}>Flock performance PDF</a>
          </Button>
        ) : null}
        {canOps ? (
          <Button asChild variant="secondary">
            <a href={`/reports/download?type=mortality&flockId=${selected ?? ""}`}>Mortality & health PDF</a>
          </Button>
        ) : null}
        {canFin ? (
          <Button asChild variant="outline">
            <a href="/reports/download?type=financial">Financial summary PDF</a>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
