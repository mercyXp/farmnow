import { assignableRoles } from "@farmnow/domain";
import { PageHeader } from "@/components/page-header";
import { UsersManager } from "@/features/users/users-manager";
import { listManagedUsers } from "@/features/users/queries";
import { requirePagePermission } from "@/lib/supabase/server";

export default async function UsersPage() {
  const { profile } = await requirePagePermission("manageUsers");
  const users = await listManagedUsers();
  return (
    <div>
      <PageHeader
        title="Users"
        description="Create staff accounts, assign roles, and deactivate access. Passwords are stored by Supabase Auth, not in FarmNow tables."
      />
      <UsersManager
        users={users}
        actorId={profile.id}
        assignable={assignableRoles(profile.role)}
      />
    </div>
  );
}
