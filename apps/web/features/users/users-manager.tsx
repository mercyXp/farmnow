"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { APP_ROLES, ROLE_LABELS, userCreateSchema, type AppRole } from "@farmnow/domain";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { createUser, updateUser } from "@/features/users/actions";
import type { ManagedUser } from "@/features/users/queries";

export function UsersManager({
  users,
  actorId,
  assignable,
}: {
  users: ManagedUser[];
  actorId: string;
  assignable: AppRole[];
}) {
  return (
    <div className="space-y-8">
      <CreateUserForm assignable={assignable} />
      <div className="overflow-hidden rounded-xl border bg-card">
        <Table>
          <THead>
            <TR>
              <TH>Name</TH>
              <TH>Email</TH>
              <TH>Role</TH>
              <TH>Status</TH>
              <TH>Created</TH>
              <TH>Last activity</TH>
              <TH></TH>
            </TR>
          </THead>
          <TBody>
            {users.map((row) => (
              <UserRow
                key={row.id}
                user={row}
                actorId={actorId}
                assignable={assignable}
              />
            ))}
          </TBody>
        </Table>
      </div>
    </div>
  );
}

function CreateUserForm({ assignable }: { assignable: AppRole[] }) {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(userCreateSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      role: assignable[0] ?? "entry_clerk",
      isActive: true,
    },
  });
  return (
    <form
      className="grid gap-3 rounded-xl border bg-card p-6 sm:grid-cols-2 lg:grid-cols-3"
      onSubmit={form.handleSubmit(async (values) => {
        const result = await createUser(values);
        if (!result.ok) {
          toast.error(result.error);
          return;
        }
        toast.success("User created");
        form.reset();
        router.refresh();
      })}
    >
      <div className="space-y-1">
        <Label htmlFor="fullName">Full name</Label>
        <Input id="fullName" {...form.register("fullName")} />
        {form.formState.errors.fullName ? (
          <p className="text-xs text-destructive">{form.formState.errors.fullName.message}</p>
        ) : null}
      </div>
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...form.register("email")} />
        {form.formState.errors.email ? (
          <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
        ) : null}
      </div>
      <div className="space-y-1">
        <Label htmlFor="password">Temporary password</Label>
        <Input id="password" type="password" autoComplete="new-password" {...form.register("password")} />
        {form.formState.errors.password ? (
          <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
        ) : null}
      </div>
      <div className="space-y-1">
        <Label htmlFor="role">Role</Label>
        <select id="role" className="h-10 w-full rounded-md border bg-card px-3 text-sm" {...form.register("role")}>
          {(assignable.length > 0 ? assignable : [...APP_ROLES]).map((role) => (
            <option key={role} value={role}>
              {ROLE_LABELS[role]}
            </option>
          ))}
        </select>
        {form.formState.errors.role ? (
          <p className="text-xs text-destructive">{form.formState.errors.role.message}</p>
        ) : null}
      </div>
      <label className="flex items-center gap-2 self-end text-sm">
        <input type="checkbox" className="h-4 w-4" {...form.register("isActive")} />
        Active
      </label>
      <div className="flex items-end">
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Creating…" : "Create user"}
        </Button>
      </div>
    </form>
  );
}

function UserRow({
  user,
  actorId,
  assignable,
}: {
  user: ManagedUser;
  actorId: string;
  assignable: AppRole[];
}) {
  const [editing, setEditing] = useState(false);
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const roles = assignable.includes(user.role) ? assignable : [user.role, ...assignable];

  async function save(fd: FormData, extras?: { isActive?: boolean }) {
    setPending(true);
    const result = await updateUser({
      id: user.id,
      fullName: String(fd.get("fullName") ?? user.full_name),
      role: String(fd.get("role") ?? user.role),
      isActive: extras?.isActive ?? fd.get("isActive") === "on",
      password: String(fd.get("password") ?? ""),
    });
    setPending(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("User updated");
    setEditing(false);
    router.refresh();
  }

  return (
    <TR>
      <TD colSpan={7} className="p-0">
        {editing ? (
          <form
            className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4"
            onSubmit={async (e) => {
              e.preventDefault();
              await save(new FormData(e.currentTarget));
            }}
          >
            <Field name="fullName" label="Full name" defaultValue={user.full_name} required />
            <RoleSelect name="role" roles={roles} defaultValue={user.role} />
            <Field name="password" label="New password (optional)" type="password" minLength={8} />
            <label className="flex items-center gap-2 self-end text-sm">
              <input type="checkbox" name="isActive" defaultChecked={user.is_active} className="h-4 w-4" />
              Active
            </label>
            <div className="flex gap-2 sm:col-span-2">
              <Button type="submit" disabled={pending}>
                {pending ? "Saving…" : "Save"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-[repeat(6,minmax(0,1fr))_auto] items-center gap-2 px-3 py-3 text-sm">
            <span className="font-medium">{user.full_name}</span>
            <span>{user.email}</span>
            <span>{ROLE_LABELS[user.role]}</span>
            <span>
              <Badge variant={user.is_active ? "ok" : "muted"}>{user.is_active ? "Active" : "Inactive"}</Badge>
            </span>
            <span>{user.created_at.slice(0, 10)}</span>
            <span>{user.last_sign_in_at ? user.last_sign_in_at.slice(0, 16).replace("T", " ") : "—"}</span>
            <span className="flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
                Edit
              </Button>
              {user.is_active ? (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={pending}
                  onClick={async () => {
                    if (user.id === actorId && user.role === "superadmin") {
                      toast.error("You cannot deactivate your own Superadmin account.");
                      return;
                    }
                    if (!confirm(`Deactivate ${user.full_name}? They will not be able to sign in.`)) return;
                    const fd = new FormData();
                    fd.set("fullName", user.full_name);
                    fd.set("role", user.role);
                    await save(fd, { isActive: false });
                  }}
                >
                  Deactivate
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={pending}
                  onClick={async () => {
                    if (!confirm(`Reactivate ${user.full_name}?`)) return;
                    const fd = new FormData();
                    fd.set("fullName", user.full_name);
                    fd.set("role", user.role);
                    await save(fd, { isActive: true });
                  }}
                >
                  Reactivate
                </Button>
              )}
            </span>
          </div>
        )}
      </TD>
    </TR>
  );
}

function Field({
  name,
  label,
  type = "text",
  defaultValue,
  required,
  minLength,
}: {
  name: string;
  label: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <div className="space-y-1">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        minLength={minLength}
        autoComplete={type === "password" ? "new-password" : undefined}
      />
    </div>
  );
}

function RoleSelect({ name, roles, defaultValue }: { name: string; roles: AppRole[]; defaultValue?: AppRole }) {
  const options = roles.length > 0 ? roles : [...APP_ROLES];
  return (
    <div className="space-y-1">
      <Label htmlFor={name}>Role</Label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue ?? options[0]}
        className="h-10 w-full rounded-md border bg-card px-3 text-sm"
        required
      >
        {options.map((role) => (
          <option key={role} value={role}>
            {ROLE_LABELS[role]}
          </option>
        ))}
      </select>
    </div>
  );
}
