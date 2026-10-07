import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EpisodeCard } from "@/components/episode-card";
import { IllustratedPortrait } from "@/components/illustrated-portrait";
import { db } from "@/lib/db";
import { officeLabel } from "@/lib/presentation";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const person = await db.person.findUnique({
    where: { slug },
    select: { fullName: true },
  });
  return { title: person?.fullName ?? "Public servant" };
}

export default async function PersonPage({ params }: Props) {
  const { slug } = await params;
  const person = await db.person.findUnique({
    where: { slug },
    include: {
      podcasts: {
        include: {
          podcast: {
            include: {
              episodes: {
                orderBy: { publishedAt: "desc" },
                take: 30,
              },
            },
          },
        },
      },
    },
  });

  if (!person) notFound();

  return (
    <div className="detail-page">
      <section className="person-hero">
        <IllustratedPortrait
          slug={person.slug}
          name={person.fullName}
          className="illustrated-portrait-hero"
          large
        />
        <div>
          <p className="eyebrow">
            {officeLabel(person.kind, person.isCurrent, person.state)}
          </p>
          <h1>{person.fullName}</h1>
          <p className="lede compact-lede">
            Hear {person.fullName} directly, in full-length conversations rather
            than clips or commentary.
          </p>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="section-label">Shows</p>
            <h2>Podcast archive</h2>
          </div>
        </div>
        <div className="person-shows">
          {person.podcasts.map(({ podcast, role }) => (
            <div className="person-show" key={podcast.id}>
              <div>
                <span className="role-badge">{role.replaceAll("_", " ")}</span>
                <h3>
                  <Link href={`/podcasts/${podcast.slug}`}>{podcast.title}</Link>
                </h3>
                <p>{podcast.feedDescription ?? podcast.description}</p>
              </div>
              <Link className="text-link" href={`/podcasts/${podcast.slug}`}>
                Open show →
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="section-label">Listen</p>
            <h2>Recent episodes</h2>
          </div>
        </div>
        <div className="episode-list">
          {person.podcasts.flatMap(({ podcast }) =>
            podcast.episodes.map((episode) => (
              <EpisodeCard
                key={episode.id}
                episode={episode}
                podcast={podcast}
                person={person}
              />
            )),
          )}
        </div>
      </section>
    </div>
  );
}
