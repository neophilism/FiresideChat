import Link from "next/link";
import { PlayButton } from "@/components/player/play-button";
import { IllustratedPortrait } from "@/components/illustrated-portrait";
import { formatDate, officeLabel } from "@/lib/presentation";

type ShowCardProps = {
  podcast: {
    slug: string;
    title: string;
    description: string | null;
    feedDescription: string | null;
    publishingStatus: string;
    people: Array<{
      role: string;
      person: {
        slug: string;
        fullName: string;
        kind: string;
        state: string | null;
        isCurrent: boolean;
      };
    }>;
    episodes: Array<{
      id: string;
      title: string;
      publishedAt: Date;
      audioUrl: string;
      imageUrl: string | null;
    }>;
  };
};

export function ShowCard({ podcast }: ShowCardProps) {
  const relationship = podcast.people[0];
  const person = relationship?.person;
  if (!person) return null;

  return (
    <article className="show-card">
      <div className="show-card-head">
        <Link className="show-portrait-link" href={`/people/${person.slug}`} aria-label={person.fullName}>
          <IllustratedPortrait slug={person.slug} name={person.fullName} />
        </Link>
        <div>
          <div className="show-office">
            {officeLabel(person.kind, person.isCurrent, person.state)}
          </div>
          <h3>
            <Link href={`/podcasts/${podcast.slug}`}>{podcast.title}</Link>
          </h3>
          <Link className="show-person" href={`/people/${person.slug}`}>
            {person.fullName}
          </Link>
        </div>
      </div>

      <p className="show-description">
        {podcast.feedDescription ?? podcast.description ?? "Public-service conversations, directly from the source."}
      </p>

      <div className="mini-episodes">
        {podcast.episodes.length > 0 ? (
          podcast.episodes.map((episode) => (
            <div className="mini-episode" key={episode.id}>
              <PlayButton
                compact
                episode={{
                  id: episode.id,
                  title: episode.title,
                  audioUrl: episode.audioUrl,
                  podcastTitle: podcast.title,
                  podcastSlug: podcast.slug,
                  personName: person.fullName,
                  imageUrl: episode.imageUrl,
                }}
              />
              <div>
                <strong>{episode.title}</strong>
                <span>{formatDate(episode.publishedAt)}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="empty-note">Episodes will appear after the next feed sync.</p>
        )}
      </div>

      <Link className="text-link" href={`/podcasts/${podcast.slug}`}>
        View all episodes <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}
