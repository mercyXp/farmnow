import { canMutateTransactions, hasPermission } from "@farmnow/domain";
import { PageHeader } from "@/components/page-header";
import { RoutineForm } from "@/features/transactions/forms";
import { RecordWorkbench } from "@/features/transactions/workbench";
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
    supabase.from("daily_routines").select("*, flocks(code)").eq("is_active", true).order("entry_date", { ascending: false }).limit(500),
  ]);
  const records = (rows ?? []).map((r) => ({
    id: r.id,
    code: r.code,
    flockId: r.flock_id,
    flock: (r.flocks as { code: string } | null)?.code ?? "",
    entryDate: r.entry_date,
    temperatureC: Number(r.temperature_c),
    humidityPct: Number(r.humidity_pct),
    waterAvailable: r.water_available,
    feedAvailable: r.feed_available,
    drinkersCleaned: r.drinkers_cleaned,
    litterCondition: r.litter_condition,
    ventilation: r.ventilation,
    sickBirdsObserved: r.sick_birds_observed,
    employeeId: r.employee_id,
    notes: r.notes ?? "",
  }));
  return (
    <div className="space-y-8">
      <PageHeader title="Daily routine" description="Floor-walk checklist: temperature, water, feed, litter, ventilation, sick birds." />
      <RecordWorkbench
        canRecord={hasPermission(profile.role, "recordRoutine")}
        canMutate={canMutateTransactions(profile.role)}
        deleteTable="daily_routines"
        rows={records}
        columns={[
          { id: "code", header: "ID", field: "code" },
          { id: "flock", header: "Flock", field: "flock" },
          { id: "entryDate", header: "Date", field: "entryDate" },
          { id: "temperatureC", header: "Temp", field: "temperatureC" },
          { id: "litterCondition", header: "Litter", field: "litterCondition" },
          { id: "ventilation", header: "Ventilation", field: "ventilation" },
          { id: "sickBirdsObserved", header: "Sick", field: "sickBirdsObserved" },
        ]}
      >
        <RoutineForm
          flocks={flocks.map((f) => ({ id: f.id, label: f.code }))}
          employees={m.employees.map((e) => ({ id: e.id, label: e.name }))}
          litter={litter}
          ventilation={vent}
        />
      </RecordWorkbench>
    </div>
  );
}
