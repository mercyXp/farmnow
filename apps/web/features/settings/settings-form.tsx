"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createBreed,
  createCustomer,
  createEmployee,
  createFeedType,
  createHouse,
  createProduct,
  createSupplier,
  updateSettings,
} from "@/features/settings/actions";

export function SettingsForm({ settings }: { settings: { key: string; value: string }[] }) {
  const [pending, setPending] = useState(false);
  return (
    <form
      className="max-w-xl space-y-3 rounded-xl border bg-card p-6"
      onSubmit={async (e) => {
        e.preventDefault();
        setPending(true);
        const fd = new FormData(e.currentTarget);
        const entries = settings.map((s) => ({ key: s.key, value: String(fd.get(s.key) ?? "") }));
        const result = await updateSettings(entries);
        setPending(false);
        if (!result.ok) toast.error(result.error);
        else toast.success("Settings saved");
      }}
    >
      {settings.map((s) => (
        <label key={s.key} className="block space-y-1 text-sm">
          <span>{s.key}</span>
          <Input name={s.key} defaultValue={s.value} />
        </label>
      ))}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save settings"}
      </Button>
    </form>
  );
}

function MasterForm({
  children,
  onSave,
}: {
  children: React.ReactNode;
  onSave: (fd: FormData) => Promise<{ ok: true } | { ok: false; error: string }>;
}) {
  const [pending, setPending] = useState(false);
  const router = useRouter();
  return (
    <form
      className="grid gap-3 rounded-xl border bg-card p-4 sm:grid-cols-2 lg:grid-cols-3"
      onSubmit={async (e) => {
        e.preventDefault();
        setPending(true);
        const form = e.currentTarget;
        const result = await onSave(new FormData(form));
        setPending(false);
        if (!result.ok) toast.error(result.error);
        else {
          toast.success("Saved");
          form.reset();
          router.refresh();
        }
      }}
    >
      {children}
      <div className="flex items-end">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Add"}
        </Button>
      </div>
    </form>
  );
}

function Field({ name, label, type = "text", step, min }: { name: string; label: string; type?: string; step?: string; min?: string }) {
  return (
    <label className="block space-y-1 text-sm">
      <span>{label}</span>
      <Input name={name} type={type} step={step} min={min} required />
    </label>
  );
}

export function HouseCreateForm() {
  return (
    <MasterForm
      onSave={(fd) =>
        createHouse({
          code: String(fd.get("code")),
          capacity: Number(fd.get("capacity")),
          location_zone: String(fd.get("location_zone")),
        })
      }
    >
      <Field name="code" label="House code" />
      <Field name="capacity" label="Capacity" type="number" min="1" />
      <Field name="location_zone" label="Zone" />
    </MasterForm>
  );
}

export function BreedCreateForm() {
  return (
    <MasterForm
      onSave={(fd) =>
        createBreed({
          name: String(fd.get("name")),
          standard_fcr: Number(fd.get("standard_fcr")),
          standard_adg_g: Number(fd.get("standard_adg_g")),
        })
      }
    >
      <Field name="name" label="Breed" />
      <Field name="standard_fcr" label="Standard FCR" type="number" step="0.01" min="0.01" />
      <Field name="standard_adg_g" label="Standard ADG g" type="number" step="0.01" min="0.01" />
    </MasterForm>
  );
}

export function FeedTypeCreateForm() {
  return (
    <MasterForm
      onSave={(fd) =>
        createFeedType({
          name: String(fd.get("name")),
          stage: String(fd.get("stage")),
          unit_cost_per_kg: Number(fd.get("unit_cost_per_kg")),
          standard_bag_weight_kg: Number(fd.get("standard_bag_weight_kg")),
          min_stock_kg: Number(fd.get("min_stock_kg")),
        })
      }
    >
      <Field name="name" label="Feed name" />
      <Field name="stage" label="Stage" />
      <Field name="unit_cost_per_kg" label="Unit cost / kg" type="number" step="0.01" min="0" />
      <Field name="standard_bag_weight_kg" label="Bag weight kg" type="number" step="0.001" min="0.001" />
      <Field name="min_stock_kg" label="Min stock kg" type="number" step="0.001" min="0" />
    </MasterForm>
  );
}

export function SupplierCreateForm() {
  return (
    <MasterForm
      onSave={(fd) =>
        createSupplier({
          name: String(fd.get("name")),
          contact: String(fd.get("contact")),
          email: String(fd.get("email")),
          category: String(fd.get("category")),
          lead_time_days: Number(fd.get("lead_time_days")),
        })
      }
    >
      <Field name="name" label="Supplier" />
      <Field name="contact" label="Contact" />
      <Field name="email" label="Email" />
      <Field name="category" label="Category" />
      <Field name="lead_time_days" label="Lead time days" type="number" min="0" />
    </MasterForm>
  );
}

export function CustomerCreateForm() {
  return (
    <MasterForm
      onSave={(fd) =>
        createCustomer({
          name: String(fd.get("name")),
          contact: String(fd.get("contact")),
          address: String(fd.get("address")),
          price_tier: String(fd.get("price_tier")),
          payment_terms: String(fd.get("payment_terms")),
        })
      }
    >
      <Field name="name" label="Customer" />
      <Field name="contact" label="Contact" />
      <Field name="address" label="Address" />
      <Field name="price_tier" label="Price tier" />
      <Field name="payment_terms" label="Payment terms" />
    </MasterForm>
  );
}

export function ProductCreateForm() {
  return (
    <MasterForm
      onSave={(fd) =>
        createProduct({
          name: String(fd.get("name")),
          type: String(fd.get("type")),
          dosage_unit: String(fd.get("dosage_unit")),
          withdrawal_days: Number(fd.get("withdrawal_days")),
        })
      }
    >
      <Field name="name" label="Product" />
      <Field name="type" label="Type" />
      <Field name="dosage_unit" label="Dosage unit" />
      <Field name="withdrawal_days" label="Withdrawal days" type="number" min="0" />
    </MasterForm>
  );
}

export function EmployeeCreateForm() {
  return (
    <MasterForm
      onSave={(fd) =>
        createEmployee({
          name: String(fd.get("name")),
          position: String(fd.get("position")),
          contact_number: String(fd.get("contact_number")),
          nrc: String(fd.get("nrc")),
          date_hired: String(fd.get("date_hired")),
          salary_zmw: Number(fd.get("salary_zmw")),
        })
      }
    >
      <Field name="name" label="Name" />
      <Field name="position" label="Position" />
      <Field name="contact_number" label="Contact" />
      <Field name="nrc" label="NRC" />
      <Field name="date_hired" label="Date hired" type="date" />
      <Field name="salary_zmw" label="Salary ZMW" type="number" step="0.01" min="0" />
    </MasterForm>
  );
}
