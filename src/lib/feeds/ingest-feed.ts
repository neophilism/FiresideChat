import { db } from "@/lib/db";
import { fetchFeed } from "./fetch-feed";
import { parseFeed } from "./parse-feed";
import { fetchPublisherTranscript } from "./publisher-transcript";
import { calculateRetryAt } from "./retry";
import type { IngestionResult, NormalizedEpisode } from "./types";

const UPSERT_BATCH_SIZE = 20;
const MAX_ERROR_LENGTH = 2_000;

function envPositiveInteger(name: string): number | undefined {
  const raw = process.env[name];
  if (!raw) return undefined;
  const value = Number.parseInt(raw, 10);
  return Number.isInteger(value) && value > 0 ? value : undefined;
}

function errorMessage(error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error);
  return raw.slice(0, MAX_ERROR_LENGTH);
}

function chunks<T>(items: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    result.push(items.slice(index, index + size));
  }
  return result;
}

function episodeData(episode: NormalizedEpisode) {
  return {
    title: episode.title,
    description: episode.description,
    publishedAt: episode.publishedAt,
    sourceUpdatedAt: episode.sourceUpdatedAt,
    durationSeconds: episode.durationSeconds,
    audioUrl: episode.audioUrl,
    audioMimeType: episode.audioMimeType,
    episodeUrl: episode.episodeUrl,
    imageUrl: episode.imageUrl,
    publisherTranscriptUrl: episode.publisherTranscript?.url ?? null,
    publisherTranscriptMimeType: episode.publisherTranscript?.mimeType ?? null,
  };
}

async function ingestPublisherTranscripts(podcastId: string) {
  const limit = envPositiveInteger("PUBLISHER_TRANSCRIPTS_PER_RUN") ?? 20;
  const episodes = await db.episode.findMany({
    where: {
      podcastId,
      publisherTranscriptUrl: { not: null },
      OR: [
        { transcriptStatus: { not: "COMPLETE" } },
        { transcript: { is: null } },
        { transcript: { is: { source: { not: "PUBLISHER" } } } },
      ],
    },
    include: { transcript: true },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });

  for (const episode of episodes) {
    if (!episode.publisherTranscriptUrl) continue;

    await db.episode.update({
      where: { id: episode.id },
      data: { transcriptStatus: "PROCESSING" },
    });

    try {
      const parsed = await fetchPublisherTranscript({
        url: episode.publisherTranscriptUrl,
        mimeType: episode.publisherTranscriptMimeType,
      });

      const transcript = await db.transcript.upsert({
        where: { episodeId: episode.id },
        create: {
          episodeId: episode.id,
          source: "PUBLISHER",
          fullText: parsed.fullText,
        },
        update: {
          source: "PUBLISHER",
          fullText: parsed.fullText,
        },
      });

      await db.transcriptSegment.deleteMany({
        where: { transcriptId: transcript.id },
      });
      if (parsed.segments.length > 0) {
        await db.transcriptSegment.createMany({
          data: parsed.segments.map((segment) => ({
            transcriptId: transcript.id,
            startSeconds: segment.startSeconds,
            endSeconds: segment.endSeconds,
            text: segment.text,
          })),
        });
      }

      await db.episode.update({
        where: { id: episode.id },
        data: { transcriptStatus: "COMPLETE" },
      });
    } catch (error) {
      await db.episode.update({
        where: { id: episode.id },
        data: { transcriptStatus: "FAILED" },
      });
      console.warn(
        `Publisher transcript failed for episode ${episode.id}: ${errorMessage(error)}`,
      );
    }
  }
}

