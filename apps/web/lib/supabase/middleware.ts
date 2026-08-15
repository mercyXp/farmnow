import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { canAccessPath, isAppRole } from "@farmnow/domain";
import { isPublicAuthPath, isStandaloneSessionPath } from "@/lib/auth/paths";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isLogin = pathname === "/login";
  const isForgot = pathname === "/forgot-password";
  const isInactivePage = pathname === "/inactive";
  const isForbiddenPage = pathname === "/forbidden";
  const isChangePassword = pathname === "/change-password";
  const isResetPassword = pathname === "/reset-password";

  if (!user) {
    if (isPublicAuthPath(pathname)) return response;
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (user && (isLogin || isForgot || pathname === "/")) {
    const url = request.nextUrl.clone();
    url.search = "";
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  if (user && !isPublicAuthPath(pathname)) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, is_active, must_change_password")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile?.is_active) {
      if (!isInactivePage) {
        const url = request.nextUrl.clone();
        url.pathname = "/inactive";
        url.search = "";
        return NextResponse.redirect(url);
      }
      return response;
    }

    if (isInactivePage) {
      const url = request.nextUrl.clone();
      url.pathname = profile.must_change_password ? "/change-password" : "/dashboard";
      url.search = "";
      return NextResponse.redirect(url);
    }

    if (profile.must_change_password && !isChangePassword && !isResetPassword) {
      const url = request.nextUrl.clone();
      url.pathname = "/change-password";
      url.search = "";
      return NextResponse.redirect(url);
    }

    if (isChangePassword && !profile.must_change_password) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      url.search = "";
      return NextResponse.redirect(url);
    }

    if (isStandaloneSessionPath(pathname) || isForbiddenPage) return response;

    const role = profile.role;
    if (isAppRole(role) && !canAccessPath(role, pathname)) {
      const url = request.nextUrl.clone();
      url.pathname = "/forbidden";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return response;
}
