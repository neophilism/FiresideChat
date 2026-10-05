import assert from "node:assert/strict";
import test from "node:test";
import { assertSafeFeedUrl, FeedFetchError } from "./fetch-feed";
import { calculateRetryAt } from "./retry";

test("accepts public HTTPS feed URLs", () => {
  assert.equal(
    assertSafeFeedUrl("https://feeds.example.org/show.xml").toString(),
    "https://feeds.example.org/show.xml",
  );
});

test("rejects unsafe feed URL forms", () => {
  for (const url of [
    "http://feeds.example.org/show.xml",
    "https://localhost/show.xml",
    "https://127.0.0.1/show.xml",
    "https://[::1]/show.xml",
    "https://user:password@example.org/show.xml",
    "https://internal.local/show.xml",
  ]) {
    assert.throws(() => assertSafeFeedUrl(url), FeedFetchError);
  }
});

test("calculates capped exponential retry backoff", () => {
  const now = new Date("2026-10-05T12:00:00Z");
  assert.equal(
    calculateRetryAt(1, now).toISOString(),
    "2026-10-05T12:15:00.000Z",
  );
  assert.equal(
    calculateRetryAt(2, now).toISOString(),
    "2026-10-05T12:30:00.000Z",
  );
  assert.equal(
    calculateRetryAt(20, now).toISOString(),
    "2026-10-06T12:00:00.000Z",
  );
});
