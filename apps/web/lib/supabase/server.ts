import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Database } from "@farmnow/database";
import { hasAnyPermission, isAppRole, type AppRole, type Permission } from "@farmnow/domain";

export type AppProfile = {
  id: string;
  full_name: string;
  role: AppRole;
  is_active: boolean;
};

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Called from a Server Component; middleware will refresh the session.
          }
        },
      },
    },
  );
}

export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error("Unauthorized");
  }
  const { data: row } = await supabase
    .from("profiles")
    .select("id, full_name, role, is_active")
    .eq("id", user.id)
    .maybeSingle();
  if (!row || !row.is_active || !isAppRole(row.role)) {
    throw new Error("Your account is inactive.");
  }
  const profile: AppProfile = {
    id: row.id,
    full_name: row.full_name,
    role: row.role,
    is_active: row.is_active,
  };
  return { supabase, user, profile };
}

export async function requirePermission(...permissions: Permission[]) {
  const ctx = await requireUser();
  if (!hasAnyPermission(ctx.profile.role, permissions)) {
    throw new Error("You do not have permission to perform this action.");
  }
  return ctx;
}

export async function requirePagePermission(...permissions: Permission[]) {
  try {
    return await requirePermission(...permissions);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (/inactive/i.test(message)) redirect("/inactive");
    if (/Unauthorized/i.test(message)) redirect("/login");
    redirect("/forbidden");
  }
}
