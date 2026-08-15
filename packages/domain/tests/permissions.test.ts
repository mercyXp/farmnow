import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  APP_ROLES,
  canAccessPath,
  canAssignRole,
  canChangeUserRole,
  canDeactivateUser,
  canManageTarget,
  assignableRoles,
  hasPermission,
  navForRole,
  ROLE_PERMISSIONS,
} from "../src/permissions.ts";

describe("permission matrix", () => {
  it("gives Superadmin every permission", () => {
    assert.equal(hasPermission("superadmin", "manageUsers"), true);
    assert.equal(hasPermission("superadmin", "manageSettings"), true);
    assert.equal(hasPermission("superadmin", "recordMortality"), true);
    assert.equal(ROLE_PERMISSIONS.superadmin.length > 20, true);
  });

  it("does not give Admin system settings", () => {
    assert.equal(hasPermission("admin", "manageUsers"), true);
    assert.equal(hasPermission("admin", "manageMasters"), true);
    assert.equal(hasPermission("admin", "manageSettings"), false);
  });

  it("keeps Manager read-only on transactions", () => {
    assert.equal(hasPermission("manager", "viewFinancials"), true);
    assert.equal(hasPermission("manager", "viewFinancialReports"), true);
    assert.equal(hasPermission("manager", "createFlock"), false);
    assert.equal(hasPermission("manager", "recordMortality"), false);
    assert.equal(hasPermission("manager", "manageUsers"), false);
  });

  it("lets Supervisor record operations but not finances or users", () => {
    assert.equal(hasPermission("supervisor", "recordMortality"), true);
    assert.equal(hasPermission("supervisor", "recordFeedUsage"), true);
    assert.equal(hasPermission("supervisor", "viewFinancials"), false);
    assert.equal(hasPermission("supervisor", "viewSales"), false);
    assert.equal(hasPermission("supervisor", "manageUsers"), false);
    assert.equal(hasPermission("supervisor", "manageSettings"), false);
  });

  it("lets Accountant work finances without farm operations or roles", () => {
    assert.equal(hasPermission("accountant", "recordSale"), true);
    assert.equal(hasPermission("accountant", "viewFinancialReports"), true);
    assert.equal(hasPermission("accountant", "recordMortality"), false);
    assert.equal(hasPermission("accountant", "viewMedicine"), false);
    assert.equal(hasPermission("accountant", "changeRoles"), false);
    assert.equal(hasPermission("accountant", "manageSettings"), false);
  });

  it("lets Entry Clerk record daily work without admin or financial summaries", () => {
    assert.equal(hasPermission("entry_clerk", "recordMortality"), true);
    assert.equal(hasPermission("entry_clerk", "recordSale"), true);
    assert.equal(hasPermission("entry_clerk", "createFlock"), false);
    assert.equal(hasPermission("entry_clerk", "viewFinancials"), false);
    assert.equal(hasPermission("entry_clerk", "viewAuditLogs"), false);
    assert.equal(hasPermission("entry_clerk", "manageUsers"), false);
  });
});

