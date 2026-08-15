import { AuthShell } from "@/features/auth/auth-shell";
import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <AuthShell>
      <LoginForm authError={error === "auth" ? "The reset link is invalid or has expired. Request a new one." : null} />
    </AuthShell>
  );
}
