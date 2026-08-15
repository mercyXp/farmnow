import { AuthCard, AuthShell } from "@/features/auth/auth-shell";
import { ForgotPasswordForm } from "@/features/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <AuthShell>
      <AuthCard
        title="Reset your password"
        description="Enter your work email address and we'll send you a secure password-reset link."
      >
        <ForgotPasswordForm />
      </AuthCard>
    </AuthShell>
  );
}
