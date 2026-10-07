"use client";

import Image from "next/image";
import Link from "next/link";
import { usePlayer } from "./player-provider";

function clock(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const whole = Math.floor(seconds);
  const hours = Math.floor(whole / 3600);
  const minutes = Math.floor((whole % 3600) / 60);
  const secs = whole % 60;
  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
    : `${minutes}:${String(secs).padStart(2, "0")}`;
}

export function AudioPlayer() {
  const {
    current,
    playing,
    currentTime,
    duration,
    volume,
    playbackRate,
    toggle,
    seek,
    skip,
    setVolume,
    setPlaybackRate,
  } = usePlayer();

  if (!current) return null;

  return (
    <aside className="audio-player" aria-label="Audio player">
      <div className="player-inner">
        {current.imageUrl?.startsWith("/portraits/") ? (
          <Image
            className="player-artwork"
            src={current.imageUrl}
            alt=""
            width={54}
            height={54}
          />
        ) : null}

        <button
          className="player-main-button"
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause" : "Play"}
        >
          <span aria-hidden="true">{playing ? "Ⅱ" : "▶"}</span>
        </button>

        <div className="player-copy">
          <strong>{current.title}</strong>
          <span>
            {current.personName} ·{" "}
            <Link href={`/podcasts/${current.podcastSlug}`}>
              {current.podcastTitle}
            </Link>
          </span>
        </div>

        <button
          className="player-skip"
          type="button"
          onClick={() => skip(-15)}
          aria-label="Back 15 seconds"
        >
          −15
        </button>

        <div className="player-progress">
          <span>{clock(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={1}
            value={Math.min(currentTime, duration || 0)}
            onChange={(event) => seek(Number(event.target.value))}
            aria-label="Episode position"
          />
          <span>{clock(duration)}</span>
        </div>

        <button
          className="player-skip"
          type="button"
          onClick={() => skip(15)}
          aria-label="Forward 15 seconds"
        >
          +15
        </button>

        <label className="player-volume">
          <span className="sr-only">Volume</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(event) => setVolume(Number(event.target.value))}
          />
        </label>

        <select
          className="player-speed"
          value={playbackRate}
          onChange={(event) => setPlaybackRate(Number(event.target.value))}
          aria-label="Playback speed"
        >
          {[0.75, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
            <option key={rate} value={rate}>
              {rate}×
            </option>
          ))}
        </select>
      </div>
    </aside>
  );
}
