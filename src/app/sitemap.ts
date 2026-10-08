import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { siteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();

  const [people, podcasts, episodes] = await Promise.all([
    db.person.findMany({
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    }),
    db.podcast.findMany({
      where: { active: true },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    }),
    db.episode.findMany({
      where: { podcast: { active: true } },
      select: { id: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  return [
    {
      url: base,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${base}/episodes`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${base}/people`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...people.map((person) => ({
      url: `${base}/people/${person.slug}`,
      lastModified: person.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    })),
    ...podcasts.map((podcast) => ({
      url: `${base}/podcasts/${podcast.slug}`,
      lastModified: podcast.updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...episodes.map((episode) => ({
      url: `${base}/episodes/${episode.id}`,
      lastModified: episode.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
  ];
}
