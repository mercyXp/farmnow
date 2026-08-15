import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  newPasswordSchema,
  setTemporaryPasswordSchema,
} from "../src/schemas.ts";

describe("password schemas", () => {
  it("rejects a password shorter than 8 characters", () => {
    const result = newPasswordSchema.safeParse({ password: "short", confirmPassword: "short" });
    assert.equal(result.success, false);
  });

  it("rejects mismatched confirmation", () => {
    const result = newPasswordSchema.safeParse({
      password: "FarmNow12",
      confirmPassword: "FarmNow13",
    });
    assert.equal(result.success, false);
  });

  it("accepts matching passwords of at least 8 characters", () => {
    const result = newPasswordSchema.safeParse({
      password: "FarmNow12",
      confirmPassword: "FarmNow12",
    });
    assert.equal(result.success, true);
  });

  it("rejects a new password that matches the current password", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "FarmNow12",
      newPassword: "FarmNow12",
      confirmPassword: "FarmNow12",
    });
    assert.equal(result.success, false);
  });

  it("accepts a real email for forgot-password", () => {
    const result = forgotPasswordSchema.safeParse({ email: "john@farmnow.co.zm" });
    assert.equal(result.success, true);
  });

  it("requires matching confirmation for a temporary password", () => {
    const result = setTemporaryPasswordSchema.safeParse({
      id: "00000000-0000-4000-8000-000000000001",
      password: "TempPass1",
      confirmPassword: "TempPass2",
    });
    assert.equal(result.success, false);
  });
});
