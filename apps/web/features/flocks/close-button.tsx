"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { closeFlock } from "@/features/flocks/actions";

export function CloseFlockButton({ flockId }: { flockId: string }) {
  const [pending, setPending] = useState(false);
  const router = useRouter();
  return (
    <Button
      variant="outline"
      disabled={pending}
      onClick={async () => {
        if (!confirm("Close this flock? Active-flock transactions will no longer be accepted.")) return;
        setPending(true);
        const result = await closeFlock(flockId);
        setPending(false);
        if (!result.ok) {
          toast.error(result.error);
          return;
        }
        toast.success("Flock closed");
        router.refresh();
      }}
    >
      {pending ? "Closing…" : "Close flock"}
    </Button>
  );
}
