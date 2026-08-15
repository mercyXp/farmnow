"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "@farmnow/domain";
import { Mail } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { passwordResetRedirectTo } from "@/lib/auth/paths";

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  if (sent) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-[#6B726C]">
          If that email is on a FarmNow account, we sent a password-reset link. Check your inbox and spam folder.
        </p>
        <Button asChild variant="outline" className="w-full">
          <Link href="/login">Back to sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(async (values) => {
        setError(null);
        const supabase = createClient();
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(values.email, {
          redirectTo: passwordResetRedirectTo(window.location.origin),
        });
        if (resetError) {
          setError("Could not send a reset link. Try again in a few minutes.");
          return;
        }
        setSent(true);
      })}
    >
      <div className="space-y-2">
        <Label htmlFor="email" className="font-semibold text-[#1B3C2B]">
          Email
        </Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A918B]" aria-hidden />
          <Input
            id="email"
            type="email"
            autoComplete="username"
            placeholder="Enter your work email"
            className="h-12 rounded-lg border-[#E0D6C8] bg-[#F7F4F0] pl-10 shadow-none placeholder:text-[#9AA19B] focus-visible:ring-[#1B3C2B]"
            {...form.register("email")}
          />
        </div>
        {form.formState.errors.email ? (
          <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
        ) : null}
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button
        type="submit"
        className="h-12 w-full rounded-lg bg-[#1B3C2B] text-base text-white hover:bg-[#163226]"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? "Sending…" : "Send Reset Link"}
      </Button>
      <p className="text-center text-sm">
        <Link href="/login" className="font-medium text-[#A35C31] hover:underline">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
