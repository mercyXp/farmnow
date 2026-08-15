"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { changePasswordSchema } from "@farmnow/domain";
import { Button } from "@/components/ui/button";
import { changeOwnPassword } from "@/features/auth/actions";
import { PasswordField } from "@/features/auth/password-field";

export function ChangePasswordForm({
  firstLogin = false,
}: {
  firstLogin?: boolean;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const form = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(async (values) => {
        setError(null);
        const result = await changeOwnPassword(values);
        if (!result.ok) {
          setError(result.error);
          return;
        }
        form.reset();
        if (firstLogin) {
          router.push("/dashboard");
          router.refresh();
          return;
        }
        toast.success("Password updated");
        router.refresh();
      })}
    >
      <PasswordField
        id="currentPassword"
        label={firstLogin ? "Temporary password" : "Current password"}
        autoComplete="current-password"
        error={form.formState.errors.currentPassword?.message}
        register={form.register("currentPassword")}
        tone={firstLogin ? "login" : "app"}
      />
      <PasswordField
        id="newPassword"
        label="New password"
        autoComplete="new-password"
        error={form.formState.errors.newPassword?.message}
        register={form.register("newPassword")}
        tone={firstLogin ? "login" : "app"}
      />
      <PasswordField
        id="confirmPassword"
        label={firstLogin ? "Confirm password" : "Confirm new password"}
        autoComplete="new-password"
        error={form.formState.errors.confirmPassword?.message}
        register={form.register("confirmPassword")}
        tone={firstLogin ? "login" : "app"}
      />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button
        type="submit"
        className={
          firstLogin
            ? "h-12 w-full rounded-lg bg-[#1B3C2B] text-base text-white hover:bg-[#163226]"
            : undefined
        }
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting
          ? "Saving…"
          : firstLogin
            ? "Create My Password"
            : "Update Password"}
      </Button>
    </form>
  );
}
