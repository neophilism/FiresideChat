import assert from "node:assert/strict";
import test from "node:test";
import {
  createAdminSessionToken,
  verifyAdminSessionToken,
} from "./admin-auth";

test("admin session tokens are deterministic and secret-bound", () => {
  const token = createAdminSessionToken("secret-a");
  assert.equal(token, createAdminSessionToken("secret-a"));
  assert.equal(verifyAdminSessionToken(token, "secret-a"), true);
  assert.equal(verifyAdminSessionToken(token, "secret-b"), false);
  assert.equal(verifyAdminSessionToken("not-a-token", "secret-a"), false);
});
