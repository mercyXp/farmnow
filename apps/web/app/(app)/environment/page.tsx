import { hasPermission } from "@farmnow/domain";
import { PageHeader } from "@/components/page-header";
import { DataRows } from "@/components/data-rows";
import { EnvironmentForm } from "@/features/transactions/forms";
import { masters } from "@/features/transactions/queries";
import { requireUser } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";

export default async function EnvironmentPage() {
  const { profile } = await requireUser();
  const supabase = await createClient();
  const [m, { data: rows }] = await Promise.all([
    masters(),
    supabase.from("environment_readings").select("*, houses(code)").eq("is_active", true).order("entry_date", { ascending: false }).limit(80),
  ]);
  return (
    <div className="space-y-8">
      <PageHeader title="Environment readings" description="House-level temperature, humidity and ammonia log." />
      {hasPermission(profile.role, "recordEnvironment") ? (
        <EnvironmentForm houses={m.houses.map((h) => ({ id: h.id, label: h.code }))} />
      ) : null}
      <DataRows
        headers={["ID", "House", "Date", "Time", "Temp", "Humidity", "Ammonia"]}
        rows={(rows ?? []).map((r) => [r.code, (r.houses as { code: string } | null)?.code ?? "", r.entry_date, r.reading_time, String(r.temperature_c), String(r.humidity_pct), String(r.ammonia_ppm)])}
      />
    </div>
  );
}
