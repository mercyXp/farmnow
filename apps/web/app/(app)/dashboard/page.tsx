import { requireUser } from "@/lib/supabase/server";
import { getDashboardData, getRecentAudit, getRecentEntries } from "@/features/dashboard/queries";
import { RoleDashboard } from "@/features/dashboard/role-dashboards";
import { filterDashboardKpis, parseDashboardFilters } from "@/features/dashboard/filters";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; flock?: string; status?: string }>;
}) {
  const { profile } = await requireUser();
  const filters = parseDashboardFilters(await searchParams);
  const [raw, recent, audit] = await Promise.all([
    getDashboardData(),
    getRecentEntries(filters),
    profile.role === "superadmin" || profile.role === "admin" ? getRecentAudit(filters) : Promise.resolve([]),
  ]);

  const kpis = filterDashboardKpis(raw.kpis, filters);
  const medicine = filters.flockId ? raw.medicine.filter((m) => m.flock_id === filters.flockId) : raw.medicine;
  const data = { ...raw, kpis, medicine };
  const allFlocks = raw.kpis.map((k) => ({ id: k.flock_id, code: k.flock_code, status: k.status }));

  return (
    <RoleDashboard
      role={profile.role}
      data={data}
      recent={recent}
      audit={audit}
      filters={filters}
      allFlocks={allFlocks}
      totalCount={raw.kpis.length}
    />
  );
}
