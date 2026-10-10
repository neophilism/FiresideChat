export async function register() {
  // Next.js runs this hook separately in the Node and Edge runtimes.
  // The periodic worker is intentionally server-only, production-only,
  // and disabled in CI so it cannot interfere with build/test databases.
  if (
    process.env.NEXT_RUNTIME !== "nodejs" ||
    process.env.NODE_ENV !== "production" ||
    process.env.CI === "true" ||
    process.env.TRANSCRIPT_RECOVERY_AUTOSTART === "false"
  ) return;

  const { startTranscriptRecoveryScheduler } = await import(
    "./lib/transcription/recovery-scheduler"
  );
  startTranscriptRecoveryScheduler();
}
