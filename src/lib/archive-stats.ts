import { db } from "@/lib/db";

export type ArchiveStats = {
  showCount: number;
  episodeCount: number;
  totalHours: number;
};

export async function getArchiveStats(): Promise<ArchiveStats> {
  const [showCount, episodeCount, episodeDuration] = await Promise.all([
    db.podcast.count({ where: { active: true } }),
    db.episode.count({ where: { podcast: { active: true } } }),
    db.episode.aggregate({
      where: { podcast: { active: true } },
      _sum: { durationSeconds: true },
    }),
  ]);

  return {
    showCount,
    episodeCount,
    totalHours: Math.floor(
      (episodeDuration._sum.durationSeconds ?? 0) / 3600,
    ),
  };
}
