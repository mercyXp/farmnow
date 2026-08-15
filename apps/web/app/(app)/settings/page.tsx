import Link from "next/link";
import { hasPermission } from "@farmnow/domain";
import { PageHeader } from "@/components/page-header";
import { DataRows } from "@/components/data-rows";
import {
  BreedCreateForm,
  CustomerCreateForm,
  EmployeeCreateForm,
  FeedTypeCreateForm,
  HouseCreateForm,
  ProductCreateForm,
  SettingsForm,
  SupplierCreateForm,
} from "@/features/settings/settings-form";
import { requirePagePermission } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import { formatZmw } from "@/lib/utils";

export default async function SettingsPage() {
  const { profile } = await requirePagePermission("manageSettings", "manageMasters");
  const canSettings = hasPermission(profile.role, "manageSettings");
  const canMasters = hasPermission(profile.role, "manageMasters");
  const canAudit = hasPermission(profile.role, "viewAuditLogs");
  const canImport = hasPermission(profile.role, "importExcel");

  const supabase = await createClient();
  const [
    { data: settings },
    { data: houses },
    { data: breeds },
    { data: feedTypes },
    { data: suppliers },
    { data: customers },
    { data: products },
    { data: employees },
    { data: audit },
  ] = await Promise.all([
    supabase.from("settings").select("*").order("key"),
    supabase.from("houses").select("*").order("code"),
    supabase.from("breeds").select("*").order("name"),
    supabase.from("feed_types").select("*").order("name"),
    supabase.from("suppliers").select("*").order("name"),
    supabase.from("customers").select("*").order("name"),
    supabase.from("products").select("*").order("name"),
    supabase.from("employees").select("*").order("name"),
    canAudit
      ? supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(30)
      : Promise.resolve({ data: [] as never[] }),
  ]);

  return (
    <div className="space-y-10">
      <PageHeader title="Settings" description="Company profile, KPI targets, master data and audit log." />
      {canSettings ? (
        <section>
          <h2 className="mb-3 font-serif text-xl">Company & targets</h2>
          <SettingsForm settings={settings ?? []} />
        </section>
      ) : null}
      {canMasters ? (
        <>
          <section className="space-y-3">
            <h2 className="font-serif text-xl">Houses</h2>
            <HouseCreateForm />
            <DataRows headers={["Code", "Capacity", "Zone", "Status"]} rows={(houses ?? []).map((h) => [h.code, String(h.capacity), h.location_zone, h.status])} />
          </section>
          <section className="space-y-3">
            <h2 className="font-serif text-xl">Breeds</h2>
            <BreedCreateForm />
            <DataRows headers={["Name", "Standard FCR", "Standard ADG"]} rows={(breeds ?? []).map((b) => [b.name, String(b.standard_fcr), String(b.standard_adg_g)])} />
          </section>
          <section className="space-y-3">
            <h2 className="font-serif text-xl">Feed types</h2>
            <FeedTypeCreateForm />
            <DataRows
              headers={["Name", "Stage", "Unit cost", "Bag kg", "Min stock"]}
              rows={(feedTypes ?? []).map((f) => [f.name, f.stage, formatZmw(Number(f.unit_cost_per_kg)), String(f.standard_bag_weight_kg), String(f.min_stock_kg)])}
            />
          </section>
          <section className="space-y-3">
            <h2 className="font-serif text-xl">Suppliers</h2>
            <SupplierCreateForm />
            <DataRows headers={["Name", "Category", "Lead time"]} rows={(suppliers ?? []).map((s) => [s.name, s.category, String(s.lead_time_days)])} />
          </section>
          <section className="space-y-3">
            <h2 className="font-serif text-xl">Customers</h2>
            <CustomerCreateForm />
            <DataRows headers={["Name", "Tier", "Terms"]} rows={(customers ?? []).map((c) => [c.name, c.price_tier, c.payment_terms])} />
          </section>
          <section className="space-y-3">
            <h2 className="font-serif text-xl">Vaccines & medicines</h2>
            <ProductCreateForm />
            <DataRows headers={["Name", "Type", "Unit", "Withdrawal"]} rows={(products ?? []).map((p) => [p.name, p.type, p.dosage_unit, String(p.withdrawal_days)])} />
          </section>
          <section className="space-y-3">
            <h2 className="font-serif text-xl">Employees</h2>
            <EmployeeCreateForm />
            <DataRows headers={["Name", "Position", "Status"]} rows={(employees ?? []).map((e) => [e.name, e.position, e.status])} />
          </section>
        </>
      ) : null}
      {canImport ? (
        <p className="text-sm">
          <Link className="text-primary underline" href="/settings/import">
            Import historical Excel data
          </Link>
        </p>
      ) : null}
      {canAudit ? (
        <section className="space-y-3">
          <h2 className="font-serif text-xl">Recent audit log</h2>
          <DataRows
            headers={["When", "Action", "Entity", "ID"]}
            rows={(audit ?? []).map((a) => [a.created_at.slice(0, 19).replace("T", " "), a.action, a.entity_type, a.entity_id ?? ""])}
          />
        </section>
      ) : null}
    </div>
  );
}
