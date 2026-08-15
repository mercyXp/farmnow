import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { createClient } from "@/lib/supabase/server";
import { isAppRole } from "@farmnow/domain";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, is_active")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.is_active || !isAppRole(profile.role)) redirect("/inactive");

  return (
    <AppShell displayName={profile.full_name || user.email || "User"} role={profile.role}>
      {children}
    </AppShell>
  );
}
