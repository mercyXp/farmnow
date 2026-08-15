import { notFound } from "next/navigation";
import Link from "next/link";
import { hasPermission } from "@farmnow/domain";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { PageHeader } from "@/components/page-header";
import { getFlockDetail } from "@/features/flocks/queries";
import { CloseFlockButton } from "@/features/flocks/close-button";
import { requireUser } from "@/lib/supabase/server";
import { formatNumber, formatPct, formatZmw } from "@/lib/utils";
import { daysOnFarm, weeklyAdg } from "@farmnow/domain";

export default async function FlockDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { profile } = await requireUser();
  const { id } = await params;
  const detail = await getFlockDetail(id);
  if (!detail) notFound();
  const { kpi, flock } = detail;
  const canClose = hasPermission(profile.role, "closeFlock");
  const canFin = hasPermission(profile.role, "viewFinancials");
  const canMortality = hasPermission(profile.role, "viewMortality");
  const canFeed = hasPermission(profile.role, "viewFeed");
  const canMedicine = hasPermission(profile.role, "viewMedicine");
  const canSales = hasPermission(profile.role, "viewSales");
  const canPerf = hasPermission(profile.role, "viewPerformance");

  return (
    <div>
      <PageHeader
        title={kpi.flock_code}
        description={`${kpi.breed_name} in ${kpi.house_code} · placed ${kpi.placed_date}`}
        actions={
          <div className="flex gap-2">
            {flock.status === "Active" && canClose ? <CloseFlockButton flockId={flock.id} /> : null}
            <Link className="text-sm text-primary underline self-center" href="/flocks">
              Back to flocks
            </Link>
          </div>
        }
      />
      <div className="mb-6 flex flex-wrap gap-2">
        <Badge variant={kpi.status === "Active" ? "ok" : "muted"}>{kpi.status}</Badge>
        <Badge>{kpi.days_on_farm} days on farm</Badge>
        <Badge variant="muted">{formatNumber(kpi.remaining_birds)} remaining</Badge>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Initial birds" value={formatNumber(kpi.initial_birds)} />
        <Stat label="Current (Excel)" value={formatNumber(kpi.current_birds)} hint="Initial − mortality" />
        <Stat label="Mortality" value={`${formatNumber(kpi.total_mortality)} (${formatPct(1 - Number(kpi.livability_pct))})`} />
        <Stat label="FCR" value={formatNumber(Number(kpi.fcr), 2)} hint={`Breed standard ${formatNumber(Number(kpi.standard_fcr), 2)}`} />
        <Stat label="ADG (g)" value={formatNumber(Number(kpi.adg_g), 1)} />
        <Stat label="Feed used" value={`${formatNumber(Number(kpi.total_feed_kg), 0)} kg`} />
        {canFin ? <Stat label="Sales" value={formatZmw(Number(kpi.total_sales_value))} /> : null}
        {canFin ? <Stat label="Est. profit" value={formatZmw(Number(kpi.estimated_profit))} /> : null}
      </div>

      {canMortality ? (
        <Section title="Mortality">
          <SimpleTable
            headers={["Date", "Count", "Cause"]}
            rows={detail.mortality.map((r) => [r.entry_date, String(r.mortality_count), r.cause])}
          />
        </Section>
      ) : null}
      {canFeed ? (
        <Section title="Feed">
          <SimpleTable
            headers={["Date", "Type", "Kg"]}
            rows={detail.feed.map((r) => {
              const row = r as { entry_date: string; kg_used: number; feed_types?: { name: string } | null };
              return [row.entry_date, row.feed_types?.name ?? "", String(row.kg_used)];
            })}
          />
        </Section>
      ) : null}
      {canPerf ? (
        <Section title="Weekly weights">
          <SimpleTable
            headers={["Date", "Week", "Avg g", "ADG"]}
            rows={detail.weights.map((r) => {
              const age = daysOnFarm(new Date(flock.placed_date), new Date(r.entry_date));
              return [r.entry_date, String(r.week_no), String(r.avg_body_weight_g), weeklyAdg(Number(r.avg_body_weight_g), age).toFixed(1)];
            })}
          />
        </Section>
      ) : null}
      {canMedicine ? (
        <Section title="Health">
          <SimpleTable
            headers={["Date", "Product", "Dosage", "Route"]}
            rows={detail.health.map((r) => {
              const row = r as { entry_date: string; dosage_given: string; route: string; products?: { name: string } | null };
              return [row.entry_date, row.products?.name ?? "", row.dosage_given, row.route];
            })}
          />
        </Section>
      ) : null}
      {canSales ? (
        <Section title="Sales">
          <SimpleTable
            headers={["Date", "Customer", "Birds", "Invoice"]}
            rows={detail.sales.map((r) => {
              const row = r as { entry_date: string; birds_dispatched: number; invoice_no: string; customers?: { name: string } | null };
              return [row.entry_date, row.customers?.name ?? "", String(row.birds_dispatched), row.invoice_no];
            })}
          />
        </Section>
      ) : null}
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <Card>
      <CardHeader className="pb-1">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      </CardHeader>
      <CardContent>
        <p className="font-serif text-2xl">{value}</p>
        {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="mb-3 font-serif text-xl">{title}</h2>
      <div className="overflow-hidden rounded-xl border bg-card">{children}</div>
    </section>
  );
}

function SimpleTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  if (rows.length === 0) {
    return <p className="p-6 text-sm text-muted-foreground">No records yet.</p>;
  }
  return (
    <Table>
      <THead>
        <TR>
          {headers.map((h) => (
            <TH key={h}>{h}</TH>
          ))}
        </TR>
      </THead>
      <TBody>
        {rows.map((row, i) => (
          <TR key={i}>
            {row.map((c, j) => (
              <TD key={j}>{c}</TD>
            ))}
          </TR>
        ))}
      </TBody>
    </Table>
  );
}
