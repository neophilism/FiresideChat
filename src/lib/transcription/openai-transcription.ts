const OPENAI_TRANSCRIPT_URL = "https://api.openai.com/v1/audio/transcriptions";
const OPENAI_MAX_AUDIO_BYTES = 25 * 1024 * 1024;
const DEFAULT_AUDIO_LIMIT_BYTES = 24 * 1024 * 1024;
const DEFAULT_TIMEOUT_MS = 120_000;

export type GeneratedTranscript = {
  fullText: string;
  language: string | null;
  segments: Array<{
    startSeconds: number;
    endSeconds: number;
    text: string;
  }>;
};

type OpenAITranscriptResponse = {
  text?: unknown;
  language?: unknown;
  segments?: unknown;
};

function safeNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function normalizeOpenAITranscript(
  payload: OpenAITranscriptResponse,
): GeneratedTranscript {
  const fullText =
    typeof payload.text === "string" ? payload.text.trim() : "";
  if (!fullText) {
    throw new Error("Transcription provider returned no text");
  }

  const segments = Array.isArray(payload.segments)
    ? payload.segments.flatMap((entry) => {
        if (!entry || typeof entry !== "object") return [];
        const record = entry as Record<string, unknown>;
        const startSeconds = safeNumber(record.start);
        const endSeconds = safeNumber(record.end);
        const text =
          typeof record.text === "string" ? record.text.trim() : "";

        if (
          startSeconds === null ||
          endSeconds === null ||
          endSeconds < startSeconds ||
          !text
        ) {
          return [];
        }

        return [{ startSeconds, endSeconds, text }];
      })
    : [];

  return {
    fullText,
    language:
      typeof payload.language === "string" && payload.language.trim()
        ? payload.language.trim()
        : null,
    segments,
  };
}

function fileNameForAudio(url: string, mimeType: string | null) {
  const supportedExtensions = new Set([
    ".mp3",
    ".mp4",
    ".mpeg",
    ".mpga",
    ".m4a",
    ".wav",
    ".webm",
  ]);

  try {
    const name = new URL(url).pathname.split("/").filter(Boolean).at(-1);
    if (name) {
      const extension = name.includes(".")
        ? `.${name.split(".").at(-1)?.toLowerCase()}`
        : "";
      if (supportedExtensions.has(extension)) return name;
    }
  } catch {
    // Fall through to a MIME-derived filename.
  }

  if (mimeType?.includes("wav")) return "episode.wav";
  if (mimeType?.includes("webm")) return "episode.webm";
  if (mimeType?.includes("mp4") || mimeType?.includes("m4a")) return "episode.m4a";
  return "episode.mp3";
}

async function boundedAudioDownload(
  url: string,
  options: {
    maxBytes: number;
    timeoutMs: number;
    userAgent?: string;
  },
) {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        options.userAgent ??
        process.env.FEED_USER_AGENT ??
        "FiresideChat/1.0 (+https://github.com/neophilism/FiresideChat)",
    },
    redirect: "follow",
    signal: AbortSignal.timeout(options.timeoutMs),
  });

  if (!response.ok) {
    throw new Error(`Episode audio returned HTTP ${response.status}`);
  }

  const declaredBytes = Number(response.headers.get("content-length") ?? "0");
  if (declaredBytes > options.maxBytes) {
    throw new Error(
      `Episode audio is too large for automatic transcription (${declaredBytes} bytes)`,
    );
  }

  if (!response.body) throw new Error("Episode audio response had no body");

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > options.maxBytes) {
      await reader.cancel();
      throw new Error(
        `Episode audio is too large for automatic transcription (>${options.maxBytes} bytes)`,
      );
    }
    chunks.push(value);
  }

  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return {
    bytes,
    mimeType: response.headers.get("content-type"),
  };
}

export async function transcribeAudioWithOpenAI(options: {
  audioUrl: string;
  audioMimeType: string | null;
  apiKey: string;
  model?: string;
  maxBytes?: number;
  timeoutMs?: number;
  userAgent?: string;
}): Promise<GeneratedTranscript> {
  const maxBytes = Math.min(
    options.maxBytes ?? DEFAULT_AUDIO_LIMIT_BYTES,
    OPENAI_MAX_AUDIO_BYTES,
  );
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  const downloaded = await boundedAudioDownload(options.audioUrl, {
    maxBytes,
    timeoutMs,
    userAgent: options.userAgent,
  });

  const mimeType =
    options.audioMimeType ??
    downloaded.mimeType?.split(";")[0]?.trim() ??
    "audio/mpeg";
  const fileName = fileNameForAudio(options.audioUrl, mimeType);

  const form = new FormData();
  form.append("file", new Blob([downloaded.bytes], { type: mimeType }), fileName);
  form.append("model", options.model ?? "whisper-1");
  form.append("response_format", "verbose_json");
  form.append("timestamp_granularities[]", "segment");

  const response = await fetch(OPENAI_TRANSCRIPT_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${options.apiKey}`,
    },
    body: form,
    signal: AbortSignal.timeout(timeoutMs),
  });

  if (!response.ok) {
    const errorBody = (await response.text()).slice(0, 1_000);
    throw new Error(
      `Transcription provider returned HTTP ${response.status}: ${errorBody}`,
    );
  }

  return normalizeOpenAITranscript(
    (await response.json()) as OpenAITranscriptResponse,
  );
}
