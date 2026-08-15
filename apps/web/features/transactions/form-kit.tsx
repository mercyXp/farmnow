"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/input";
import { todayIso } from "@/lib/utils";

type Opt = { id: string; label: string };

export function TxForm({
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
      className="max-w-2xl space-y-4 rounded-xl border bg-card p-6 shadow-sm"
      onSubmit={async (e) => {
        e.preventDefault();
        setPending(true);
        const result = await onSave(new FormData(e.currentTarget));
        setPending(false);
        if (!result.ok) {
          toast.error(result.error);
          return;
        }
        toast.success("Saved");
        (e.target as HTMLFormElement).reset();
        router.refresh();
      }}
    >
      {children}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save"}
      </Button>
    </form>
  );
}

export function SelectField({
  name,
  label,
  options,
  required = true,
}: {
  name: string;
  label: string;
  options: Opt[];
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <select id={name} name={name} required={required} className="h-10 w-full rounded-md border bg-card px-3 text-sm">
        <option value="">{`Select ${label.toLowerCase()}`}</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function TextField({
  name,
  label,
  type = "text",
  defaultValue,
  required = true,
  step,
  min,
}: {
  name: string;
  label: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
  step?: string;
  min?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} defaultValue={defaultValue} required={required} step={step} min={min} />
    </div>
  );
}

export function DateField({ name = "entryDate", label = "Date" }: { name?: string; label?: string }) {
  return <TextField name={name} label={label} type="date" defaultValue={todayIso()} />;
}

export function ListField({ name, label, values }: { name: string; label: string; values: string[] }) {
  return (
    <SelectField
      name={name}
      label={label}
      options={values.map((v) => ({ id: v, label: v }))}
    />
  );
}

export function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}
