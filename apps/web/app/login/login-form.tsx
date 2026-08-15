"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, LogIn, Mail, Shield } from "lucide-react";
import { loginSchema } from "@farmnow/domain";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/input";
import { logAuthEvent } from "@/features/auth/actions";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  return (
    <div className="rounded-2xl border border-[#E6DDD0] bg-white p-6 shadow-[0_18px_50px_rgba(27,60,43,0.12)] sm:p-8">
      <div className="flex justify-center">
        <div className="text-center">
          <h2 className="font-serif text-2xl text-[#1B3C2B] sm:text-[1.7rem]">
            Welcome
          </h2>
          <p className="mt-1 text-sm text-[#6B726C]">
            Broiler Management System
          </p>
        </div>
      </div>
      <div className="mt-5 h-px bg-[#E6DDD0]" />
      <form
        className="mt-6 space-y-4"
        onSubmit={handleSubmit(async (values) => {
          setError(null);
          const supabase = createClient();
          const { error: signError } = await supabase.auth.signInWithPassword({
            email: values.email,
            password: values.password,
          });
          if (signError) {
            setError("Could not sign in. Check the email and password.");
            return;
          }
          await logAuthEvent("LOGIN");
          router.push("/dashboard");
          router.refresh();
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
              placeholder="Enter your email"
              className="h-12 rounded-lg border-[#E0D6C8] bg-[#F7F4F0] pl-10 shadow-none placeholder:text-[#9AA19B] focus-visible:ring-[#1B3C2B]"
              {...register("email")}
            />
          </div>
          {errors.email ? <p className="text-xs text-destructive">{errors.email.message}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="font-semibold text-[#1B3C2B]">
            Password
          </Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A918B]" aria-hidden />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              className="h-12 rounded-lg border-[#E0D6C8] bg-[#F7F4F0] px-10 shadow-none placeholder:text-[#9AA19B] focus-visible:ring-[#1B3C2B]"
              {...register("password")}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A918B] hover:text-[#1B3C2B]"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password ? <p className="text-xs text-destructive">{errors.password.message}</p> : null}
          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm font-medium text-[#A35C31] hover:underline"
              onClick={() => toast.message("Ask a Superadmin to reset your password.")}
            >
              Forgot password?
            </button>
          </div>
        </div>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <Button
          type="submit"
          className="h-12 w-full rounded-lg bg-[#1B3C2B] text-base text-white hover:bg-[#163226]"
          disabled={isSubmitting}
        >
          <LogIn className="h-4 w-4" />
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>
      <div className="mt-6 flex items-center gap-3 text-[#8A918B]">
        <span className="h-px flex-1 bg-[#E6DDD0]" />
        <p className="text-xs tracking-wide">Secure &nbsp;•&nbsp; Reliable &nbsp;•&nbsp; Smart Farming</p>
        <span className="h-px flex-1 bg-[#E6DDD0]" />
      </div>
    </div>
  );
}
