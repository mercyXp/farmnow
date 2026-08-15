export const APP_ROLES = [
  "superadmin",
  "admin",
  "manager",
  "supervisor",
  "accountant",
  "entry_clerk",
] as const;

export type AppRole = (typeof APP_ROLES)[number];

export const ROLE_LABELS: Record<AppRole, string> = {
  superadmin: "Superadmin",
  admin: "Admin",
  manager: "Manager",
  supervisor: "Supervisor",
  accountant: "Accountant",
  entry_clerk: "Entry Clerk",
};

export const PERMISSIONS = [
  "viewFlocks",
  "createFlock",
  "closeFlock",
  "viewMortality",
  "recordMortality",
  "viewFeed",
  "recordFeedUsage",
  "recordFeedPurchase",
  "viewMedicine",
  "recordMedicine",
  "viewInventory",
  "viewSales",
  "recordSale",
  "viewPurchases",
  "recordPurchase",
  "viewExpenses",
  "recordExpense",
  "viewIncome",
  "recordIncome",
  "viewRoutines",
  "recordRoutine",
  "viewEnvironment",
  "recordEnvironment",
  "viewPerformance",
  "viewFinancials",
  "viewFinancialReports",
  "viewOperationalReports",
  "manageUsers",
  "changeRoles",
  "viewAuditLogs",
  "manageSettings",
  "manageMasters",
  "importExcel",
  "viewCustomers",
  "viewSuppliers",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

const ALL: Permission[] = [...PERMISSIONS];

function except(...denied: Permission[]): Permission[] {
  const skip = new Set(denied);
  return ALL.filter((p) => !skip.has(p));
}

/** FarmNow role → permission matrix. Source of truth for UI, server actions, and tests. */
export const ROLE_PERMISSIONS: Record<AppRole, readonly Permission[]> = {
  superadmin: ALL,
  admin: except("manageSettings"),
  manager: [
    "viewFlocks",
    "viewMortality",
    "viewFeed",
    "viewMedicine",
    "viewInventory",
    "viewSales",
    "viewPurchases",
    "viewExpenses",
    "viewIncome",
    "viewRoutines",
    "viewEnvironment",
    "viewPerformance",
    "viewFinancials",
    "viewFinancialReports",
    "viewOperationalReports",
    "viewCustomers",
    "viewSuppliers",
  ],
  supervisor: [
    "viewFlocks",
    "viewMortality",
    "recordMortality",
    "viewFeed",
    "recordFeedUsage",
    "viewMedicine",
    "recordMedicine",
    "viewInventory",
    "viewRoutines",
    "recordRoutine",
    "viewEnvironment",
    "recordEnvironment",
    "viewPerformance",
    "viewOperationalReports",
  ],
  accountant: [
    "viewFlocks",
    "viewInventory",
    "viewSales",
    "recordSale",
    "viewPurchases",
    "recordPurchase",
    "viewExpenses",
    "recordExpense",
    "viewIncome",
    "recordIncome",
    "viewFinancials",
    "viewFinancialReports",
    "viewCustomers",
    "viewSuppliers",
    "recordFeedPurchase",
  ],
  entry_clerk: [
    "viewFlocks",
    "viewMortality",
    "recordMortality",
    "viewFeed",
    "recordFeedUsage",
    "recordFeedPurchase",
    "viewMedicine",
    "recordMedicine",
    "viewInventory",
    "viewSales",
    "recordSale",
    "viewPurchases",
    "recordPurchase",
    "viewExpenses",
    "recordExpense",
    "viewRoutines",
    "recordRoutine",
    "viewEnvironment",
    "recordEnvironment",
  ],
};

const ROLE_SETS: Record<AppRole, Set<Permission>> = {
  superadmin: new Set(ROLE_PERMISSIONS.superadmin),
  admin: new Set(ROLE_PERMISSIONS.admin),
  manager: new Set(ROLE_PERMISSIONS.manager),
  supervisor: new Set(ROLE_PERMISSIONS.supervisor),
  accountant: new Set(ROLE_PERMISSIONS.accountant),
  entry_clerk: new Set(ROLE_PERMISSIONS.entry_clerk),
};

export function isAppRole(value: string): value is AppRole {
  return (APP_ROLES as readonly string[]).includes(value);
}

export function hasPermission(role: AppRole, permission: Permission): boolean {
  return ROLE_SETS[role].has(permission);
}

export function hasAnyPermission(role: AppRole, permissions: readonly Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

export const ADMIN_ASSIGNABLE_ROLES: readonly AppRole[] = [
  "manager",
  "supervisor",
  "accountant",
  "entry_clerk",
];

export function canAssignRole(actor: AppRole, newRole: AppRole): boolean {
  if (actor === "superadmin") return true;
  if (actor === "admin") return (ADMIN_ASSIGNABLE_ROLES as readonly string[]).includes(newRole);
  return false;
}

export function assignableRoles(actor: AppRole): AppRole[] {
  return APP_ROLES.filter((role) => canAssignRole(actor, role));
}

export function canManageTarget(actor: AppRole, target: AppRole): boolean {
  if (actor === "superadmin") return true;
  if (actor === "admin") return (ADMIN_ASSIGNABLE_ROLES as readonly string[]).includes(target);
  return false;
}

export function canDeactivateUser(input: {
  actorRole: AppRole;
  targetRole: AppRole;
  targetIsSelf: boolean;
  superadminCount: number;
}): { ok: true } | { ok: false; error: string } {
  if (!canManageTarget(input.actorRole, input.targetRole)) {
    return { ok: false, error: "You do not have permission to perform this action." };
  }
  if (input.targetIsSelf && input.actorRole === "superadmin") {
    return { ok: false, error: "You cannot deactivate your own Superadmin account." };
  }
  if (input.targetRole === "superadmin" && input.superadminCount <= 1) {
    return { ok: false, error: "There must always be at least one active Superadmin." };
  }
  return { ok: true };
}

export function canChangeUserRole(input: {
  actorRole: AppRole;
  targetRole: AppRole;
  newRole: AppRole;
  targetIsSelf: boolean;
  superadminCount: number;
}): { ok: true } | { ok: false; error: string } {
  if (!hasPermission(input.actorRole, "changeRoles")) {
    return { ok: false, error: "You do not have permission to perform this action." };
  }
  if (!canManageTarget(input.actorRole, input.targetRole) || !canAssignRole(input.actorRole, input.newRole)) {
    return { ok: false, error: "You do not have permission to perform this action." };
  }
  if (input.targetIsSelf && input.actorRole === "superadmin" && input.newRole !== "superadmin") {
    return { ok: false, error: "You cannot remove the Superadmin role from your own account." };
  }
  if (input.targetRole === "superadmin" && input.newRole !== "superadmin" && input.superadminCount <= 1) {
    return { ok: false, error: "There must always be at least one active Superadmin." };
  }
  return { ok: true };
}

export type NavItem = {
  href: string;
  label: string;
  permission: Permission | Permission[];
};

export type NavGroup = { label: string; items: NavItem[] };

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [{ href: "/dashboard", label: "Dashboard", permission: "viewFlocks" }],
  },
  {
    label: "Farm",
    items: [
      { href: "/flocks", label: "Flocks", permission: "viewFlocks" },
      { href: "/performance", label: "Flock performance", permission: "viewPerformance" },
      { href: "/routines", label: "Daily routine", permission: "viewRoutines" },
      { href: "/environment", label: "Environment", permission: "viewEnvironment" },
    ],
  },
  {
    label: "Transactions",
    items: [
      { href: "/mortality", label: "Mortality", permission: "viewMortality" },
      { href: "/feed", label: "Feed", permission: "viewFeed" },
      { href: "/medicine", label: "Medicine", permission: "viewMedicine" },
      { href: "/inventory", label: "Inventory", permission: "viewInventory" },
      { href: "/sales", label: "Sales", permission: "viewSales" },
      { href: "/purchases", label: "Purchases", permission: "viewPurchases" },
      { href: "/expenses", label: "Expenses", permission: "viewExpenses" },
      { href: "/income", label: "Other income", permission: "viewIncome" },
    ],
  },
  {
    label: "Partners",
    items: [
      { href: "/customers", label: "Customers", permission: "viewCustomers" },
      { href: "/suppliers", label: "Suppliers", permission: "viewSuppliers" },
    ],
  },
  {
    label: "Reports",
    items: [{ href: "/reports", label: "Reports", permission: ["viewOperationalReports", "viewFinancialReports"] }],
  },
  {
    label: "System",
    items: [
      { href: "/users", label: "Users", permission: "manageUsers" },
      { href: "/settings", label: "Settings", permission: ["manageSettings", "manageMasters"] },
    ],
  },
];

