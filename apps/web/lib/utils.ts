import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatZmw(value: number | null | undefined): string {
  const n = Number(value ?? 0);
  return `K ${n.toLocaleString("en-ZM", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatPct(value: number | null | undefined, digits = 1): string {
  return `${((Number(value ?? 0)) * 100).toFixed(digits)}%`;
}

export function formatNumber(value: number | null | undefined, digits = 0): string {
  return Number(value ?? 0).toLocaleString("en-ZM", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function publicError(error: unknown): string {
  if (error instanceof Error) {
    const msg = error.message;
    if (/duplicate key/i.test(msg)) return "A record for this flock and date already exists.";
    if (/not Active/i.test(msg)) return "That flock is not Active.";
    if (/exceed/i.test(msg)) return msg;
    if (/future/i.test(msg)) return "Date cannot be in the future.";
    if (/House is not Active/i.test(msg)) return "House is not Active.";
    if (/Feed usage exceeds/i.test(msg)) return msg;
    if (/permission/i.test(msg) || /inactive/i.test(msg) || /Unauthorized/i.test(msg)) return msg;
    if (/always be at least one/i.test(msg) || /cannot deactivate/i.test(msg) || /cannot remove the Superadmin/i.test(msg)) {
      return msg;
    }
    if (/User management is not configured/i.test(msg)) return msg;
    if (/already exists/i.test(msg) || /Could not create the user/i.test(msg) || /Could not update the user/i.test(msg)) {
      return msg;
    }
    if (/Current password is incorrect/i.test(msg) || /Could not update your password/i.test(msg) || /different from your current password/i.test(msg)) {
      return msg;
    }
    if (/Could not set the temporary password/i.test(msg)) return msg;
    return "Something went wrong. Please check your entries and try again.";
  }
  return "Something went wrong. Please check your entries and try again.";
}
