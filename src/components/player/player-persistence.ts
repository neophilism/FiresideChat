import type { PlayerEpisode } from "./player-types";

export const PLAYER_STORAGE_KEY = "fireside-chat-player-v1";

export type PersistedPlayerState = {
  version: 1;
  episode: PlayerEpisode;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
};

function finiteNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function validEpisode(value: unknown): value is PlayerEpisode {
  if (!value || typeof value !== "object") return false;
  const episode = value as Record<string, unknown>;
  return (
    typeof episode.id === "string" &&
    typeof episode.title === "string" &&
    typeof episode.audioUrl === "string" &&
    typeof episode.podcastTitle === "string" &&
    typeof episode.podcastSlug === "string" &&
    typeof episode.personName === "string" &&
    (episode.imageUrl === undefined ||
      episode.imageUrl === null ||
      typeof episode.imageUrl === "string")
  );
}

export function normalizePersistedPlayerState(
  value: unknown,
): PersistedPlayerState | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  if (record.version !== 1 || !validEpisode(record.episode)) return null;

  const currentTime = finiteNumber(record.currentTime);
  const duration = finiteNumber(record.duration);
  const volume = finiteNumber(record.volume);
  const playbackRate = finiteNumber(record.playbackRate);

  if (
    currentTime === null ||
    duration === null ||
    volume === null ||
    playbackRate === null
  ) {
    return null;
  }

  const normalizedDuration = Math.max(0, duration);
  const nearEnd =
    normalizedDuration > 0 && currentTime >= normalizedDuration - 15;

  return {
    version: 1,
    episode: record.episode,
    currentTime: nearEnd ? 0 : Math.max(0, currentTime),
    duration: normalizedDuration,
    volume: clamp(volume, 0, 1),
    playbackRate: clamp(playbackRate, 0.5, 3),
  };
}

export function parsePersistedPlayerState(
  serialized: string | null,
): PersistedPlayerState | null {
  if (!serialized) return null;
  try {
    return normalizePersistedPlayerState(JSON.parse(serialized));
  } catch {
    return null;
  }
}

export function serializePlayerState(
  state: Omit<PersistedPlayerState, "version">,
) {
  return JSON.stringify({ version: 1, ...state } satisfies PersistedPlayerState);
}
