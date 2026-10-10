/**
 * Executes a bounded batch of independent writes and waits for every
 * in-flight write to settle before surfacing an error. A feed retry remains
 * safe because each caller upserts by a stable unique key.
 */
export async function runConcurrentBatch(
  tasks: Array<() => Promise<unknown>>,
): Promise<void> {
  const results = await Promise.allSettled(
    tasks.map((task) => Promise.resolve().then(task)),
  );
  const failed = results.find(
    (result): result is PromiseRejectedResult => result.status === "rejected",
  );
  if (failed) throw failed.reason;
}
