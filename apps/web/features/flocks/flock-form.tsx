"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/input";
import { FieldError } from "@/components/page-header";
import { createFlock } from "@/features/flocks/actions";
import { todayIso } from "@/lib/utils";

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
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setErrors({});
    const fd = new FormData(e.currentTarget);
    const result = await createFlock({
      houseId: fd.get("houseId"),
      breedId: fd.get("breedId"),
      supplierId: fd.get("supplierId"),
      placedDate: fd.get("placedDate"),
      initialBirdCount: Number(fd.get("initialBirdCount")),
      expectedDispatchDate: fd.get("expectedDispatchDate"),
    });
    setPending(false);
    if (!result.ok) {
      toast.error(result.error);
      setErrors({ form: result.error });
      return;
    }
    toast.success("Flock created");
    router.push(`/flocks/${result.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-4 rounded-xl border bg-card p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="houseId">House</Label>
          <select id="houseId" name="houseId" required className="h-10 w-full rounded-md border bg-card px-3 text-sm">
            <option value="">Select house</option>
            {houses.map((h) => (
              <option key={h.id} value={h.id}>
                {h.code}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="breedId">Breed</Label>
          <select id="breedId" name="breedId" required className="h-10 w-full rounded-md border bg-card px-3 text-sm">
            <option value="">Select breed</option>
            {breeds.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="supplierId">Chick supplier</Label>
          <select id="supplierId" name="supplierId" required className="h-10 w-full rounded-md border bg-card px-3 text-sm">
            <option value="">Select supplier</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="initialBirdCount">Initial birds</Label>
          <Input id="initialBirdCount" name="initialBirdCount" type="number" min={1} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="placedDate">Placed date</Label>
          <Input id="placedDate" name="placedDate" type="date" defaultValue={todayIso()} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="expectedDispatchDate">Expected dispatch</Label>
          <Input id="expectedDispatchDate" name="expectedDispatchDate" type="date" required />
        </div>
      </div>
      <FieldError message={errors.form} />
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Create flock"}
      </Button>
    </form>
  );
}
