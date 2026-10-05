import Link from "next/link";
import { db } from "@/lib/db";
import { initials, officeLabel } from "@/lib/presentation";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "People",
  description:
    "Browse current and former members of Congress, presidents, and D.C. shadow senators with podcasts in the Fireside Chat archive.",
};

export default async function PeoplePage() {
  const people = await db.person.findMany({
    orderBy: [{ isCurrent: "desc" }, { fullName: "asc" }],
    include: {
      podcasts: {
        include: {
          podcast: {
            select: {
              id: true,
              slug: true,
              title: true,
              active: true,
            },
          },
        },
      },
    },
  });

  return (
    <div className="detail-page">
      <section className="search-hero">
        <p className="eyebrow">People</p>
        <h1>The voices in the archive.</h1>
        <p className="lede compact-lede">
          Browse public servants with qualifying programs, then listen to their
          complete show archives without leaving Fireside Chat.
        </p>
      </section>

      <section className="section-block">
        <div className="people-directory">
          {people.map((person) => {
            const activeShows = person.podcasts.filter(
              ({ podcast }) => podcast.active,
            );
            return (
              <article className="directory-person" key={person.id}>
                <Link
                  className="portrait-mark portrait-mark-directory"
                  href={`/people/${person.slug}`}
                  aria-label={person.fullName}
                >
                  {initials(person.fullName)}
                </Link>
                <div className="directory-person-copy">
                  <span className="show-office">
                    {officeLabel(person.kind, person.isCurrent, person.state)}
                  </span>
                  <h2>
                    <Link href={`/people/${person.slug}`}>
                      {person.fullName}
                    </Link>
                  </h2>
                  <span className="directory-party">
                    {person.party ?? "Independent / unspecified"} ·{" "}
                    {activeShows.length} {activeShows.length === 1 ? "show" : "shows"}
                  </span>
                  <div className="directory-show-links">
                    {activeShows.map(({ podcast }) => (
                      <Link href={`/podcasts/${podcast.slug}`} key={podcast.id}>
                        {podcast.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
