import { db } from "@/lib/db";
import { ingestPodcastBySlug } from "@/lib/feeds/ingest-feed";
import { backfillExternalTranscripts } from "./external-transcripts";
import { transcribeMissingEpisodes } from "./generated-transcription";

declare global {
  // eslint-disable-next-line no-var
  var __firesideTranscriptSchedulerStarted: boolean | undefined;
}

const LOOP_MINUTES = 20;

const FEED_REFRESH_HOURS = 24;
const FEEDS_PER_CYCLE = 5;

async function refreshDuePodcastFeeds() {
  if (process.env.FEED_REFRESH_AUTOMATIC === "false") return;
  const now = new Date();
  const staleCutoff = new Date(now.getTime() - FEED_REFRESH_HOURS * 3600_000);
  const podcasts = await db.podcast.findMany({
    where: {
      active: true,
      AND: [
        {
          OR: [
            { lastSuccessfulCheckAt: null },
            { lastSuccessfulCheckAt: { lte: staleCutoff } },
          ],
        },
        {
          OR: [
            { nextRetryAt: null },
            { nextRetryAt: { lte: now } },
          ],
        },
      ],
    },
    orderBy: [{ lastSuccessfulCheckAt: "asc" }, { slug: "asc" }],
    select: { slug: true },
    take: FEEDS_PER_CYCLE,
  });
  for (const podcast of podcasts) {
    try {
      const result = await ingestPodcastBySlug(podcast.slug);
      console.info("Automatic feed refresh:", JSON.stringify(result));
    } catch (error) {
      console.warn("Automatic feed refresh failed:", podcast.slug, error);
    }
  }
}



export function startTranscriptRecoveryScheduler() {
  if (globalThis.__firesideTranscriptSchedulerStarted) return;
  globalThis.__firesideTranscriptSchedulerStarted = true;

  let running = false;
  async function tick() {
    if (running) return;
    running = true;
    try {
      await refreshDuePodcastFeeds();
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
