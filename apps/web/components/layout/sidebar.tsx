"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Bird,
  ClipboardList,
  LayoutDashboard,
  Package,
  Pill,
  Receipt,
  Settings,
  ShoppingCart,
  Skull,
  Thermometer,
  Tractor,
  TrendingUp,
  Users,
  Wallet,
  Wheat,
  FileText,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { navForRole, ROLE_LABELS, type AppRole } from "@farmnow/domain";

const icons: Record<string, typeof LayoutDashboard> = {
  "/dashboard": LayoutDashboard,
  "/flocks": Bird,
  "/performance": TrendingUp,
  "/routines": ClipboardList,
  "/environment": Thermometer,
  "/mortality": Skull,
  "/feed": Wheat,
  "/medicine": Pill,
  "/inventory": Package,
  "/sales": ShoppingCart,
  "/purchases": Tractor,
  "/expenses": Receipt,
  "/income": Wallet,
  "/customers": Building2,
  "/suppliers": Building2,
  "/reports": FileText,
  "/users": Users,
  "/settings": Settings,
};

export function Sidebar({ role, onNavigate }: { role: AppRole; onNavigate?: () => void }) {
  const pathname = usePathname();
  const groups = navForRole(role);
  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <Activity className="h-5 w-5" />
        </div>
        <div>
          <p className="font-serif text-lg leading-none">FarmNow</p>
          <p className="mt-1 text-xs text-sidebar-muted">{ROLE_LABELS[role]}</p>
        </div>
      </div>
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 pb-8" aria-label="Main">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-muted">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                const Icon = icons[item.href] ?? LayoutDashboard;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors",
                        active ? "bg-white/10 text-white" : "text-sidebar-muted hover:bg-white/5 hover:text-white",
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
}
