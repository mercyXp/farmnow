import type { FlockKpi, FeedStock } from "@farmnow/database";
import { flockAlert, flockAlertMessage } from "@farmnow/domain";
import { createClient } from "@/lib/supabase/server";
import type { DashboardFilters } from "@/features/dashboard/filters";

export type DashboardData = {
  kpis: FlockKpi[];
  feed: FeedStock[];
  medicine: Array<{
    lot_number: string;
    flock_id: string;
    expiry_status: string;
    flock_code?: string;
  }>;
  settings: Record<string, string>;
};

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = await createClient();
  const [{ data: kpis }, { data: feed }, { data: medicine }, { data: settings }, { data: flocks }] = await Promise.all([
    supabase.from("v_flock_kpis").select("*").order("flock_code"),
    supabase.from("v_feed_stock").select("*"),
    supabase.from("v_medicine_lots").select("lot_number, flock_id, expiry_status").eq("is_active", true),
    supabase.from("settings").select("key, value"),
    supabase.from("flocks").select("id, code"),
  ]);

  const flockCodes = new Map((flocks ?? []).map((f) => [f.id, f.code]));
  return {
    kpis: (kpis ?? []) as FlockKpi[],
    feed: (feed ?? []) as FeedStock[],
    medicine: (medicine ?? []).map((row) => ({
      ...row,
      flock_code: flockCodes.get(row.flock_id),
    })),
    settings: Object.fromEntries((settings ?? []).map((s) => [s.key, s.value])),
  };
}

/** Summarise the flocks already selected by dashboard filters. */
export function kpiSummary(kpis: FlockKpi[]) {
  const sum = (fn: (k: FlockKpi) => number) => kpis.reduce((a, k) => a + Number(fn(k) || 0), 0);
  const avg = (fn: (k: FlockKpi) => number) => (kpis.length ? sum(fn) / kpis.length : 0);
  const initial = sum((k) => k.initial_birds);
  const current = sum((k) => k.current_birds);
  const livability = initial === 0 ? 0 : current / initial;
  return {
    flockCount: kpis.length,
    activeCount: kpis.filter((k) => k.status === "Active").length,
    totalBirds: initial,
    currentBirds: current,
    remainingBirds: sum((k) => k.remaining_birds),
    livability,
    mortalityPct: 1 - livability,
    avgFcr: avg((k) => Number(k.fcr)),
    avgAdg: avg((k) => Number(k.adg_g)),
    avgCostPerBird: avg((k) => Number(k.cost_per_bird)),
    avgCostPerKg: avg((k) => Number(k.cost_per_kg)),
    sales: sum((k) => Number(k.total_sales_value)),
    expenses: sum((k) => Number(k.total_expenses) + Number(k.total_feed_cost) + Number(k.medicine_cost)),
    profit: sum((k) => Number(k.estimated_profit)),
  };
}

export const activeKpiSummary = kpiSummary;

export function dashboardAlerts(kpis: FlockKpi[], settings: Record<string, string>) {
  const targetLivability = Number(settings.TargetLivabilityPct ?? 0.95);
  const targetFcr = Number(settings.TargetFCR ?? 1.7);
  return kpis
    .map((k) => {
      const kind = flockAlert({
        status: k.status,
        livability: Number(k.livability_pct),
        fcrValue: Number(k.fcr),
        targetLivabilityPct: targetLivability,
        targetFcr,
      });
      return { code: k.flock_code, message: flockAlertMessage(kind), kind };
    })
    .filter((a) => a.kind !== "inactive");
}

export type RecentRow = { kind: string; code: string; when: string };

export async function getRecentEntries(filters?: DashboardFilters): Promise<RecentRow[]> {
  const supabase = await createClient();
  const [mortality, feed, sales, expenses] = await Promise.all([
    supabase.from("mortality_entries").select("code, entry_date, flock_id").eq("is_active", true).order("entry_date", { ascending: false }).limit(30),
    supabase.from("feed_consumption").select("code, entry_date, flock_id").eq("is_active", true).order("entry_date", { ascending: false }).limit(30),
    supabase.from("sales").select("code, entry_date, flock_id").eq("is_active", true).order("entry_date", { ascending: false }).limit(30),
    supabase.from("expenses").select("code, entry_date, flock_id").eq("is_active", true).order("entry_date", { ascending: false }).limit(30),
  ]);
  return [
    ...(mortality.data ?? []).map((r) => ({ kind: "Mortality", code: r.code, when: r.entry_date, flockId: r.flock_id })),
    ...(feed.data ?? []).map((r) => ({ kind: "Feed", code: r.code, when: r.entry_date, flockId: r.flock_id })),
    ...(sales.data ?? []).map((r) => ({ kind: "Sale", code: r.code, when: r.entry_date, flockId: r.flock_id })),
    ...(expenses.data ?? []).map((r) => ({ kind: "Expense", code: r.code, when: r.entry_date, flockId: r.flock_id })),
  ]
    .filter((r) => {
      if (filters?.from && r.when < filters.from) return false;
      if (filters?.to && r.when > filters.to) return false;
      if (filters?.flockId && r.flockId !== filters.flockId) return false;
      return true;
    })
    .sort((a, b) => b.when.localeCompare(a.when))
    .slice(0, 10)
    .map(({ kind, code, when }) => ({ kind, code, when }));
}

export async function getRecentAudit(filters?: DashboardFilters) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("audit_logs")
    .select("action, entity_type, created_at")
    .order("created_at", { ascending: false })
    .limit(40);
  return (data ?? []).filter((row) => {
    const day = row.created_at.slice(0, 10);
    if (filters?.from && day < filters.from) return false;
    if (filters?.to && day > filters.to) return false;
    return true;
  }).slice(0, 8);
}
