"use server";

import { writeAudit } from "@/lib/audit";
import { requireUser } from "@/lib/supabase/server";

export async function logAuthEvent(action: "LOGIN" | "LOGOUT") {
  try {
    const { supabase, user } = await requireUser();
    await writeAudit(supabase, user, { action, entityType: "auth", entityId: user.id });
  } catch {
    // Login/logout audit must not block authentication.
  }
}
