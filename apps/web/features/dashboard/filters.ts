import type { FlockKpi } from "@farmnow/database";

export type DashboardStatusFilter = "active" | "closed" | "all";

export type DashboardFilters = {
  from: string | null;
  to: string | null;
  flockId: string | null;
  status: DashboardStatusFilter;
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function isoDate(value: string | undefined): string | null {
  if (!value || !ISO_DATE.test(value)) return null;
  return value;
}

export function parseDashboardFilters(input: {
  from?: string;
  to?: string;
  flock?: string;
  status?: string;
}): DashboardFilters {
  const from = isoDate(input.from);
  const to = isoDate(input.to);
  const ordered = from && to && from > to ? { from: to, to: from } : { from, to };
  const status: DashboardStatusFilter =
    input.status === "closed" || input.status === "all" ? input.status : "active";
  const flockId = input.flock && input.flock.length > 0 ? input.flock : null;
  return { ...ordered, flockId, status };
}

export function filterDashboardKpis(kpis: FlockKpi[], filters: DashboardFilters): FlockKpi[] {
  return kpis.filter((k) => {
    if (filters.flockId && k.flock_id !== filters.flockId) return false;
    if (!filters.flockId) {
      if (filters.status === "active" && k.status !== "Active") return false;
      if (filters.status === "closed" && k.status !== "Closed") return false;
    }
    if (filters.from && k.placed_date < filters.from) return false;
    if (filters.to && k.placed_date > filters.to) return false;
    return true;
  });
}

export function filtersAreDefault(filters: DashboardFilters): boolean {
  return !filters.from && !filters.to && !filters.flockId && filters.status === "active";
}
