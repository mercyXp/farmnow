import { hasPermission } from "@farmnow/domain";
import { PageHeader } from "@/components/page-header";
import { DataRows } from "@/components/data-rows";
import { RoutineForm } from "@/features/transactions/forms";
import { activeFlocks, lookup, masters } from "@/features/transactions/queries";
import { requireUser } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";

export default async function RoutinesPage() {
  const { profile } = await requireUser();
  const supabase = await createClient();
  const [flocks, litter, vent, m, { data: rows }] = await Promise.all([
    activeFlocks(),
    lookup("LitterCondition"),
    lookup("Ventilation"),
    masters(),
    supabase.from("daily_routines").select("*, flocks(code)").eq("is_active", true).order("entry_date", { ascending: false }).limit(80),
  ]);
  return (
    <div className="space-y-8">
      <PageHeader title="Daily routine" description="Floor-walk checklist: temperature, water, feed, litter, ventilation, sick birds." />
      {hasPermission(profile.role, "recordRoutine") ? (
        <RoutineForm
          flocks={flocks.map((f) => ({ id: f.id, label: f.code }))}
          employees={m.employees.map((e) => ({ id: e.id, label: e.name }))}
          litter={litter}
          ventilation={vent}
        />
      ) : null}
      <DataRows
        headers={["ID", "Flock", "Date", "Temp", "Litter", "Ventilation", "Sick"]}
        rows={(rows ?? []).map((r) => [r.code, (r.flocks as { code: string } | null)?.code ?? "", r.entry_date, String(r.temperature_c), r.litter_condition, r.ventilation, String(r.sick_birds_observed)])}
      />
    </div>
  );
}
