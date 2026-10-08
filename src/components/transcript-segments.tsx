"use client";

import { usePlayer } from "@/components/player/player-provider";
import type { PlayerEpisode } from "@/components/player/player-types";

type Segment = {
  id: string;
  startSeconds: number;
  endSeconds: number;
  text: string;
};

function transcriptClock(seconds: number) {
  const whole = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(whole / 3600);
  const minutes = Math.floor((whole % 3600) / 60);
  const secs = whole % 60;

  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
    : `${minutes}:${String(secs).padStart(2, "0")}`;
}

export function TranscriptSegments({
  episode,
  segments,
}: {
  episode: PlayerEpisode;
  segments: Segment[];
}) {
  const { current, currentTime, playEpisodeAt } = usePlayer();

  return (
    <ol className="transcript-segments">
      {segments.map((segment) => {
        const active =
          current?.id === episode.id &&
          currentTime >= segment.startSeconds &&
          currentTime < segment.endSeconds;

        return (
          <li
            id={`segment-${segment.id}`}
            key={segment.id}
            className={active ? "transcript-segment-active" : undefined}
          >
            <button
              className="transcript-time"
              type="button"
              onClick={() => playEpisodeAt(episode, segment.startSeconds)}
              aria-label={`Play from ${transcriptClock(segment.startSeconds)}`}
              aria-current={active ? "true" : undefined}
            >
              {transcriptClock(segment.startSeconds)}
            </button>
            <p>{segment.text}</p>
          </li>
        );
      })}
    </ol>
  );
}
