import { db } from "@/lib/db";
import { transcribeAudioWithOpenAI } from "./openai-transcription";

const DEFAULT_LIMIT = 2;
const DEFAULT_MAX_ATTEMPTS = 3;
const DEFAULT_RETRY_DELAY_MINUTES = 60;
const MAX_ERROR_LENGTH = 2_000;

function positiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function envBoolean(value: string | undefined) {
  return value?.trim().toLowerCase() === "true";
}

function errorMessage(error: unknown) {
  const raw = error instanceof Error ? error.message : String(error);
  return raw.slice(0, MAX_ERROR_LENGTH);
}

export type GeneratedTranscriptionRun = {
  enabled: boolean;
  selected: number;
  completed: number;
  failed: number;
  skipped: number;
};

export async function transcribeMissingEpisodes(options: {
  limit?: number;
  force?: boolean;
} = {}): Promise<GeneratedTranscriptionRun> {
  const enabled = options.force || envBoolean(process.env.TRANSCRIPTION_ENABLED);
  const apiKey = process.env.OPENAI_API_KEY;

  if (!enabled || !apiKey) {
    return {
      enabled: false,
      selected: 0,
      completed: 0,
      failed: 0,
      skipped: 0,
    };
  }

  const limit =
    options.limit ??
    positiveInteger(process.env.TRANSCRIPTION_MAX_EPISODES_PER_RUN, DEFAULT_LIMIT);
  const maxAttempts = positiveInteger(
    process.env.TRANSCRIPTION_MAX_ATTEMPTS,
    DEFAULT_MAX_ATTEMPTS,
  );
  const retryMinutes = positiveInteger(
    process.env.TRANSCRIPTION_RETRY_DELAY_MINUTES,
    DEFAULT_RETRY_DELAY_MINUTES,
  );
  const retryBefore = new Date(Date.now() - retryMinutes * 60_000);

  const episodes = await db.episode.findMany({
    where: {
      podcast: { active: true },
      publisherTranscriptUrl: null,
      transcriptionAttempts: { lt: maxAttempts },
      OR: [
        { transcriptStatus: "MISSING" },
        { transcriptStatus: "FAILED" },
      ],
      AND: [
        {
          OR: [
            { transcriptionLastAttemptAt: null },
            { transcriptionLastAttemptAt: { lte: retryBefore } },
          ],
        },
        {
          OR: [
            { transcript: { is: null } },
            { transcript: { is: { source: "GENERATED" } } },
          ],
        },
      ],
    },
    orderBy: [{ publishedAt: "desc" }, { id: "asc" }],
    take: limit,
  });

  if (episodes.length > 0) {
    await db.episode.updateMany({
      where: { id: { in: episodes.map((episode) => episode.id) } },
      data: { transcriptStatus: "QUEUED" },
    });
  }

  const result: GeneratedTranscriptionRun = {
    enabled: true,
    selected: episodes.length,
    completed: 0,
    failed: 0,
    skipped: 0,
  };

  for (const selected of episodes) {
    const episode = await db.episode.findUnique({
      where: { id: selected.id },
      include: { transcript: true },
    });

    if (
      !episode ||
      episode.publisherTranscriptUrl ||
      episode.transcript?.source === "PUBLISHER"
    ) {
      if (episode) {
        await db.episode.update({
          where: { id: episode.id },
          data: {
            transcriptStatus:
              episode.transcript?.source === "PUBLISHER"
                ? "COMPLETE"
                : "AVAILABLE",
          },
        });
      }
      result.skipped += 1;
      continue;
    }

    await db.episode.update({
      where: { id: episode.id },
      data: {
        transcriptStatus: "PROCESSING",
        transcriptionAttempts: { increment: 1 },
        transcriptionLastAttemptAt: new Date(),
        transcriptionLastError: null,
      },
    });

    try {
      const transcript = await transcribeAudioWithOpenAI({
        audioUrl: episode.audioUrl,
        audioMimeType: episode.audioMimeType,
        apiKey,
        model: process.env.TRANSCRIPTION_MODEL ?? "whisper-1",
        maxBytes: positiveInteger(
          process.env.TRANSCRIPTION_MAX_AUDIO_BYTES,
          24 * 1024 * 1024,
        ),
        timeoutMs: positiveInteger(
          process.env.TRANSCRIPTION_TIMEOUT_MS,
          120_000,
        ),
      });

      const latest = await db.episode.findUnique({
        where: { id: episode.id },
        include: { transcript: true },
      });

      if (
        !latest ||
        latest.publisherTranscriptUrl ||
        latest.transcript?.source === "PUBLISHER"
      ) {
        if (latest) {
          await db.episode.update({
            where: { id: latest.id },
            data: {
              transcriptStatus:
                latest.transcript?.source === "PUBLISHER"
                  ? "COMPLETE"
                  : "AVAILABLE",
            },
          });
        }
        result.skipped += 1;
        continue;
      }

      const row = await db.transcript.upsert({
        where: { episodeId: episode.id },
        create: {
          episodeId: episode.id,
          source: "GENERATED",
          language: transcript.language ?? "en",
          fullText: transcript.fullText,
        },
        update: {
          source: "GENERATED",
          language: transcript.language ?? "en",
          fullText: transcript.fullText,
        },
      });

      await db.transcriptSegment.deleteMany({
        where: { transcriptId: row.id },
      });
      if (transcript.segments.length > 0) {
        await db.transcriptSegment.createMany({
          data: transcript.segments.map((segment) => ({
            transcriptId: row.id,
            startSeconds: segment.startSeconds,
            endSeconds: segment.endSeconds,
            text: segment.text,
          })),
        });
      }

      await db.episode.update({
        where: { id: episode.id },
        data: {
          transcriptStatus: "COMPLETE",
          transcriptionLastError: null,
        },
      });
      result.completed += 1;
    } catch (error) {
      await db.episode.update({
        where: { id: episode.id },
        data: {
          transcriptStatus: "FAILED",
          transcriptionLastError: errorMessage(error),
        },
      });
      result.failed += 1;
    }
  }

  return result;
}