export function navForRole(role: AppRole): NavGroup[] {
  return NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) =>
      Array.isArray(item.permission) ? hasAnyPermission(role, item.permission) : hasPermission(role, item.permission),
    ),
  })).filter((group) => group.items.length > 0);
}

export function canAccessPath(role: AppRole, pathname: string): boolean {
  if (pathname === "/dashboard" || pathname === "/") return true;
  if (pathname.startsWith("/users")) return hasPermission(role, "manageUsers");
  if (pathname.startsWith("/settings/import")) return hasPermission(role, "importExcel");
  if (pathname.startsWith("/settings")) {
    return hasAnyPermission(role, ["manageSettings", "manageMasters"]);
  }
  if (pathname.startsWith("/flocks/new")) return hasPermission(role, "createFlock");
  if (pathname.startsWith("/flocks")) return hasPermission(role, "viewFlocks");
  if (pathname.startsWith("/performance")) return hasPermission(role, "viewPerformance");
  if (pathname.startsWith("/routines")) return hasPermission(role, "viewRoutines");
  if (pathname.startsWith("/environment")) return hasPermission(role, "viewEnvironment");
  if (pathname.startsWith("/mortality")) return hasPermission(role, "viewMortality");
  if (pathname.startsWith("/feed")) return hasPermission(role, "viewFeed");
  if (pathname.startsWith("/medicine")) return hasPermission(role, "viewMedicine");
  if (pathname.startsWith("/inventory")) return hasPermission(role, "viewInventory");
  if (pathname.startsWith("/sales")) return hasPermission(role, "viewSales");
  if (pathname.startsWith("/purchases")) return hasPermission(role, "viewPurchases");
  if (pathname.startsWith("/expenses")) return hasPermission(role, "viewExpenses");
  if (pathname.startsWith("/income")) return hasPermission(role, "viewIncome");
  if (pathname.startsWith("/customers")) return hasPermission(role, "viewCustomers");
  if (pathname.startsWith("/suppliers")) return hasPermission(role, "viewSuppliers");
  if (pathname.startsWith("/reports")) {
    return hasAnyPermission(role, ["viewOperationalReports", "viewFinancialReports"]);
  }
  return true;
}

