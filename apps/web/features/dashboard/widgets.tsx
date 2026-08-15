import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber, formatPct, formatZmw } from "@/lib/utils";
import type { DashboardData } from "@/features/dashboard/queries";
import { activeKpiSummary, dashboardAlerts } from "@/features/dashboard/queries";
import { DashboardCharts } from "@/features/dashboard/charts";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { AppRole, QuickAction } from "@farmnow/domain";
import { QUICK_ACTIONS } from "@farmnow/domain";

export function KpiWidget({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      </CardHeader>
      <CardContent>
        <p className="font-serif text-3xl">{value}</p>
        {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}

export function QuickActions({ role }: { role: AppRole }) {
  const actions: QuickAction[] = QUICK_ACTIONS[role];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick actions</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {actions.map((a) => (
          <Button key={a.href} asChild variant="secondary" size="sm">
            <Link href={a.href}>{a.label}</Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}

export function AlertCard({ data }: { data: DashboardData }) {
  const alerts = dashboardAlerts(data.kpis, data.settings);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Operational alerts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {alerts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No active flocks to alert on.</p>
        ) : (
          alerts.map((a) => (
            <div key={a.code} className="flex items-start justify-between gap-3 rounded-lg bg-muted/50 px-3 py-2">
              <span className="font-medium">{a.code}</span>
              <span className="text-sm text-muted-foreground">{a.message || "—"}</span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export function InventoryAlerts({ data }: { data: DashboardData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory & expiry</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {data.feed.map((f) => (
          <div key={f.feed_type_id} className="flex items-center justify-between gap-3 rounded-lg bg-muted/50 px-3 py-2">
            <span>{f.feed_name} feed stock</span>
            <Badge variant={f.alert === "LOW STOCK" ? "warn" : "ok"}>
              {f.alert} ({formatNumber(Number(f.balance_kg))} kg)
            </Badge>
          </div>
        ))}
        {data.medicine.map((m) => (
          <div key={`${m.lot_number}-${m.flock_id}`} className="flex items-center justify-between gap-3 rounded-lg bg-muted/50 px-3 py-2">
            <span>
              {m.lot_number} ({m.flock_code})
            </span>
            <Badge variant={m.expiry_status === "OK" ? "ok" : m.expiry_status === "EXPIRED" ? "danger" : "warn"}>
              {m.expiry_status}
            </Badge>
          </div>
        ))}
        {data.feed.length === 0 && data.medicine.length === 0 ? (
          <p className="text-sm text-muted-foreground">No inventory alerts.</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function FarmKpis({ data }: { data: DashboardData }) {
  const s = activeKpiSummary(data.kpis);
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <KpiWidget label="Active flocks" value={formatNumber(s.activeCount)} />
      <KpiWidget label="Current birds (Excel)" value={formatNumber(s.currentBirds)} hint="Initial − mortality" />
      <KpiWidget label="Birds remaining" value={formatNumber(s.remainingBirds)} />
      <KpiWidget label="Livability % (active)" value={formatPct(s.livability)} />
      <KpiWidget label="Mortality % (active)" value={formatPct(s.mortalityPct)} />
      <KpiWidget label="Avg FCR (active)" value={formatNumber(s.avgFcr, 2)} />
    </div>
  );
}

export function FinancialKpis({ data }: { data: DashboardData }) {
  const s = activeKpiSummary(data.kpis);
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiWidget label="Sales (ZMW)" value={formatZmw(s.sales)} />
      <KpiWidget label="Production costs" value={formatZmw(s.expenses)} />
      <KpiWidget label="Estimated profit" value={formatZmw(s.profit)} />
      <KpiWidget label="Avg cost / bird" value={formatZmw(s.avgCostPerBird)} />
    </div>
  );
}

export function OpsCharts({ data }: { data: DashboardData }) {
  return (
    <div className="mt-8">
      <DashboardCharts kpis={data.kpis} showCost={false} />
    </div>
  );
}

export function FullCharts({ data }: { data: DashboardData }) {
  return (
    <div className="mt-8">
      <DashboardCharts kpis={data.kpis} showCost />
    </div>
  );
}
