export function isPublicAuthPath(pathname: string) {
  return pathname === "/login" || pathname === "/forgot-password" || pathname.startsWith("/auth/");
}

export function isStandaloneSessionPath(pathname: string) {
  return pathname === "/reset-password" || pathname === "/change-password" || pathname === "/inactive" || pathname === "/forbidden";
}

export function safeRedirectPath(value: string | null | undefined, fallback = "/dashboard") {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("://")) {
    return fallback;
  }
  return value;
}

export function passwordResetRedirectTo(origin: string) {
  return `${origin}/auth/callback?next=/reset-password`;
}

export function appOrigin() {
  return process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "http://localhost:3000";
}
