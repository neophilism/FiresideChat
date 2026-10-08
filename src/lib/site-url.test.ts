import assert from "node:assert/strict";
import test from "node:test";
import { normalizeSiteUrl } from "./site-url";

test("normalizes configured site origins", () => {
  assert.equal(
    normalizeSiteUrl("https://example.com/path?q=1#fragment"),
    "https://example.com",
  );
  assert.equal(normalizeSiteUrl("http://localhost:3000/"), "http://localhost:3000");
});

test("falls back to the current Fireside Chat deployment for invalid values", () => {
  assert.equal(
    normalizeSiteUrl("javascript:alert(1)"),
    "https://fireside-chat-preview.onrender.com",
  );
  assert.equal(
    normalizeSiteUrl("not a url"),
    "https://fireside-chat-preview.onrender.com",
  );
  assert.equal(
    normalizeSiteUrl(undefined),
    "https://fireside-chat-preview.onrender.com",
  );
});
