"use client";

import { useRouter } from "next/navigation";
import { flockCreateSchema } from "@farmnow/domain";
import { createFlock } from "@/features/flocks/actions";
import { DateField, SelectField, TextField, ZodForm, todayIso } from "@/features/transactions/form-kit";

export function FlockForm({
  houses,
  breeds,
  suppliers,
}: {
  houses: { id: string; code: string }[];
  breeds: { id: string; name: string }[];
  suppliers: { id: string; name: string }[];
}) {
  const router = useRouter();
  return (
    <ZodForm
      schema={flockCreateSchema}
      defaultValues={{
        houseId: "",
        breedId: "",
        supplierId: "",
        placedDate: todayIso(),
        expectedDispatchDate: "",
      }}
      onSubmit={createFlock}
      onSuccess={(result) => {
        if (result.id) router.push(`/flocks/${result.id}`);
      }}
      submitLabel="Create flock"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField name="houseId" label="House" options={houses.map((h) => ({ id: h.id, label: h.code }))} />
        <SelectField name="breedId" label="Breed" options={breeds.map((b) => ({ id: b.id, label: b.name }))} />
        <SelectField name="supplierId" label="Chick supplier" options={suppliers.map((s) => ({ id: s.id, label: s.name }))} />
        <TextField name="initialBirdCount" label="Initial birds" type="number" min="1" />
        <DateField name="placedDate" label="Placed date" />
        <DateField name="expectedDispatchDate" label="Expected dispatch" />
      </div>
    </ZodForm>
  );
}
