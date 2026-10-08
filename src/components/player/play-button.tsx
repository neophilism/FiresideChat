"use client";

import { usePlayer } from "./player-provider";
import type { PlayerEpisode } from "./player-types";

export function PlayButton({
  episode,
  compact = false,
  startAt,
}: {
  episode: PlayerEpisode;
  compact?: boolean;
  startAt?: number;
}) {
  const { current, playing, currentTime, playEpisode, playEpisodeAt, toggle } = usePlayer();
  const active = current?.id === episode.id;

  function handleClick() {
    if (
      active &&
      typeof startAt === "number" &&
      Number.isFinite(startAt) &&
      startAt > 0 &&
      Math.abs(currentTime - startAt) > 1
    ) {
      playEpisodeAt(episode, startAt);
      return;
    }

    if (active) {
      toggle();
      return;
    }

    if (typeof startAt === "number" && Number.isFinite(startAt) && startAt > 0) {
      playEpisodeAt(episode, startAt);
      return;
    }

    playEpisode(episode);
  }

  return (
    <button
      className={compact ? "play-button play-button-compact" : "play-button"}
      type="button"
      onClick={handleClick}
      aria-label={
        active && playing ? `Pause ${episode.title}` : `Play ${episode.title}`
      }
    >
      <span aria-hidden="true">{active && playing ? "Ⅱ" : "▶"}</span>
    </button>
  );
}
