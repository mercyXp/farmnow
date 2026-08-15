"use server";

import { ZodError } from "zod";
import { changePasswordSchema, newPasswordSchema } from "@farmnow/domain";
import { writeAudit } from "@/lib/audit";
import { createClient, requireUser } from "@/lib/supabase/server";
import { publicError } from "@/lib/utils";

type Result = { ok: true } | { ok: false; error: string };

function actionError(error: unknown): Result {
  if (error instanceof ZodError) {
    return { ok: false, error: error.issues[0]?.message ?? "Invalid input." };
  }
  return { ok: false, error: publicError(error) };
}

export async function logAuthEvent(action: "LOGIN" | "LOGOUT") {
  try {
    const { supabase, user } = await requireUser();
    await writeAudit(supabase, user, { action, entityType: "auth", entityId: user.id });
  } catch {
    // Login/logout audit must not block authentication.
  }
}

async function applyNewPassword(newPassword: string): Promise<Result> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return { ok: false, error: "Unauthorized" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_active")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile?.is_active) {
    return { ok: false, error: "Your account is inactive." };
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) {
    if (/same|different/i.test(error.message)) {
      return { ok: false, error: "New password must be different from your current password." };
    }
    return { ok: false, error: "Could not update your password." };
  }

  const { error: flagError } = await supabase.rpc("clear_must_change_password");
  if (flagError) {
    return { ok: false, error: "Could not update your password." };
  }

  await writeAudit(supabase, user, { action: "PASSWORD_CHANGED", entityType: "auth", entityId: user.id });
  return { ok: true };
}

export async function changeOwnPassword(input: unknown): Promise<Result> {
  try {
    const parsed = changePasswordSchema.parse(input);
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.email) {
      return { ok: false, error: "Unauthorized" };
    }

    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: parsed.currentPassword,
    });
    if (verifyError) {
      return { ok: false, error: "Current password is incorrect." };
    }

    return await applyNewPassword(parsed.newPassword);
  } catch (error) {
    return actionError(error);
  }
}

export async function completePasswordReset(input: unknown): Promise<Result> {
  try {
    const parsed = newPasswordSchema.parse(input);
    return await applyNewPassword(parsed.password);
  } catch (error) {
    return actionError(error);
  }
}
