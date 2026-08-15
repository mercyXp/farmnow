"use client";

import { FormProvider, useForm, useFormContext, Controller, type DefaultValues, type FieldValues, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/input";
import { todayIso } from "@/lib/utils";

type Opt = { id: string; label: string };

export function ZodForm({
  schema,
  defaultValues,
  onSubmit,
  onSuccess,
  children,
  submitLabel = "Save",
}: {
  schema: z.ZodType;
  defaultValues?: DefaultValues<FieldValues>;
  onSubmit: (values: FieldValues) => Promise<{ ok: true; id?: string } | { ok: false; error: string }>;
  onSuccess?: (result: { ok: true; id?: string }) => void;
  children: React.ReactNode;
  submitLabel?: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const form = useForm({
    resolver: zodResolver(schema as never),
    defaultValues,
  });

  return (
    <FormProvider {...form}>
      <form
        className="max-w-2xl space-y-4 rounded-xl border bg-card p-6 shadow-sm"
        onSubmit={form.handleSubmit(async (values) => {
          setPending(true);
          const result = await onSubmit(values as FieldValues);
          setPending(false);
          if (!result.ok) {
            toast.error(result.error);
            return;
          }
          toast.success("Saved");
          if (onSuccess) {
            onSuccess(result);
            return;
          }
          if (!defaultValues || !("id" in (defaultValues as object) && (defaultValues as { id?: string }).id)) {
            form.reset(defaultValues);
          }
          router.refresh();
        })}
      >
        {children}
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : submitLabel}
        </Button>
      </form>
    </FormProvider>
  );
}

export function FieldError({ name }: { name: string }) {
  const {
    formState: { errors },
  } = useFormContext();
  const err = errors[name];
  const message = err && typeof err === "object" && "message" in err ? String(err.message ?? "") : "";
  if (!message) return null;
  return <p className="text-xs text-destructive">{message}</p>;
}

export function TextField({
  name,
  label,
  type = "text",
  step,
  min,
}: {
  name: string;
  label: string;
  type?: string;
  step?: string;
  min?: string;
}) {
  const { register } = useFormContext();
  const isNumber = type === "number";
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        type={type}
        step={step}
        min={min}
        {...register(name as Path<FieldValues>, isNumber ? { valueAsNumber: true } : undefined)}
      />
      <FieldError name={name} />
    </div>
  );
}

export function DateField({ name = "entryDate", label = "Date" }: { name?: string; label?: string }) {
  return <TextField name={name} label={label} type="date" />;
}

export function SelectField({
  name,
  label,
  options,
  allowEmpty = false,
  emptyLabel,
}: {
  name: string;
  label: string;
  options: Opt[];
  allowEmpty?: boolean;
  emptyLabel?: string;
}) {
  const { control } = useFormContext();
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Controller
        name={name as Path<FieldValues>}
        control={control}
        render={({ field }) => (
          <select
            id={name}
            className="h-10 w-full rounded-md border bg-card px-3 text-sm"
            value={field.value ?? ""}
            onChange={(e) => field.onChange(e.target.value === "" ? (allowEmpty ? "" : e.target.value) : e.target.value)}
          >
            <option value="">{emptyLabel ?? `Select ${label.toLowerCase()}`}</option>
            {options.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        )}
      />
      <FieldError name={name} />
    </div>
  );
}

export function ListField({ name, label, values }: { name: string; label: string; values: string[] }) {
  return <SelectField name={name} label={label} options={values.map((v) => ({ id: v, label: v }))} />;
}

export function HiddenId() {
  const { register } = useFormContext();
  return <input type="hidden" {...register("id" as Path<FieldValues>)} />;
}

export function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

export { todayIso };
