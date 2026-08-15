import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import type { DashboardFilters } from "@/features/dashboard/filters";
import { filtersAreDefault } from "@/features/dashboard/filters";

type FlockOption = { id: string; code: string; status: string };

export function DashboardFilterBar({
  filters,
  flocks,
  resultCount,
  totalCount,
}: {
  filters: DashboardFilters;
  flocks: FlockOption[];
  resultCount: number;
  totalCount: number;
}) {
  return (
    <form method="get" action="/dashboard" className="rounded-xl border bg-card p-4">
      <div className="flex flex-wrap items-end gap-3">
        <label className="space-y-1 text-sm">
          <Label htmlFor="from">Placed from</Label>
          <Input id="from" name="from" type="date" defaultValue={filters.from ?? ""} className="w-40" />
        </label>
        <label className="space-y-1 text-sm">
          <Label htmlFor="to">Placed to</Label>
          <Input id="to" name="to" type="date" defaultValue={filters.to ?? ""} className="w-40" />
        </label>
        <label className="space-y-1 text-sm">
          <Label htmlFor="flock">Flock</Label>
          <select
            id="flock"
            name="flock"
            defaultValue={filters.flockId ?? ""}
            className="block h-10 min-w-40 rounded-md border bg-card px-3 text-sm"
          >
            <option value="">All flocks</option>
            {flocks.map((f) => (
              <option key={f.id} value={f.id}>
                {f.code} ({f.status})
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-sm">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            defaultValue={filters.status}
            className="block h-10 rounded-md border bg-card px-3 text-sm"
          >
            <option value="active">Active</option>
            <option value="closed">Closed</option>
            <option value="all">All</option>
          </select>
        </label>
        <Button type="submit" variant="secondary">
          Apply
        </Button>
        {!filtersAreDefault(filters) ? (
          <Button asChild variant="outline">
            <Link href="/dashboard">Reset</Link>
          </Button>
        ) : null}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Showing {resultCount} of {totalCount} flocks. Date range filters by placement date. KPI totals follow the Excel
        snapshot for the flocks in view.
      </p>
    </form>
  );
}
