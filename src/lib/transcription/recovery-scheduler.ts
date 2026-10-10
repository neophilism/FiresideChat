import { backfillExternalTranscripts } from "./external-transcripts";
import { transcribeMissingEpisodes } from "./generated-transcription";

declare global {
  // eslint-disable-next-line no-var
  var __firesideTranscriptSchedulerStarted: boolean | undefined;
}

const LOOP_MINUTES = 20;

export function startTranscriptRecoveryScheduler() {
  if (globalThis.__firesideTranscriptSchedulerStarted) return;
  globalThis.__firesideTranscriptSchedulerStarted = true;

  let running = false;
  async function tick() {
    if (running) return;
    running = true;
    try {
      const external = await backfillExternalTranscripts();
      console.info("Transcript background recovery:", JSON.stringify(external));
      if (process.env.TRANSCRIPTION_ENABLED === "true" && process.env.OPENAI_API_KEY) {
        const generated = await transcribeMissingEpisodes();
        console.info("Transcript generated fallback:", JSON.stringify(generated));
      }
    } catch (error) {
      console.error("Transcript background maintenance failed:", error);
    } finally {
      running = false;
    }
  }

  // Never block the web process startup, Render health checks, or a deploy.
  const first = setTimeout(() => { void tick(); }, 15_000);
  first.unref();
  const interval = setInterval(() => { void tick(); }, LOOP_MINUTES * 60_000);
  interval.unref();
}