describe("routes", () => {
  it("blocks Entry Clerk from users, settings, and financial reports", () => {
    assert.equal(canAccessPath("entry_clerk", "/dashboard"), true);
    assert.equal(canAccessPath("entry_clerk", "/mortality"), true);
    assert.equal(canAccessPath("entry_clerk", "/users"), false);
    assert.equal(canAccessPath("entry_clerk", "/settings"), false);
    assert.equal(canAccessPath("entry_clerk", "/reports"), false);
    assert.equal(canAccessPath("entry_clerk", "/flocks/new"), false);
  });

  it("allows Accountant onto sales and reports but not mortality", () => {
    assert.equal(canAccessPath("accountant", "/sales"), true);
    assert.equal(canAccessPath("accountant", "/reports"), true);
    assert.equal(canAccessPath("accountant", "/mortality"), false);
    assert.equal(canAccessPath("accountant", "/users"), false);
  });

  it("allows Superadmin onto every major module", () => {
    for (const path of ["/users", "/settings", "/reports", "/flocks/new", "/customers"]) {
      assert.equal(canAccessPath("superadmin", path), true);
    }
  });

  it("blocks Supervisor from finances, users, and settings", () => {
    assert.equal(canAccessPath("supervisor", "/mortality"), true);
    assert.equal(canAccessPath("supervisor", "/sales"), false);
    assert.equal(canAccessPath("supervisor", "/purchases"), false);
    assert.equal(canAccessPath("supervisor", "/users"), false);
    assert.equal(canAccessPath("supervisor", "/settings"), false);
    assert.equal(canAccessPath("supervisor", "/reports"), true);
  });

  it("blocks Manager from user administration and data entry routes that create flocks", () => {
    assert.equal(canAccessPath("manager", "/reports"), true);
    assert.equal(canAccessPath("manager", "/users"), false);
    assert.equal(canAccessPath("manager", "/settings"), false);
    assert.equal(canAccessPath("manager", "/flocks/new"), false);
  });

  it("hides Users from Manager, Supervisor, Accountant, and Entry Clerk nav", () => {
    for (const role of ["manager", "supervisor", "accountant", "entry_clerk"] as const) {
      const hrefs = navForRole(role).flatMap((g) => g.items.map((i) => i.href));
      assert.equal(hrefs.includes("/users"), false);
    }
  });
});

describe("superadmin protection", () => {
  it("prevents deactivating the only Superadmin", () => {
    const result = canDeactivateUser({
      actorRole: "superadmin",
      targetRole: "superadmin",
      targetIsSelf: false,
      superadminCount: 1,
    });
    assert.equal(result.ok, false);
  });

  it("prevents a Superadmin from deactivating themselves", () => {
    const result = canDeactivateUser({
      actorRole: "superadmin",
      targetRole: "superadmin",
      targetIsSelf: true,
      superadminCount: 2,
    });
    assert.equal(result.ok, false);
  });

  it("allows deactivating a Superadmin when another remains", () => {
    const result = canDeactivateUser({
      actorRole: "superadmin",
      targetRole: "superadmin",
      targetIsSelf: false,
      superadminCount: 2,
    });
    assert.equal(result.ok, true);
  });

  it("prevents stripping the Superadmin role from the only Superadmin", () => {
    const result = canChangeUserRole({
      actorRole: "superadmin",
      targetRole: "superadmin",
      newRole: "admin",
      targetIsSelf: false,
      superadminCount: 1,
    });
    assert.equal(result.ok, false);
  });

  it("prevents Admin from managing Superadmin or assigning Superadmin", () => {
    assert.equal(canManageTarget("admin", "superadmin"), false);
    assert.equal(canAssignRole("admin", "superadmin"), false);
    assert.equal(canAssignRole("admin", "admin"), false);
    assert.equal(canAssignRole("admin", "entry_clerk"), true);
  });

  it("blocks Manager from role changes", () => {
    const result = canChangeUserRole({
      actorRole: "manager",
      targetRole: "entry_clerk",
      newRole: "supervisor",
      targetIsSelf: false,
      superadminCount: 1,
    });
    assert.equal(result.ok, false);
  });

  it("lets Admin assign operational roles only", () => {
    assert.deepEqual(assignableRoles("admin"), ["manager", "supervisor", "accountant", "entry_clerk"]);
    assert.equal(assignableRoles("superadmin").includes("superadmin"), true);
    assert.deepEqual(assignableRoles("manager"), []);
  });
});

describe("roles", () => {
  it("defines exactly the six FarmNow roles", () => {
    assert.deepEqual([...APP_ROLES], [
      "superadmin",
      "admin",
      "manager",
      "supervisor",
      "accountant",
      "entry_clerk",
    ]);
  });
});
