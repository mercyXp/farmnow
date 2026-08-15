import Image from "next/image";
import { cn } from "@/lib/utils";

export function BrandLogo({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/farmnow_logo.png"
      alt="FarmNow"
      width={1536}
      height={1024}
      className={cn("h-auto w-auto object-contain", className)}
      priority={priority}
    />
  );
}
