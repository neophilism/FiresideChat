import Link from "next/link";
import { EpisodeCard } from "@/components/episode-card";
import { db } from "@/lib/db";
import { initials, officeLabel } from "@/lib/presentation";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: Props) {
  const { q: rawQuery } = await searchParams;
  const q = rawQuery?.trim() ?? "";

  const [people, podcasts, episodes] =
    q.length < 2
      ? [[], [], []]
      : await Promise.all([
          db.person.findMany({
            where: { fullName: { contains: q, mode: "insensitive" } },
            orderBy: { fullName: "asc" },
            take: 20,
          }),
          db.podcast.findMany({
            where: {
              OR: [
                { title: { contains: q, mode: "insensitive" } },
                { feedDescription: { contains: q, mode: "insensitive" } },
              ],
            },
            include: { people: { include: { person: true } } },
            orderBy: { title: "asc" },
            take: 20,
          }),
          db.episode.findMany({
            where: {
              OR: [
                { title: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
              ],
            },
            include: {
              podcast: { include: { people: { include: { person: true } } } },
            },
            orderBy: { publishedAt: "desc" },
            take: 40,
          }),
        ]);

  return (
    <div className="detail-page">
      <section className="search-hero">
        <p className="eyebrow">Search the archive</p>
        <h1>Find the conversation.</h1>
        <form className="hero-search" action="/search">
          <input
            name="q"
            defaultValue={q}
            aria-label="Search"
            placeholder="Search people, shows, or episode topics"
          />
          <button type="submit">Search</button>
        </form>
      </section>

      {q.length < 2 ? (
        <div className="empty-state">
          <strong>Enter at least two characters.</strong>
          <span>Search across public servants, shows, and episode metadata.</span>
        </div>
      ) : (
        <>
          <section className="section-block">
            <div className="section-heading">
              <div>
                <p className="section-label">People</p>
                <h2>{people.length} matches</h2>
              </div>
            </div>
            <div className="people-results">
              {people.map((person) => (
                <Link className="person-result" href={`/people/${person.slug}`} key={person.id}>
                  <span className="portrait-mark">{initials(person.fullName)}</span>
                  <span>
                    <strong>{person.fullName}</strong>
                    <small>{officeLabel(person.kind, person.isCurrent, person.state)}</small>
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section className="section-block">
            <div className="section-heading">
              <div>
                <p className="section-label">Shows</p>
                <h2>{podcasts.length} matches</h2>
              </div>
            </div>
            <div className="search-show-results">
              {podcasts.map((podcast) => {
                const person = podcast.people[0]?.person;
                return (
                  <Link className="search-show-result" href={`/podcasts/${podcast.slug}`} key={podcast.id}>
                    <strong>{podcast.title}</strong>
                    <span>{person?.fullName ?? "Public servant"}</span>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="section-block">
            <div className="section-heading">
              <div>
                <p className="section-label">Episodes</p>
                <h2>{episodes.length} matches</h2>
              </div>
            </div>
            <div className="episode-list">
              {episodes.map((episode) => {
                const person = episode.podcast.people[0]?.person;
                if (!person) return null;
                return (
                  <EpisodeCard
                    key={episode.id}
                    episode={episode}
                    podcast={episode.podcast}
                    person={person}
                  />
                );
              })}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
