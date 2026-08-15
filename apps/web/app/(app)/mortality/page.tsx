import { hasPermission } from "@farmnow/domain";
import { PageHeader, EmptyState } from "@/components/page-header";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { MortalityForm } from "@/features/transactions/forms";
import { activeFlocks, lookup } from "@/features/transactions/queries";
import { requireUser } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";

export default async function MortalityPage() {
  const { profile } = await requireUser();
  const supabase = await createClient();
  const [{ data: rows }, flocks, causes] = await Promise.all([
    supabase.from("mortality_entries").select("*, flocks(code)").eq("is_active", true).order("entry_date", { ascending: false }).limit(100),
    activeFlocks(),
    lookup("MortalityCause"),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader title="Daily mortality" description="One entry per flock per day. Count cannot exceed remaining birds." />
      {hasPermission(profile.role, "recordMortality") ? (
        <MortalityForm flocks={flocks.map((f) => ({ id: f.id, label: f.code }))} causes={causes} />
      ) : null}
      {(rows ?? []).length === 0 ? (
        <EmptyState title="No mortality recorded yet." description="Log the first daily count for an active flock." />
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card">
          <Table>
            <THead>
              <TR>
                <TH>ID</TH>
                <TH>Flock</TH>
                <TH>Date</TH>
                <TH>Count</TH>
                <TH>Cause</TH>
              </TR>
            </THead>
            <TBody>
              {(rows ?? []).map((r) => (
                <TR key={r.id}>
                  <TD>{r.code}</TD>
                  <TD>{(r.flocks as { code: string } | null)?.code}</TD>
                  <TD>{r.entry_date}</TD>
                  <TD>{r.mortality_count}</TD>
                  <TD>{r.cause}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </div>
      )}
    </div>
  );
}
