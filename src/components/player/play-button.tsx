"use client";

import { usePlayer } from "./player-provider";
import type { PlayerEpisode } from "./player-types";

export function PlayButton({
  episode,
  compact = false,
}: {
  episode: PlayerEpisode;
  compact?: boolean;
}) {
  const { current, playing, playEpisode, toggle } = usePlayer();
  const active = current?.id === episode.id;

  function handleClick() {
    if (active) {
      toggle();
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
