export type HomepageSide = "left" | "right";

type HomepagePerson = {
  id: string;
  slug: string;
  party: string | null;
};

type HomepageCandidate = {
  id: string;
  publishedAt: Date;
  podcast: {
    id: string;
    people: readonly {
      person: HomepagePerson;
    }[];
  };
};

export type HomepageEpisodeSelection<T extends HomepageCandidate> = {
  episode: T;
  person: HomepagePerson;
  featured: boolean;
  side: HomepageSide | null;
};

const homepageSideOverrides: Record<string, HomepageSide> = {
  // Historical party registration is not always the best proxy for the
  // ideological contrast the homepage feature is intended to provide.
  "joe-walsh": "left",
};

export function homepageSideForPerson(
  person: Pick<HomepagePerson, "slug" | "party">,
): HomepageSide | null {
  const override = homepageSideOverrides[person.slug];
  if (override) return override;

  if (person.party === "Democratic" || person.party === "Democrat") {
    return "left";
  }

  if (person.party === "Republican") {
    return "right";
  }

  return null;
}

function personForSide<T extends HomepageCandidate>(
  episode: T,
  side: HomepageSide,
): HomepagePerson | null {
  return (
    episode.podcast.people.find(
      ({ person }) => homepageSideForPerson(person) === side,
    )?.person ?? null
  );
}

export function selectHomepageEpisodes<T extends HomepageCandidate>(
  candidates: readonly T[],
  limit = 6,
): HomepageEpisodeSelection<T>[] {
  const ordered = [...candidates].sort(
    (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime(),
  );
  const selected: HomepageEpisodeSelection<T>[] = [];
  const usedPodcastIds = new Set<string>();
  const usedPersonIds = new Set<string>();

  const canUse = (episode: T) => {
    if (usedPodcastIds.has(episode.podcast.id)) return false;
    return !episode.podcast.people.some(({ person }) =>
      usedPersonIds.has(person.id),
    );
  };

  const add = (
    episode: T,
    person: HomepagePerson,
    featured: boolean,
    side: HomepageSide | null,
  ) => {
    selected.push({ episode, person, featured, side });
    usedPodcastIds.add(episode.podcast.id);
    for (const relation of episode.podcast.people) {
      usedPersonIds.add(relation.person.id);
    }
  };

  for (const side of ["left", "right"] as const) {
    const match = ordered.find(
      (episode) => canUse(episode) && personForSide(episode, side),
    );
    if (!match) continue;

    const person = personForSide(match, side);
    if (person) add(match, person, true, side);
  }

  for (const episode of ordered) {
    if (selected.length >= limit) break;
    if (!canUse(episode)) continue;

    const person = episode.podcast.people[0]?.person;
    if (!person) continue;
    add(episode, person, false, homepageSideForPerson(person));
  }

  return selected;
}
