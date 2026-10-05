import Link from "next/link";
import { EpisodeCard } from "@/components/episode-card";
import { ShowCard } from "@/components/show-card";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [latestEpisodes, podcasts, peopleCount, episodeCount] = await Promise.all([
    db.episode.findMany({
      orderBy: { publishedAt: "desc" },
      take: 6,
      include: {
        podcast: {
          include: {
            people: { include: { person: true } },
          },
        },
      },
    }),
    db.podcast.findMany({
      where: { active: true },
      orderBy: [{ lastEpisodeAt: "desc" }, { title: "asc" }],
      include: {
        people: { include: { person: true } },
        episodes: {
          orderBy: { publishedAt: "desc" },
          take: 3,
        },
      },
    }),
    db.person.count(),
    db.episode.count(),
  ]);

  return (
    <>
      <section className="home-hero">
        <div className="hero-copy">
          <p className="eyebrow">The public-service podcast archive</p>
          <h1>Hear them yourself.</h1>
          <p className="lede">
            Full conversations with current and former members of Congress and
            presidents — collected in one place, without commentary in between.
          </p>
          <form className="hero-search" action="/search">
            <input
              name="q"
              aria-label="Search Fireside Chat"
              placeholder="Search a person, show, or episode topic"
            />
            <button type="submit">Search archive</button>
          </form>
          <div className="hero-stats" aria-label="Archive statistics">
            <div>
              <strong>{peopleCount}</strong>
              <span>public servants</span>
            </div>
            <div>
              <strong>{podcasts.length}</strong>
              <span>verified shows</span>
            </div>
            <div>
              <strong>{episodeCount.toLocaleString()}</strong>
              <span>episodes</span>
            </div>
          </div>
        </div>

        <aside className="civic-note">
          <span className="civic-seal" aria-hidden="true">FC</span>
          <p>
            <strong>Direct source.</strong> Fireside Chat preserves the complete
            programs politicians choose to make, so you can hear what they
            actually said in context.
          </p>
        </aside>
      </section>

      <section className="section-block latest-section">
        <div className="section-heading">
          <div>
            <p className="section-label">Latest</p>
            <h2>New across the archive</h2>
          </div>
          <Link className="text-link" href="/search?q=">
            Search everything →
          </Link>
        </div>

        {latestEpisodes.length > 0 ? (
          <div className="latest-grid">
            {latestEpisodes.map((episode, index) => {
              const person = episode.podcast.people[0]?.person;
              if (!person) return null;
              return (
                <EpisodeCard
                  key={episode.id}
                  featured={index < 2}
                  episode={episode}
                  podcast={episode.podcast}
                  person={person}
                />
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <strong>The archive is ready for its first sync.</strong>
            <span>Run <code>npm run ingest:feeds</code> and reload this page.</span>
          </div>
        )}
      </section>

      <section className="section-block" id="shows">
        <div className="section-heading">
          <div>
            <p className="section-label">Directory</p>
            <h2>Shows from across public life</h2>
          </div>
          <p className="section-explainer">
            Current and former officeholders are presented under the same
            inclusion rule.
          </p>
        </div>

        <div className="show-grid">
          {podcasts.map((podcast) => (
            <ShowCard key={podcast.id} podcast={podcast} />
          ))}
        </div>
      </section>

      <section className="principle-band">
        <p className="section-label">One simple principle</p>
        <h2>Less interpretation. More primary source.</h2>
        <p>
          Fireside Chat is independent and is not affiliated with or endorsed
          by the public officials whose publicly available podcasts it indexes.
        </p>
      </section>
    </>
  );
}
