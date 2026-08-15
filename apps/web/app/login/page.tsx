import { MapPin } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { LoginForm } from "./login-form";

export default function LoginPage() {
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
        </header>
        <LoginForm />
      </div>
    </div>
  );
}
