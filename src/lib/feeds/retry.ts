export function calculateRetryAt(
  consecutiveFailures: number,
  now = new Date(),
): Date {
  const exponent = Math.max(0, consecutiveFailures - 1);
  const delayMinutes = Math.min(24 * 60, 15 * 2 ** exponent);
  return new Date(now.getTime() + delayMinutes * 60_000);
}
