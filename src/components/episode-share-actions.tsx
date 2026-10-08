"use client";

import { useMemo, useState } from "react";
import { usePlayer } from "@/components/player/player-provider";

function shareUrl(episodeId: string, seconds?: number) {
  const url = new URL(`/episodes/${episodeId}`, window.location.origin);
  if (typeof seconds === "number" && Number.isFinite(seconds) && seconds > 1) {
    url.searchParams.set("t", String(Math.floor(seconds)));
  }
  return url.toString();
}

export function EpisodeShareActions({
  episodeId,
  title,
}: {
  episodeId: string;
  title: string;
}) {
  const { current, currentTime } = usePlayer();
  const [status, setStatus] = useState("");

  const timestampSeconds = useMemo(
    () => (current?.id === episodeId && currentTime > 1 ? currentTime : null),
    [current?.id, currentTime, episodeId],
  );

  async function copy(url: string, message: string) {
    try {
      await navigator.clipboard.writeText(url);
      setStatus(message);
    } catch {
      setStatus("Copy failed. You can copy the address from your browser.");
    }
  }

  async function share() {
    const url = shareUrl(episodeId);
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        setStatus("Shared.");
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    await copy(url, "Episode link copied.");
  }

  return (
    <div className="episode-share-actions">
      <button type="button" onClick={() => void share()}>
        Share episode
      </button>
      <button
        type="button"
        onClick={() =>
          void copy(shareUrl(episodeId), "Episode link copied.")
        }
      >
        Copy link
      </button>
      {timestampSeconds !== null ? (
        <button
          type="button"
          onClick={() =>
            void copy(
              shareUrl(episodeId, timestampSeconds),
              "Timestamped link copied.",
            )
          }
        >
          Copy link at {Math.floor(timestampSeconds / 60)}:
          {String(Math.floor(timestampSeconds % 60)).padStart(2, "0")}
        </button>
      ) : null}
      <span className="episode-share-status" aria-live="polite">
        {status}
      </span>
    </div>
  );
}
