import { isAppRole, type AppRole } from "@farmnow/domain";
import { createAdminClient } from "@/lib/supabase/admin";
import { requirePermission } from "@/lib/supabase/server";

export type ManagedUser = {
  id: string;
  full_name: string;
  email: string;
  role: AppRole;
  is_active: boolean;
  created_at: string;
  last_sign_in_at: string | null;
};

export async function listManagedUsers(): Promise<ManagedUser[]> {
  await requirePermission("manageUsers");
  const admin = createAdminClient();
  const [{ data: profiles, error }, authUsers] = await Promise.all([
    admin.from("profiles").select("id, full_name, role, is_active, created_at").order("created_at"),
    admin.auth.admin.listUsers({ perPage: 200 }),
  ]);
  if (error) throw error;

  const byId = new Map((authUsers.data.users ?? []).map((u) => [u.id, u]));
  return (profiles ?? [])
    .filter((row) => isAppRole(row.role))
    .map((row) => {
      const auth = byId.get(row.id);
      return {
        id: row.id,
        full_name: row.full_name,
        email: auth?.email ?? "",
        role: row.role,
        is_active: row.is_active,
        created_at: row.created_at,
        last_sign_in_at: auth?.last_sign_in_at ?? null,
      };
    });
}
