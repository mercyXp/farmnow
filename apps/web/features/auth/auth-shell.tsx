import { BrandLogo } from "@/components/brand-logo";
import { MapPin } from "@/components/icons";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="login-page flex min-h-screen items-center justify-center px-4 py-10 sm:py-16">
      <div className="relative w-full max-w-[440px] space-y-8">
        <header className="text-center">
          <BrandLogo className="mx-auto h-[4.5rem] w-auto overflow-hidden rounded-2xl" priority />
          <h1 className="mt-4 font-serif text-4xl tracking-tight sm:text-5xl">
            <span className="text-[#1B3C2B]">Farm</span>
            <span className="text-[#A35C31]">Now</span>
          </h1>
          <div className="mt-3 flex items-center gap-3 text-[#1B3C2B]">
            <span className="h-px flex-1 bg-[#1B3C2B]/25" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em]">Broiler Farm ERP</p>
            <span className="h-px flex-1 bg-[#1B3C2B]/25" />
          </div>
          <p className="mt-3 inline-flex items-center justify-center gap-1.5 text-sm text-[#1B3C2B]/80">
            <MapPin className="h-3.5 w-3.5 text-[#1B3C2B]" aria-hidden />
            FarmNow Limited · Lusaka, Zambia
          </p>
        </header>
        {children}
      </div>
    </div>
  );
}

export function AuthCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#E6DDD0] bg-white p-6 shadow-[0_18px_50px_rgba(27,60,43,0.12)] sm:p-8">
      <div className="text-center">
        <h2 className="font-serif text-2xl text-[#1B3C2B] sm:text-[1.7rem]">{title}</h2>
        {description ? <p className="mt-2 text-sm text-[#6B726C]">{description}</p> : null}
      </div>
      <div className="mt-5 h-px bg-[#E6DDD0]" />
      <div className="mt-6">{children}</div>
    </div>
  );
}
