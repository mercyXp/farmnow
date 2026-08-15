"use client";

import { useState } from "react";
import { Menu, LogOut } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { AppRole } from "@farmnow/domain";
import { ROLE_LABELS } from "@farmnow/domain";
import { BrandLogo } from "@/components/brand-logo";
import { logAuthEvent } from "@/features/auth/actions";

export function AppShell({
  children,
  displayName,
  role,
}: {
  children: React.ReactNode;
  displayName: string;
  role: AppRole;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function signOut() {
    await logAuthEvent("LOGOUT");
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="hidden lg:block">
        <div className="sticky top-0 h-screen">
          <Sidebar role={role} />
        </div>
      </aside>
      {open ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button className="absolute inset-0 bg-black/40" aria-label="Close menu" onClick={() => setOpen(false)} />
          <div className="relative h-full w-72">
            <Sidebar role={role} onNavigate={() => setOpen(false)} />
          </div>
        </div>
      ) : null}
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-card/90 px-4 py-3 backdrop-blur">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
            <BrandLogo className="h-9 w-auto overflow-hidden rounded-md lg:hidden" />
            <p className="text-sm text-muted-foreground">FarmNow Limited · Lusaka</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm">{displayName}</p>
              <p className="text-xs text-muted-foreground">{ROLE_LABELS[role]}</p>
            </div>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
