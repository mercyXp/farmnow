"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newPasswordSchema } from "@farmnow/domain";
import { Button } from "@/components/ui/button";
import { completePasswordReset } from "@/features/auth/actions";
import { PasswordField } from "@/features/auth/password-field";
import { createClient } from "@/lib/supabase/client";

export function ResetPasswordForm() {
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const form = useForm({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  if (done) {
    return (
      <div className="space-y-4 text-center">
        <p className="font-medium text-[#1B3C2B]">Password updated successfully</p>
        <p className="text-sm text-[#6B726C]">
          Your password has been changed. You can now sign in with your new password.
        </p>
        <Button asChild className="h-12 w-full rounded-lg bg-[#1B3C2B] text-white hover:bg-[#163226]">
          <Link href="/login">Sign In</Link>
        </Button>
      </div>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(async (values) => {
        setError(null);
        const result = await completePasswordReset(values);
        if (!result.ok) {
          setError(result.error);
          return;
        }
        const supabase = createClient();
        await supabase.auth.signOut();
        setDone(true);
      })}
    >
      <PasswordField
        id="password"
        label="New password"
        autoComplete="new-password"
        error={form.formState.errors.password?.message}
        register={form.register("password")}
      />
      <PasswordField
        id="confirmPassword"
        label="Confirm new password"
        autoComplete="new-password"
        error={form.formState.errors.confirmPassword?.message}
        register={form.register("confirmPassword")}
      />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button
        type="submit"
        className="h-12 w-full rounded-lg bg-[#1B3C2B] text-base text-white hover:bg-[#163226]"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? "Updating…" : "Update Password"}
      </Button>
    </form>
  );
}
