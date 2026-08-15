import { redirect } from "next/navigation";
import { AuthCard, AuthShell } from "@/features/auth/auth-shell";
import { ResetPasswordForm } from "@/features/auth/reset-password-form";
import { createClient } from "@/lib/supabase/server";

export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/forgot-password");

  const { data: profile } = await supabase.from("profiles").select("is_active").eq("id", user.id).maybeSingle();
  if (!profile?.is_active) redirect("/inactive");

  return (
    <AuthShell>
      <AuthCard title="Create a new password" description="Choose a password that only you know. Minimum 8 characters.">
        <ResetPasswordForm />
      </AuthCard>
    </AuthShell>
  );
}
