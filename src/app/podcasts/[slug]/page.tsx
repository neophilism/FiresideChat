import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EpisodeCard } from "@/components/episode-card";
import { db } from "@/lib/db";
import { initials, officeLabel } from "@/lib/presentation";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const podcast = await db.podcast.findUnique({
    where: { slug },
    select: { title: true },
  });
  return { title: podcast?.title ?? "Podcast" };
}

export default async function PodcastPage({ params }: Props) {
  const { slug } = await params;
  const podcast = await db.podcast.findUnique({
    where: { slug },
    include: {
      people: { include: { person: true } },
      episodes: {
        orderBy: { publishedAt: "desc" },
        take: 100,
      },
    },
  });

  if (!podcast) notFound();
  const person = podcast.people[0]?.person;
  if (!person) notFound();

  return (
    <div className="detail-page">
      <section className="show-hero">
        <div className="portrait-mark portrait-mark-large">{initials(person.fullName)}</div>
        <div>
          <p className="eyebrow">
            {officeLabel(person.kind, person.isCurrent, person.state)}
          </p>
          <h1>{podcast.title}</h1>
          <p className="show-byline">with {person.fullName}</p>
          <p className="lede compact-lede">
            {podcast.feedDescription ?? podcast.description ?? "Listen to the complete show archive."}
          </p>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="section-label">Archive</p>
            <h2>{podcast.episodes.length} recent episodes</h2>
          </div>
        </div>
        {podcast.episodes.length > 0 ? (
          <div className="episode-list">
            {podcast.episodes.map((episode) => (
              <EpisodeCard
                key={episode.id}
                episode={episode}
                podcast={podcast}
                person={person}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <strong>No episodes have been ingested yet.</strong>
            <span>Run the feed sync and refresh this page.</span>
          </div>
        )}
      </section>
    </div>
  );
}
