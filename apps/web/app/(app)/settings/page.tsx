import Link from "next/link";
import { hasPermission } from "@farmnow/domain";
import { PageHeader } from "@/components/page-header";
import { DataTable } from "@/components/data-table";
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
      ? supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(200)
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
            <DataTable
              rowKeyField="id"
              rows={houses ?? []}
              columns={[
                { id: "code", header: "Code", field: "code" },
                { id: "capacity", header: "Capacity", field: "capacity" },
                { id: "location_zone", header: "Zone", field: "location_zone" },
                { id: "status", header: "Status", field: "status" },
              ]}
            />
          </section>
          <section className="space-y-3">
            <h2 className="font-serif text-xl">Breeds</h2>
            <BreedCreateForm />
            <DataTable
              rowKeyField="id"
              rows={breeds ?? []}
              columns={[
                { id: "name", header: "Name", field: "name" },
                { id: "standard_fcr", header: "Standard FCR", field: "standard_fcr" },
                { id: "standard_adg_g", header: "Standard ADG", field: "standard_adg_g" },
              ]}
            />
          </section>
          <section className="space-y-3">
            <h2 className="font-serif text-xl">Feed types</h2>
            <FeedTypeCreateForm />
            <DataTable
              rowKeyField="id"
              rows={(feedTypes ?? []).map((f) => ({
                id: f.id,
                name: f.name,
                stage: f.stage,
                unitCost: formatZmw(Number(f.unit_cost_per_kg)),
                bagKg: f.standard_bag_weight_kg,
                minStock: f.min_stock_kg,
              }))}
              columns={[
                { id: "name", header: "Name", field: "name" },
                { id: "stage", header: "Stage", field: "stage" },
                { id: "unitCost", header: "Unit cost", field: "unitCost" },
                { id: "bagKg", header: "Bag kg", field: "bagKg" },
                { id: "minStock", header: "Min stock", field: "minStock" },
              ]}
            />
          </section>
          <section className="space-y-3">
            <h2 className="font-serif text-xl">Suppliers</h2>
            <SupplierCreateForm />
            <DataTable
              rowKeyField="id"
              rows={suppliers ?? []}
              columns={[
                { id: "name", header: "Name", field: "name" },
                { id: "category", header: "Category", field: "category" },
                { id: "lead_time_days", header: "Lead time", field: "lead_time_days" },
              ]}
            />
          </section>
          <section className="space-y-3">
            <h2 className="font-serif text-xl">Customers</h2>
            <CustomerCreateForm />
            <DataTable
              rowKeyField="id"
              rows={customers ?? []}
              columns={[
                { id: "name", header: "Name", field: "name" },
                { id: "price_tier", header: "Tier", field: "price_tier" },
                { id: "payment_terms", header: "Terms", field: "payment_terms" },
              ]}
            />
          </section>
          <section className="space-y-3">
            <h2 className="font-serif text-xl">Vaccines & medicines</h2>
            <ProductCreateForm />
            <DataTable
              rowKeyField="id"
              rows={products ?? []}
              columns={[
                { id: "name", header: "Name", field: "name" },
                { id: "type", header: "Type", field: "type" },
                { id: "dosage_unit", header: "Unit", field: "dosage_unit" },
                { id: "withdrawal_days", header: "Withdrawal", field: "withdrawal_days" },
              ]}
            />
          </section>
          <section className="space-y-3">
            <h2 className="font-serif text-xl">Employees</h2>
            <EmployeeCreateForm />
            <DataTable
              rowKeyField="id"
              rows={employees ?? []}
              columns={[
                { id: "name", header: "Name", field: "name" },
                { id: "position", header: "Position", field: "position" },
                { id: "status", header: "Status", field: "status" },
              ]}
            />
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
          <DataTable
            rowKeyField="id"
            rows={(audit ?? []).map((a) => ({
              id: a.id,
              when: a.created_at.slice(0, 19).replace("T", " "),
              action: a.action,
              entity: a.entity_type,
              entityId: a.entity_id ?? "",
            }))}
            columns={[
              { id: "when", header: "When", field: "when" },
              { id: "action", header: "Action", field: "action" },
              { id: "entity", header: "Entity", field: "entity" },
              { id: "entityId", header: "ID", field: "entityId" },
            ]}
          />
        </section>
      ) : null}
    </div>
  );
}
