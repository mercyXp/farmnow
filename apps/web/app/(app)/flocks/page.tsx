import Link from "next/link";
import { hasPermission } from "@farmnow/domain";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { EmptyState, PageHeader } from "@/components/page-header";
import { listFlockKpis } from "@/features/flocks/queries";
import { requireUser } from "@/lib/supabase/server";
import { formatNumber, formatPct } from "@/lib/utils";

export default async function FlocksPage() {
  const { profile } = await requireUser();
  const canCreate = hasPermission(profile.role, "createFlock");
  const flocks = await listFlockKpis();
  const rows = flocks.map((f) => ({
    id: f.flock_id,
    flock: f.flock_code,
    breed: f.breed_name,
    placed: f.placed_date,
    initial: f.initial_birds,
    remaining: f.remaining_birds,
    age: `${f.days_on_farm}d`,
    status: f.status,
    mortalityPct: formatPct(1 - Number(f.livability_pct)),
    fcr: formatNumber(Number(f.fcr), 2),
    open: "Open",
    href: `/flocks/${f.flock_id}`,
  }));
  return (
    <div>
      <PageHeader
        title="Flocks"
        description="Placement batches with live KPIs derived from transactions."
        actions={
          canCreate ? (
            <Button asChild>
              <Link href="/flocks/new">New flock</Link>
            </Button>
          ) : undefined
        }
      />
      {flocks.length === 0 ? (
        <EmptyState
          title="No flocks have been registered yet."
          description={canCreate ? "Create the first placement batch to start recording mortality, feed, and sales." : "No flocks are available yet."}
          actionHref={canCreate ? "/flocks/new" : undefined}
          actionLabel={canCreate ? "Create first flock" : undefined}
        />
      ) : (
        <DataTable
          rowKeyField="id"
          rows={rows}
          searchPlaceholder="Search flocks…"
          columns={[
            { id: "flock", header: "Flock", field: "flock", hrefField: "href" },
            { id: "breed", header: "Breed", field: "breed" },
            { id: "placed", header: "Placed", field: "placed" },
            { id: "initial", header: "Initial", field: "initial" },
            { id: "remaining", header: "Remaining", field: "remaining" },
            { id: "age", header: "Age", field: "age" },
            { id: "status", header: "Status", field: "status" },
            { id: "mortalityPct", header: "Mortality %", field: "mortalityPct" },
            { id: "fcr", header: "FCR", field: "fcr" },
            { id: "open", header: "", field: "open", hrefField: "href", filterable: false, sortable: false },
          ]}
        />
      )}
    </div>
  );
}
