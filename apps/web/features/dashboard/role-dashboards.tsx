import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardData, RecentRow } from "@/features/dashboard/queries";
import { DashboardFilterBar } from "@/features/dashboard/filter-bar";
import type { DashboardFilters } from "@/features/dashboard/filters";
import {
  AlertCard,
  FarmKpis,
  FinancialKpis,
  FullCharts,
  InventoryAlerts,
  OpsCharts,
  QuickActions,
} from "@/features/dashboard/widgets";
import type { AppRole } from "@farmnow/domain";

function Shell({
  title,
  description,
  filters,
  children,
}: {
  title: string;
  description: string;
  filters: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-8">
      <PageHeader title={title} description={description} />
      {filters}
      {children}
    </div>
  );
}

export function SuperadminDashboard({
  data,
  audit,
  role,
  filterBar,
}: {
  data: DashboardData;
  audit: Array<{ action: string; entity_type: string; created_at: string }>;
  role: AppRole;
  filterBar: React.ReactNode;
}) {
  return (
    <Shell title="Executive dashboard" description="Business, farm, and system overview for the company owner." filters={filterBar}>
      <FarmKpis data={data} />
      <FinancialKpis data={data} />
      <FullCharts data={data} />
      <QuickActions role={role} />
      <div className="grid gap-4 lg:grid-cols-2">
        <AlertCard data={data} />
        <InventoryAlerts data={data} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent system activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {audit.length === 0 ? (
            <p className="text-muted-foreground">No audit events yet.</p>
          ) : (
            audit.map((a, i) => (
              <p key={`${a.created_at}-${i}`}>
                <span className="font-medium">{a.action}</span> · {a.entity_type} · {a.created_at.slice(0, 16).replace("T", " ")}
              </p>
            ))
          )}
        </CardContent>
      </Card>
    </Shell>
  );
}

export function AdminDashboard({
  data,
  role,
  filterBar,
}: {
  data: DashboardData;
  role: AppRole;
  filterBar: React.ReactNode;
}) {
  return (
    <Shell title="Administration dashboard" description="Farm operations, inventory, flocks, and alerts." filters={filterBar}>
      <FarmKpis data={data} />
      <OpsCharts data={data} />
      <QuickActions role={role} />
      <div className="grid gap-4 lg:grid-cols-2">
        <AlertCard data={data} />
        <InventoryAlerts data={data} />
      </div>
    </Shell>
  );
}

export function ManagerDashboard({
  data,
  role,
  filterBar,
}: {
  data: DashboardData;
  role: AppRole;
  filterBar: React.ReactNode;
}) {
  return (
    <Shell title="Management dashboard" description="Performance, financial summaries, and operational alerts." filters={filterBar}>
      <FarmKpis data={data} />
      <FinancialKpis data={data} />
      <FullCharts data={data} />
      <QuickActions role={role} />
      <div className="grid gap-4 lg:grid-cols-2">
        <AlertCard data={data} />
        <InventoryAlerts data={data} />
      </div>
    </Shell>
  );
}

export function SupervisorDashboard({
  data,
  role,
  filterBar,
}: {
  data: DashboardData;
  role: AppRole;
  filterBar: React.ReactNode;
}) {
  return (
    <Shell title="Farm operations" description="Flocks, daily activities, mortality, feed, medicine, and inventory alerts." filters={filterBar}>
      <FarmKpis data={data} />
      <OpsCharts data={data} />
      <QuickActions role={role} />
      <div className="grid gap-4 lg:grid-cols-2">
        <AlertCard data={data} />
        <InventoryAlerts data={data} />
      </div>
    </Shell>
  );
}

export function AccountantDashboard({
  data,
  role,
  filterBar,
}: {
  data: DashboardData;
  role: AppRole;
  filterBar: React.ReactNode;
}) {
  return (
    <Shell title="Financial dashboard" description="Sales, purchases, expenses, and profitability." filters={filterBar}>
      <FinancialKpis data={data} />
      <FullCharts data={data} />
      <QuickActions role={role} />
    </Shell>
  );
}

export function EntryClerkDashboard({
  data,
  role,
  recent,
  filterBar,
}: {
  data: DashboardData;
  role: AppRole;
  recent: RecentRow[];
  filterBar: React.ReactNode;
}) {
  return (
    <Shell title="Today’s entries" description="Record farm activity. You will only see the tools needed for data entry." filters={filterBar}>
      <QuickActions role={role} />
      <InventoryAlerts data={data} />
      <Card>
        <CardHeader>
          <CardTitle>Recent transactions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {recent.length === 0 ? (
            <p className="text-muted-foreground">No recent entries yet. Use a quick action to record the first one.</p>
          ) : (
            recent.map((r) => (
              <p key={`${r.kind}-${r.code}`}>
                <span className="font-medium">{r.kind}</span> · {r.code} · {r.when}
              </p>
            ))
          )}
        </CardContent>
      </Card>
    </Shell>
  );
}

export function RoleDashboard(props: {
  role: AppRole;
  data: DashboardData;
  recent: RecentRow[];
  audit: Array<{ action: string; entity_type: string; created_at: string }>;
  filters: DashboardFilters;
  allFlocks: Array<{ id: string; code: string; status: string }>;
  totalCount: number;
}) {
  const filterBar = (
    <DashboardFilterBar
      filters={props.filters}
      flocks={props.allFlocks}
      resultCount={props.data.kpis.length}
      totalCount={props.totalCount}
    />
  );
  switch (props.role) {
    case "superadmin":
      return <SuperadminDashboard data={props.data} audit={props.audit} role={props.role} filterBar={filterBar} />;
    case "admin":
      return <AdminDashboard data={props.data} role={props.role} filterBar={filterBar} />;
    case "manager":
      return <ManagerDashboard data={props.data} role={props.role} filterBar={filterBar} />;
    case "supervisor":
      return <SupervisorDashboard data={props.data} role={props.role} filterBar={filterBar} />;
    case "accountant":
      return <AccountantDashboard data={props.data} role={props.role} filterBar={filterBar} />;
    default:
      return <EntryClerkDashboard data={props.data} role={props.role} recent={props.recent} filterBar={filterBar} />;
  }
}
