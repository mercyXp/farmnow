"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import {
  canAssignRole,
  canChangeUserRole,
  canDeactivateUser,
  canManageTarget,
  isAppRole,
  setTemporaryPasswordSchema,
  userCreateSchema,
  userUpdateSchema,
  type AppRole,
} from "@farmnow/domain";
import { writeAudit } from "@/lib/audit";
import { createAdminClient } from "@/lib/supabase/admin";
import { requirePermission } from "@/lib/supabase/server";
import { publicError } from "@/lib/utils";

type Result = { ok: true } | { ok: false; error: string };

async function activeSuperadminCount() {
  const admin = createAdminClient();
  const { count, error } = await admin
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("role", "superadmin")
    .eq("is_active", true);
  if (error) throw error;
  return count ?? 0;
}

function actionError(error: unknown): Result {
  if (error instanceof ZodError) {
    return { ok: false, error: error.issues[0]?.message ?? "Invalid input." };
  }
  return { ok: false, error: publicError(error) };
}

export async function createUser(input: unknown): Promise<Result> {
  try {
    const parsed = userCreateSchema.parse(input);
    const { supabase, user, profile } = await requirePermission("manageUsers");
    if (!canAssignRole(profile.role, parsed.role)) {
      throw new Error("You do not have permission to perform this action.");
    }

    const admin = createAdminClient();
    const created = await admin.auth.admin.createUser({
      email: parsed.email,
      password: parsed.password,
      email_confirm: true,
      user_metadata: { full_name: parsed.fullName },
    });
    if (created.error || !created.data.user) {
      if (/already/i.test(created.error?.message ?? "")) {
        throw new Error("A user with that email already exists.");
      }
      throw new Error("Could not create the user.");
    }

    const newId = created.data.user.id;
    const { error: profileError } = await admin
      .from("profiles")
      .update({
        full_name: parsed.fullName,
        display_name: parsed.fullName,
        role: parsed.role,
        is_active: parsed.isActive,
        must_change_password: true,
      })
      .eq("id", newId);
    if (profileError) throw profileError;

    const owners = await activeSuperadminCount();
    if (owners < 1) {
      await admin.from("profiles").update({ role: "superadmin", is_active: true }).eq("id", newId);
    }

    await writeAudit(supabase, user, {
      action: "USER_CREATED",
      entityType: "profiles",
      entityId: newId,
      newData: { email: parsed.email, fullName: parsed.fullName, role: parsed.role, isActive: parsed.isActive },
    });
    revalidatePath("/users");
    return { ok: true };
  } catch (error) {
    return actionError(error);
  }
}

export async function updateUser(input: unknown): Promise<Result> {
  try {
    const parsed = userUpdateSchema.parse(input);
    const { supabase, user, profile } = await requirePermission("manageUsers");
    const admin = createAdminClient();
    const { data: target, error: loadError } = await admin
      .from("profiles")
      .select("id, full_name, role, is_active")
      .eq("id", parsed.id)
      .maybeSingle();
    if (loadError) throw loadError;
    if (!target || !isAppRole(target.role)) {
      throw new Error("You do not have permission to perform this action.");
    }

    const targetRole = target.role as AppRole;
    const owners = await activeSuperadminCount();
    const targetIsSelf = target.id === profile.id;

    if (!canManageTarget(profile.role, targetRole)) {
      throw new Error("You do not have permission to perform this action.");
    }

    if (parsed.role !== targetRole) {
      const roleCheck = canChangeUserRole({
        actorRole: profile.role,
        targetRole,
        newRole: parsed.role,
        targetIsSelf,
        superadminCount: owners,
      });
      if (!roleCheck.ok) throw new Error(roleCheck.error);
    }

    if (target.is_active && !parsed.isActive) {
      const deact = canDeactivateUser({
        actorRole: profile.role,
        targetRole,
        targetIsSelf,
        superadminCount: owners,
      });
      if (!deact.ok) throw new Error(deact.error);
    }

    const { error: updateError } = await admin
      .from("profiles")
      .update({
        full_name: parsed.fullName,
        display_name: parsed.fullName,
        role: parsed.role,
        is_active: parsed.isActive,
      })
      .eq("id", parsed.id);
    if (updateError) throw updateError;

    const authUpdate = await admin.auth.admin.updateUserById(parsed.id, {
      user_metadata: { full_name: parsed.fullName },
    });
    if (authUpdate.error) throw new Error("Could not update the user.");

    const oldData = { fullName: target.full_name, role: target.role, isActive: target.is_active };
    const newData = { fullName: parsed.fullName, role: parsed.role, isActive: parsed.isActive };

    if (parsed.role !== targetRole) {
      await writeAudit(supabase, user, {
        action: "ROLE_CHANGED",
        entityType: "profiles",
        entityId: parsed.id,
        oldData: { role: targetRole },
        newData: { role: parsed.role },
      });
    }
    if (target.is_active !== parsed.isActive) {
      await writeAudit(supabase, user, {
        action: parsed.isActive ? "USER_REACTIVATED" : "USER_DEACTIVATED",
        entityType: "profiles",
        entityId: parsed.id,
        oldData,
        newData,
      });
    }
    await writeAudit(supabase, user, {
      action: "USER_UPDATED",
      entityType: "profiles",
      entityId: parsed.id,
      oldData,
      newData,
    });
    revalidatePath("/users");
    return { ok: true };
  } catch (error) {
    return actionError(error);
  }
}

export async function setTemporaryPassword(input: unknown): Promise<Result> {
  try {
    const parsed = setTemporaryPasswordSchema.parse(input);
    const { supabase, user, profile } = await requirePermission("manageUsers");
    const admin = createAdminClient();
    const { data: target, error: loadError } = await admin
      .from("profiles")
      .select("id, full_name, role, is_active")
      .eq("id", parsed.id)
      .maybeSingle();
    if (loadError) throw loadError;
    if (!target || !isAppRole(target.role)) {
      throw new Error("You do not have permission to perform this action.");
    }
    if (!canManageTarget(profile.role, target.role)) {
      throw new Error("You do not have permission to perform this action.");
    }

    const authUpdate = await admin.auth.admin.updateUserById(parsed.id, {
      password: parsed.password,
    });
    if (authUpdate.error) throw new Error("Could not set the temporary password.");

    const { error: flagError } = await admin
      .from("profiles")
      .update({ must_change_password: true })
      .eq("id", parsed.id);
    if (flagError) throw flagError;

    await writeAudit(supabase, user, {
      action: "TEMP_PASSWORD_SET",
      entityType: "profiles",
      entityId: parsed.id,
      newData: { fullName: target.full_name },
    });
    revalidatePath("/users");
    return { ok: true };
  } catch (error) {
    return actionError(error);
  }
}
