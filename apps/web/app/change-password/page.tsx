import { redirect } from "next/navigation";
import { AuthCard, AuthShell } from "@/features/auth/auth-shell";
import { ChangePasswordForm } from "@/features/auth/change-password-form";
import { createClient } from "@/lib/supabase/server";
import { isAppRole } from "@farmnow/domain";

export default async function ChangePasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_active, must_change_password, role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.is_active || !isAppRole(profile.role)) redirect("/inactive");
  if (!profile.must_change_password) redirect("/dashboard");

  return (
    <AuthShell>
      <AuthCard
        title="Change your temporary password"
        description="For security, you must create your own password before continuing."
      >
        <ChangePasswordForm firstLogin />
      </AuthCard>
    </AuthShell>
  );
}
