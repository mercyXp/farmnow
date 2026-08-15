import { canMutateTransactions, hasPermission } from "@farmnow/domain";
import { PageHeader } from "@/components/page-header";
import { EnvironmentForm } from "@/features/transactions/forms";
import { RecordWorkbench } from "@/features/transactions/workbench";
import { masters } from "@/features/transactions/queries";
import { requireUser } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";

export default async function EnvironmentPage() {
  const { profile } = await requireUser();
  const supabase = await createClient();
  const [m, { data: rows }] = await Promise.all([
    masters(),
    supabase.from("environment_readings").select("*, houses(code)").eq("is_active", true).order("entry_date", { ascending: false }).limit(500),
  ]);
  const records = (rows ?? []).map((r) => ({
    id: r.id,
    code: r.code,
    houseId: r.house_id,
    house: (r.houses as { code: string } | null)?.code ?? "",
    entryDate: r.entry_date,
    readingTime: r.reading_time,
    temperatureC: Number(r.temperature_c),
    humidityPct: Number(r.humidity_pct),
    ammoniaPpm: Number(r.ammonia_ppm),
  }));
  return (
    <div className="space-y-8">
      <PageHeader title="Environment readings" description="House-level temperature, humidity and ammonia log." />
      <RecordWorkbench
        canRecord={hasPermission(profile.role, "recordEnvironment")}
        canMutate={canMutateTransactions(profile.role)}
        deleteTable="environment_readings"
        rows={records}
        columns={[
          { id: "code", header: "ID", field: "code" },
          { id: "house", header: "House", field: "house" },
          { id: "entryDate", header: "Date", field: "entryDate" },
          { id: "readingTime", header: "Time", field: "readingTime" },
          { id: "temperatureC", header: "Temp", field: "temperatureC" },
          { id: "humidityPct", header: "Humidity", field: "humidityPct" },
          { id: "ammoniaPpm", header: "Ammonia", field: "ammoniaPpm" },
        ]}
      >
        <EnvironmentForm houses={m.houses.map((h) => ({ id: h.id, label: h.code }))} />
      </RecordWorkbench>
    </div>
  );
}
