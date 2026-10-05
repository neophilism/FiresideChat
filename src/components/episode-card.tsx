import Link from "next/link";
import { PlayButton } from "@/components/player/play-button";
import { formatDate, formatDuration } from "@/lib/presentation";

type EpisodeCardProps = {
  episode: {
    id: string;
    title: string;
    description: string | null;
    publishedAt: Date;
    durationSeconds: number | null;
    audioUrl: string;
    imageUrl: string | null;
  };
  podcast: {
    title: string;
    slug: string;
  };
  person: {
    fullName: string;
    slug: string;
  };
  featured?: boolean;
};

export function EpisodeCard({
  episode,
  podcast,
  person,
  featured = false,
}: EpisodeCardProps) {
  const duration = formatDuration(episode.durationSeconds);

  return (
    <article className={featured ? "episode-card episode-card-featured" : "episode-card"}>
      <div className="episode-play">
        <PlayButton
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
      </div>
      <div className="episode-content">
        <div className="episode-kicker">
          <Link href={`/people/${person.slug}`}>{person.fullName}</Link>
          <span>·</span>
          <Link href={`/podcasts/${podcast.slug}`}>{podcast.title}</Link>
        </div>
        <h3>{episode.title}</h3>
        {featured && episode.description ? (
          <p className="episode-description">{episode.description}</p>
        ) : null}
        <div className="episode-meta">
          <time dateTime={episode.publishedAt.toISOString()}>
            {formatDate(episode.publishedAt)}
          </time>
          {duration ? <span>{duration}</span> : null}
        </div>
      </div>
    </article>
  );
}
