import { requireUser } from "@/lib/supabase/server";
import { getDashboardData, getRecentAudit, getRecentEntries } from "@/features/dashboard/queries";
import { RoleDashboard } from "@/features/dashboard/role-dashboards";

export default async function DashboardPage() {
  const { profile } = await requireUser();
  const [data, recent, audit] = await Promise.all([
    getDashboardData(),
    getRecentEntries(),
    profile.role === "superadmin" || profile.role === "admin" ? getRecentAudit() : Promise.resolve([]),
  ]);
  return <RoleDashboard role={profile.role} data={data} recent={recent} audit={audit} />;
}
