import assert from "node:assert/strict";
import test from "node:test";
import { classifyFeedHealth } from "./operational-health";

const cutoff = new Date("2026-10-07T12:00:00Z");

test("classifies feed health for readiness diagnostics", () => {
  assert.equal(
    classifyFeedHealth(
      {
        lastSuccessfulCheckAt: new Date("2026-10-07T13:00:00Z"),
        consecutiveFailures: 0,
      },
      cutoff,
    ),
    "healthy",
  );

  assert.equal(
    classifyFeedHealth(
      {
        lastSuccessfulCheckAt: new Date("2026-10-07T11:59:59Z"),
        consecutiveFailures: 0,
      },
      cutoff,
    ),
    "stale",
  );

  assert.equal(
    classifyFeedHealth(
      { lastSuccessfulCheckAt: null, consecutiveFailures: 0 },
      cutoff,
    ),
    "never-synced",
  );

  assert.equal(
    classifyFeedHealth(
      {
        lastSuccessfulCheckAt: new Date("2026-10-07T13:00:00Z"),
        consecutiveFailures: 2,
      },
      cutoff,
    ),
    "failing",
  );
});
