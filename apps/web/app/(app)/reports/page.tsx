import { hasPermission } from "@farmnow/domain";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { requirePagePermission } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import { signedFileUrl } from "@/lib/storage";
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
  const { data: archived } = await supabase
    .from("generated_reports")
    .select("*, flocks(code)")
    .order("created_at", { ascending: false })
    .limit(50);
  const archiveRows = await Promise.all(
    (archived ?? []).map(async (r) => {
      const url = await signedFileUrl(supabase, "reports", r.storage_path);
      return {
        id: r.id,
        type: r.report_type,
        flock: (r.flocks as { code: string } | null)?.code ?? (r.report_type === "financial" ? "All flocks" : ""),
        fileName: r.file_name,
        created: r.created_at.slice(0, 19).replace("T", " "),
        open: url ? "Download" : "Unavailable",
        href: url ?? "",
      };
    }),
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Reports"
        description="The three Excel reports: flock performance, mortality & health, and financial summary. No date filter — each report covers the full flock history."
      />
      {canOps ? (
        <form className="flex flex-wrap items-end gap-3">
          <label className="space-y-1 text-sm">
            <span>Flock (flock & mortality reports)</span>
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
      ) : null}
      {kpi && canOps ? (
        <Card>
          <CardHeader>
            <CardTitle>{kpi.flock_code} snapshot</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-sm">
            <p>Livability {formatPct(Number(kpi.livability_pct))}</p>
            <p>FCR {formatNumber(Number(kpi.fcr), 2)}</p>
            <p>ADG {formatNumber(Number(kpi.adg_g), 1)} g</p>
            <p>Remaining {kpi.remaining_birds}</p>
            {canFin ? <p>Sales {formatZmw(Number(kpi.total_sales_value))}</p> : null}
            {canFin ? <p>Profit {formatZmw(Number(kpi.estimated_profit))}</p> : null}
            <p>Mortality {kpi.total_mortality}</p>
          </CardContent>
        </Card>
      ) : null}
      <div className="flex flex-wrap gap-3">
        {canOps ? (
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
      <section className="space-y-3">
        <h2 className="font-serif text-xl">Archived reports</h2>
        <DataTable
          rowKeyField="id"
          rows={archiveRows}
          emptyTitle="No PDFs archived yet."
          emptyDescription="Generate a report to store it in Supabase Storage."
          columns={[
            { id: "created", header: "Generated", field: "created" },
            { id: "type", header: "Type", field: "type" },
            { id: "flock", header: "Flock", field: "flock" },
            { id: "fileName", header: "File", field: "fileName" },
            { id: "open", header: "", field: "open", hrefField: "href", filterable: false, sortable: false },
          ]}
        />
      </section>
    </div>
  );
}