export async function ingestPodcastBySlug(
  podcastSlug: string,
  options: { force?: boolean } = {},
): Promise<IngestionResult> {
  const podcast = await db.podcast.findUnique({
    where: { slug: podcastSlug },
  });

  if (!podcast) {
    return {
      podcastSlug,
      status: "failed",
      episodesSeen: 0,
      episodesCreated: 0,
      episodesUpdated: 0,
      episodesSkipped: 0,
      message: "Podcast was not found",
    };
  }

  if (!podcast.active && !options.force) {
    return {
      podcastSlug,
      status: "skipped",
      episodesSeen: 0,
      episodesCreated: 0,
      episodesUpdated: 0,
      episodesSkipped: 0,
      message: "Podcast ingestion is disabled",
    };
  }

  const now = new Date();
  if (
    !options.force &&
    podcast.nextRetryAt &&
    podcast.nextRetryAt.getTime() > now.getTime()
  ) {
    return {
      podcastSlug,
      status: "skipped",
      episodesSeen: 0,
      episodesCreated: 0,
      episodesUpdated: 0,
      episodesSkipped: 0,
      message: `Backoff active until ${podcast.nextRetryAt.toISOString()}`,
    };
  }

  const run = await db.ingestionRun.create({
    data: { podcastId: podcast.id },
  });

  try {
    await db.podcast.update({
      where: { id: podcast.id },
      data: { lastCheckedAt: now },
    });

    const fetched = await fetchFeed(podcast.rssUrl, {
      etag: podcast.feedEtag,
      lastModified: podcast.feedLastModified,
      timeoutMs: envPositiveInteger("FEED_FETCH_TIMEOUT_MS"),
      maxBytes: envPositiveInteger("FEED_MAX_BYTES"),
      userAgent: process.env.FEED_USER_AGENT,
    });

    if (fetched.status === "not-modified") {
      await ingestPublisherTranscripts(podcast.id);

      await db.$transaction([
        db.podcast.update({
          where: { id: podcast.id },
          data: {
            feedEtag: fetched.etag ?? podcast.feedEtag,
            feedLastModified:
              fetched.lastModified ?? podcast.feedLastModified,
            resolvedFeedUrl: fetched.finalUrl,
            lastSuccessfulCheckAt: now,
            consecutiveFailures: 0,
            nextRetryAt: null,
            lastError: null,
          },
        }),
        db.ingestionRun.update({
          where: { id: run.id },
          data: {
            status: "SUCCEEDED",
            completedAt: new Date(),
            httpStatus: fetched.httpStatus,
            notModified: true,
          },
        }),
      ]);

      return {
        podcastSlug,
        status: "not-modified",
        episodesSeen: 0,
        episodesCreated: 0,
        episodesUpdated: 0,
        episodesSkipped: 0,
      };
    }

    const parsed = parseFeed(fetched.xml);
    const guids = parsed.episodes.map((episode) => episode.guid);
    const existing =
      guids.length === 0
        ? []
        : await db.episode.findMany({
            where: {
              podcastId: podcast.id,
              guid: { in: guids },
            },
            select: { guid: true },
          });
    const existingGuids = new Set(existing.map((episode) => episode.guid));

    for (const batch of chunks(parsed.episodes, UPSERT_BATCH_SIZE)) {
      await db.$transaction(
        batch.map((episode) =>
          db.episode.upsert({
            where: {
              podcastId_guid: {
                podcastId: podcast.id,
                guid: episode.guid,
              },
            },
            create: {
              podcastId: podcast.id,
              guid: episode.guid,
              transcriptStatus: episode.publisherTranscript ? "AVAILABLE" : "MISSING",
              ...episodeData(episode),
            },
            update: episodeData(episode),
          }),
        ),
      );
    }

    const transcriptGuids = parsed.episodes
      .filter((episode) => episode.publisherTranscript)
      .map((episode) => episode.guid);
    if (transcriptGuids.length > 0) {
      await db.episode.updateMany({
        where: {
          podcastId: podcast.id,
          guid: { in: transcriptGuids },
          transcriptStatus: "MISSING",
        },
        data: { transcriptStatus: "AVAILABLE" },
      });
    }

    await ingestPublisherTranscripts(podcast.id);

    const episodesCreated = parsed.episodes.filter(
      (episode) => !existingGuids.has(episode.guid),
    ).length;
    const episodesUpdated = parsed.episodes.length - episodesCreated;
    const newestPublishedAt = parsed.episodes.reduce<Date | null>(
      (newest, episode) =>
        !newest || episode.publishedAt > newest
          ? episode.publishedAt
          : newest,
      null,
    );

    await db.$transaction([
      db.podcast.update({
        where: { id: podcast.id },
        data: {
          feedTitle: parsed.metadata.title,
          feedDescription: parsed.metadata.description,
          feedWebsiteUrl: parsed.metadata.websiteUrl,
          feedImageUrl: parsed.metadata.imageUrl,
          language: parsed.metadata.language,
          feedEtag: fetched.etag,
          feedLastModified: fetched.lastModified,
          resolvedFeedUrl: fetched.finalUrl,
          lastSuccessfulCheckAt: now,
          lastEpisodeAt: newestPublishedAt ?? podcast.lastEpisodeAt,
          consecutiveFailures: 0,
          nextRetryAt: null,
          lastError: null,
        },
      }),
      db.ingestionRun.update({
        where: { id: run.id },
        data: {
          status: "SUCCEEDED",
          completedAt: new Date(),
          httpStatus: fetched.httpStatus,
          feedBytes: fetched.bytes,
          episodesSeen: parsed.episodes.length,
          episodesCreated,
          episodesUpdated,
          episodesSkipped: parsed.skippedItems + parsed.duplicateItems,
        },
      }),
    ]);

    return {
      podcastSlug,
      status: "succeeded",
      episodesSeen: parsed.episodes.length,
      episodesCreated,
      episodesUpdated,
      episodesSkipped: parsed.skippedItems + parsed.duplicateItems,
    };
  } catch (error) {
    const message = errorMessage(error);
    const failures = podcast.consecutiveFailures + 1;

    await db.$transaction([
      db.podcast.update({
        where: { id: podcast.id },
        data: {
          consecutiveFailures: failures,
          nextRetryAt: calculateRetryAt(failures),
          lastError: message,
        },
      }),
      db.ingestionRun.update({
        where: { id: run.id },
        data: {
          status: "FAILED",
          completedAt: new Date(),
          error: message,
        },
      }),
    ]);

    return {
      podcastSlug,
      status: "failed",
      episodesSeen: 0,
      episodesCreated: 0,
      episodesUpdated: 0,
      episodesSkipped: 0,
      message,
    };
  }
}
