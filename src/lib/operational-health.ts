import { db } from "@/lib/db";

export type FeedOperationalStatus =
  | "healthy"
  | "stale"
  | "failing"
  | "never-synced";

export function classifyFeedHealth(
  feed: {
    lastSuccessfulCheckAt: Date | null;
    consecutiveFailures: number;
  },
  staleCutoff: Date,
): FeedOperationalStatus {
  if (feed.consecutiveFailures > 0) return "failing";
  if (!feed.lastSuccessfulCheckAt) return "never-synced";
  if (feed.lastSuccessfulCheckAt < staleCutoff) return "stale";
  return "healthy";
}

function positiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export async function getOperationalHealth() {
  const staleHours = positiveInteger(
    process.env.ADMIN_STALE_FEED_HOURS,
    36,
  );
  const staleCutoff = new Date(Date.now() - staleHours * 60 * 60 * 1000);

  const [feeds, episodeCount, transcriptComplete, latestSuccessfulRun] =
    await Promise.all([
      db.podcast.findMany({
        where: { active: true },
        select: {
          lastSuccessfulCheckAt: true,
          consecutiveFailures: true,
        },
      }),
      db.episode.count(),
      db.episode.count({ where: { transcriptStatus: "COMPLETE" } }),
      db.ingestionRun.findFirst({
        where: { status: "SUCCEEDED" },
        orderBy: { completedAt: "desc" },
        select: { completedAt: true },
      }),
    ]);

  const statuses = feeds.map((feed) => classifyFeedHealth(feed, staleCutoff));
  const failingFeeds = statuses.filter((status) => status === "failing").length;
  const staleFeeds = statuses.filter((status) => status === "stale").length;
  const neverSyncedFeeds = statuses.filter(
    (status) => status === "never-synced",
  ).length;

  return {
    ok: true,
    service: "fireside-chat",
    database: "reachable",
    checkedAt: new Date().toISOString(),
    feeds: {
      active: feeds.length,
      healthy:
        feeds.length - failingFeeds - staleFeeds - neverSyncedFeeds,
      failing: failingFeeds,
      stale: staleFeeds,
      neverSynced: neverSyncedFeeds,
      staleAfterHours: staleHours,
      lastSuccessfulRunAt:
        latestSuccessfulRun?.completedAt?.toISOString() ?? null,
    },
    archive: {
      episodes: episodeCount,
      transcriptsComplete: transcriptComplete,
      transcriptCoveragePercent:
        episodeCount > 0
          ? Math.round((transcriptComplete / episodeCount) * 100)
          : 0,
    },
  };
}
