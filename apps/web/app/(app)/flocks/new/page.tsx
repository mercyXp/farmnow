import { PageHeader } from "@/components/page-header";
import { FlockForm } from "@/features/flocks/flock-form";
import { getFlockFormOptions } from "@/features/flocks/queries";
import { requirePagePermission } from "@/lib/supabase/server";

export default async function NewFlockPage() {
  await requirePagePermission("createFlock");
  const options = await getFlockFormOptions();
  return (
    <div>
      <PageHeader title="New flock" description="House, breed, placement date and opening bird count." />
      <FlockForm {...options} />
    </div>
  );
}
