"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { PlayerEpisode } from "./player-types";

type PlayerContextValue = {
  current: PlayerEpisode | null;
  playing: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  playEpisode: (episode: PlayerEpisode) => void;
  playEpisodeAt: (episode: PlayerEpisode, seconds: number) => void;
  toggle: () => void;
  seek: (seconds: number) => void;
  skip: (seconds: number) => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [current, setCurrent] = useState<PlayerEpisode | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [playbackRate, setPlaybackRateState] = useState(1);

  const playEpisode = useCallback(
    (episode: PlayerEpisode) => {
      const audio = audioRef.current;
      if (!audio) return;

      if (current?.id !== episode.id) {
        setCurrent(episode);
        audio.src = episode.audioUrl;
        audio.currentTime = 0;
        setCurrentTime(0);
        setDuration(0);
      }

      void audio.play().catch(() => setPlaying(false));
    },
    [current],
  );

  const playEpisodeAt = useCallback(
    (episode: PlayerEpisode, seconds: number) => {
      const audio = audioRef.current;
      if (!audio || !Number.isFinite(seconds)) return;

      const target = Math.max(0, seconds);
      const seekAndPlay = () => {
        const bounded = Number.isFinite(audio.duration) && audio.duration > 0
          ? Math.min(target, audio.duration)
          : target;
        audio.currentTime = bounded;
        setCurrentTime(bounded);
        void audio.play().catch(() => setPlaying(false));
      };

      if (current?.id !== episode.id) {
        setCurrent(episode);
        audio.src = episode.audioUrl;
        setCurrentTime(0);
        setDuration(0);
        audio.addEventListener("loadedmetadata", seekAndPlay, { once: true });
        audio.load();
        return;
      }

      seekAndPlay();
    },
    [current],
  );

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !current) return;
    if (audio.paused) {
      void audio.play().catch(() => setPlaying(false));
    } else {
      audio.pause();
    }
  }, [current]);

  const seek = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(seconds)) return;
    audio.currentTime = Math.max(0, Math.min(seconds, audio.duration || seconds));
  }, []);

  const skip = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const target = audio.currentTime + seconds;
    audio.currentTime = Math.max(0, Math.min(target, audio.duration || target));
  }, []);

  const setVolume = useCallback((nextVolume: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const normalized = Math.max(0, Math.min(1, nextVolume));
    audio.volume = normalized;
    setVolumeState(normalized);
  }, []);

  const setPlaybackRate = useCallback((rate: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = rate;
    setPlaybackRateState(rate);
  }, []);

  useEffect(() => {
    if (!current || !("mediaSession" in navigator)) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: current.title,
      artist: current.personName,
      album: current.podcastTitle,
      artwork: current.imageUrl
        ? [{ src: current.imageUrl, sizes: "512x512" }]
        : undefined,
    });

    navigator.mediaSession.setActionHandler("play", () => {
      void audioRef.current?.play();
    });
    navigator.mediaSession.setActionHandler("pause", () => {
      audioRef.current?.pause();
    });
    navigator.mediaSession.setActionHandler("seekbackward", (details) => {
      skip(-(details.seekOffset ?? 15));
    });
    navigator.mediaSession.setActionHandler("seekforward", (details) => {
      skip(details.seekOffset ?? 15);
    });
    navigator.mediaSession.setActionHandler("seekto", (details) => {
      if (typeof details.seekTime === "number") seek(details.seekTime);
    });

    return () => {
      navigator.mediaSession.setActionHandler("play", null);
      navigator.mediaSession.setActionHandler("pause", null);
      navigator.mediaSession.setActionHandler("seekbackward", null);
      navigator.mediaSession.setActionHandler("seekforward", null);
      navigator.mediaSession.setActionHandler("seekto", null);
    };
  }, [current, seek, skip]);

  const value = useMemo(
    () => ({
      current,
      playing,
      currentTime,
      duration,
      volume,
      playbackRate,
      playEpisode,
      playEpisodeAt,
      toggle,
      seek,
      skip,
      setVolume,
      setPlaybackRate,
    }),
    [
      current,
      playing,
      currentTime,
      duration,
      volume,
      playbackRate,
      playEpisode,
      playEpisodeAt,
      toggle,
      seek,
      skip,
      setVolume,
      setPlaybackRate,
    ],
  );

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onDurationChange={(event) =>
          setDuration(
            Number.isFinite(event.currentTarget.duration)
              ? event.currentTarget.duration
              : 0,
          )
        }
        onEnded={() => setPlaying(false)}
      />
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used inside PlayerProvider");
  }
  return context;
}
