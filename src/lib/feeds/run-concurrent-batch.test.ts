import assert from "node:assert/strict";
import { test } from "node:test";
import { runConcurrentBatch } from "./run-concurrent-batch";

test("executes every operation in a successful batch", async () => {
  const completed: number[] = [];
  await runConcurrentBatch([
    async () => { completed.push(1); },
    async () => { completed.push(2); },
  ]);
  assert.deepEqual(completed, [1, 2]);
});

test("waits for other operations to finish before reporting failure", async () => {
  const completed: string[] = [];
  let release!: () => void;
  const gate = new Promise<void>((resolve) => { release = resolve; });

  const batch = runConcurrentBatch([
    async () => { completed.push("failed"); throw new Error("upsert failed"); },
    async () => {
      completed.push("started");
      await gate;
      completed.push("finished");
    },
  ]);

  await Promise.resolve();
  release();
  await assert.rejects(batch, /upsert failed/);
  assert.deepEqual(completed, ["failed", "started", "finished"]);
});

test("handles empty batches", async () => {
  await runConcurrentBatch([]);
});
