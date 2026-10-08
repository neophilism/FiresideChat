"use client";

import { useCallback, useEffect, useState } from "react";
import type { ArchiveStats } from "@/lib/archive-stats";

const REFRESH_INTERVAL_MS = 30_000;

export function LiveArchiveStats({
  initialStats,
}: {
  initialStats: ArchiveStats;
}) {
  const [stats, setStats] = useState(initialStats);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/archive-stats", { cache: "no-store" });
      if (!response.ok) return;
      const nextStats = (await response.json()) as ArchiveStats;
      setStats(nextStats);
    } catch {
      // Keep the last known values if a background refresh fails.
    }
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      void refresh();
    }, REFRESH_INTERVAL_MS);

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") void refresh();
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [refresh]);

  return (
    <div className="hero-stats" aria-label="Archive statistics" aria-live="polite">
      <div>
        <strong>{stats.showCount.toLocaleString()}</strong>
        <span>Voices of Congress</span>
      </div>
      <div>
        <strong>{stats.episodeCount.toLocaleString()}</strong>
        <span>Episodes</span>
      </div>
      <div>
        <strong>{stats.totalHours.toLocaleString()}</strong>
        <span>Hours Straight From the Source</span>
      </div>
    </div>
  );
}
