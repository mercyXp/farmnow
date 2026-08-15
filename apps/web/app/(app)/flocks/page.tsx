import Link from "next/link";
import { hasPermission } from "@farmnow/domain";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { EmptyState, PageHeader } from "@/components/page-header";
import { listFlockKpis } from "@/features/flocks/queries";
import { requireUser } from "@/lib/supabase/server";
import { formatNumber, formatPct } from "@/lib/utils";

export default async function FlocksPage() {
  const { profile } = await requireUser();
  const canCreate = hasPermission(profile.role, "createFlock");
  const flocks = await listFlockKpis();
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
        <div className="overflow-hidden rounded-xl border bg-card">
          <Table>
            <THead>
              <TR>
                <TH>Flock</TH>
                <TH>Breed</TH>
                <TH>Placed</TH>
                <TH>Initial</TH>
                <TH>Remaining</TH>
                <TH>Age</TH>
                <TH>Status</TH>
                <TH>Mortality %</TH>
                <TH>FCR</TH>
                <TH></TH>
              </TR>
            </THead>
            <TBody>
              {flocks.map((f) => (
                <TR key={f.flock_id}>
                  <TD className="font-medium">{f.flock_code}</TD>
                  <TD>{f.breed_name}</TD>
                  <TD>{f.placed_date}</TD>
                  <TD>{formatNumber(f.initial_birds)}</TD>
                  <TD>{formatNumber(f.remaining_birds)}</TD>
                  <TD>{f.days_on_farm}d</TD>
                  <TD>
                    <Badge variant={f.status === "Active" ? "ok" : "muted"}>{f.status}</Badge>
                  </TD>
                  <TD>{formatPct(1 - Number(f.livability_pct))}</TD>
                  <TD>{formatNumber(Number(f.fcr), 2)}</TD>
                  <TD>
                    <Link className="text-sm text-primary underline" href={`/flocks/${f.flock_id}`}>
                      Open
                    </Link>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </div>
      )}
    </div>
  );
}
