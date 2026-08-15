import type { Json } from "@farmnow/database";
import type { User } from "@supabase/supabase-js";
import type { createClient } from "@/lib/supabase/server";

type ServerClient = Awaited<ReturnType<typeof createClient>>;

export async function writeAudit(
  supabase: ServerClient,
  user: User,
  input: {
    action: string;
    entityType: string;
    entityId?: string | null;
    oldData?: unknown;
    newData?: unknown;
  },
) {
  try {
    await supabase.from("audit_logs").insert({
      user_id: user.id,
      action: input.action,
      entity_type: input.entityType,
      entity_id: input.entityId ?? null,
      old_data: toJson(input.oldData),
      new_data: toJson(input.newData),
    });
  } catch {
    // Excel logger never blocked a save.
  }
}

function toJson(value: unknown): Json | null {
  if (value == null) return null;
  return JSON.parse(JSON.stringify(value)) as Json;
}

export async function nextCode(supabase: ServerClient, prefix: string): Promise<string> {
  const { data, error } = await supabase.rpc("next_entry_code", { p_prefix: prefix });
  if (error || !data) {
    throw new Error("Could not allocate a document number.");
  }
  return data;
}
