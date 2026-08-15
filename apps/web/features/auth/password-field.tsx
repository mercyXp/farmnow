"use client";

import type { UseFormRegisterReturn } from "react-hook-form";
import { useState } from "react";
import { Eye, EyeOff, Lock } from "@/components/icons";
import { Input, Label } from "@/components/ui/input";

export function PasswordField({
  id,
  label,
  autoComplete,
  error,
  register,
  tone = "login",
}: {
  id: string;
  label: string;
  autoComplete?: string;
  error?: string;
  register: UseFormRegisterReturn;
  tone?: "login" | "app";
}) {
  const [show, setShow] = useState(false);
  const login = tone === "login";
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className={login ? "font-semibold text-[#1B3C2B]" : undefined}>
        {label}
      </Label>
      <div className="relative">
        <Lock
          className={`pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${login ? "text-[#8A918B]" : "text-muted-foreground"}`}
          aria-hidden
        />
        <Input
          id={id}
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          className={
            login
              ? "h-12 rounded-lg border-[#E0D6C8] bg-[#F7F4F0] px-10 shadow-none placeholder:text-[#9AA19B] focus-visible:ring-[#1B3C2B]"
              : "px-10"
          }
          {...register}
        />
        <button
          type="button"
          className={`absolute right-3 top-1/2 -translate-y-1/2 ${login ? "text-[#8A918B] hover:text-[#1B3C2B]" : "text-muted-foreground hover:text-foreground"}`}
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
