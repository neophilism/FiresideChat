import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EpisodeCard } from "@/components/episode-card";
import { db } from "@/lib/db";
import { initials, officeLabel } from "@/lib/presentation";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const podcast = await db.podcast.findUnique({
    where: { slug },
    select: { title: true },
  });
  return { title: podcast?.title ?? "Podcast" };
}

export default async function PodcastPage({ params, searchParams }: Props) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const requestedPage = Number.parseInt(query.page ?? "1", 10);
  const pageNumber =
    Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const podcast = await db.podcast.findUnique({
    where: { slug },
    include: {
      people: { include: { person: true } },
      _count: { select: { episodes: true } },
    },
  });

  if (!podcast) notFound();
  const person = podcast.people[0]?.person;
  if (!person) notFound();

  const totalPages = Math.max(1, Math.ceil(podcast._count.episodes / PAGE_SIZE));
  if (pageNumber > totalPages && podcast._count.episodes > 0) notFound();

  const episodes = await db.episode.findMany({
    where: { podcastId: podcast.id },
    orderBy: { publishedAt: "desc" },
    skip: (pageNumber - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

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
            <h2>
              {podcast._count.episodes.toLocaleString()}{" "}
              {podcast._count.episodes === 1 ? "episode" : "episodes"}
            </h2>
          </div>
          {totalPages > 1 ? (
            <span className="page-count">
              Page {pageNumber} of {totalPages}
            </span>
          ) : null}
        </div>

        {episodes.length > 0 ? (
          <>
            <div className="episode-list">
              {episodes.map((episode) => (
                <EpisodeCard
                  key={episode.id}
                  episode={episode}
                  podcast={podcast}
                  person={person}
                />
              ))}
            </div>
            {totalPages > 1 ? (
              <nav className="pagination" aria-label="Episode pages">
                {pageNumber > 1 ? (
                  <Link href={`/podcasts/${podcast.slug}?page=${pageNumber - 1}`}>
                    ← Newer episodes
                  </Link>
                ) : (
                  <span />
                )}
                {pageNumber < totalPages ? (
                  <Link href={`/podcasts/${podcast.slug}?page=${pageNumber + 1}`}>
                    Older episodes →
                  </Link>
                ) : null}
              </nav>
            ) : null}
          </>
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