export type QuickAction = { href: string; label: string; permission: Permission };

export const QUICK_ACTIONS: Record<AppRole, QuickAction[]> = {
  superadmin: [
    { href: "/users", label: "Create user", permission: "manageUsers" },
    { href: "/flocks/new", label: "Create flock", permission: "createFlock" },
    { href: "/reports", label: "View reports", permission: "viewFinancialReports" },
    { href: "/inventory", label: "Manage inventory", permission: "viewInventory" },
  ],
  admin: [
    { href: "/flocks/new", label: "Create flock", permission: "createFlock" },
    { href: "/mortality", label: "Record transaction", permission: "recordMortality" },
    { href: "/inventory", label: "Manage inventory", permission: "viewInventory" },
    { href: "/reports", label: "View reports", permission: "viewOperationalReports" },
  ],
  manager: [
    { href: "/performance", label: "View performance", permission: "viewPerformance" },
    { href: "/reports", label: "View reports", permission: "viewFinancialReports" },
    { href: "/expenses", label: "Review expenses", permission: "viewExpenses" },
    { href: "/sales", label: "Review sales", permission: "viewSales" },
  ],
  supervisor: [
    { href: "/mortality", label: "Record mortality", permission: "recordMortality" },
    { href: "/feed", label: "Record feed", permission: "recordFeedUsage" },
    { href: "/medicine", label: "Record medicine", permission: "recordMedicine" },
    { href: "/flocks", label: "View flocks", permission: "viewFlocks" },
  ],
  accountant: [
    { href: "/expenses", label: "Record expense", permission: "recordExpense" },
    { href: "/sales", label: "Record sale", permission: "recordSale" },
    { href: "/purchases", label: "Record purchase", permission: "recordPurchase" },
    { href: "/reports", label: "Financial report", permission: "viewFinancialReports" },
  ],
  entry_clerk: [
    { href: "/mortality", label: "Record mortality", permission: "recordMortality" },
    { href: "/feed", label: "Record feed", permission: "recordFeedUsage" },
    { href: "/inventory", label: "Inventory movement", permission: "viewInventory" },
    { href: "/sales", label: "Record sale", permission: "recordSale" },
  ],
};
