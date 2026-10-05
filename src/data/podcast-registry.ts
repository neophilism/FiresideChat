export type RegistryPerson = {
  slug: string;
  fullName: string;
  kind: "HOUSE" | "SENATE" | "PRESIDENT";
  state?: string;
  party?: string;
  isCurrent: boolean;
};

export type RegistryPodcast = {
  slug: string;
  title: string;
  rssUrl: string;
  websiteUrl?: string;
  active: boolean;
  publishingStatus: "ACTIVE" | "INACTIVE" | "UNKNOWN";
  verificationUrl: string;
  verifiedAt: string;
  verificationNote: string;
  people: Array<{
    personSlug: string;
    role: "HOST" | "COHOST" | "OFFICIAL_PRODUCER";
  }>;
};

export type RegistryCandidate = {
  person: string;
  show: string;
  sourceUrl: string;
  reason: string;
};

export const podcastRegistry: {
  people: RegistryPerson[];
  podcasts: RegistryPodcast[];
  candidates: RegistryCandidate[];
} = {
  people: [
    {
      slug: "ted-cruz",
      fullName: "Ted Cruz",
      kind: "SENATE",
      state: "TX",
      party: "Republican",
      isCurrent: true,
    },
    {
      slug: "dan-crenshaw",
      fullName: "Dan Crenshaw",
      kind: "HOUSE",
      state: "TX",
      party: "Republican",
      isCurrent: true,
    },
    {
      slug: "jared-huffman",
      fullName: "Jared Huffman",
      kind: "HOUSE",
      state: "CA",
      party: "Democratic",
      isCurrent: true,
    },
    {
      slug: "guy-reschenthaler",
      fullName: "Guy Reschenthaler",
      kind: "HOUSE",
      state: "PA",
      party: "Republican",
      isCurrent: true,
    },
    {
      slug: "al-franken",
      fullName: "Al Franken",
      kind: "SENATE",
      state: "MN",
      party: "Democratic",
      isCurrent: false,
    },
    {
      slug: "trey-gowdy",
      fullName: "Trey Gowdy",
      kind: "HOUSE",
      state: "SC",
      party: "Republican",
      isCurrent: false,
    },
    {
      slug: "jason-chaffetz",
      fullName: "Jason Chaffetz",
      kind: "HOUSE",
      state: "UT",
      party: "Republican",
      isCurrent: false,
    },
    {
      slug: "newt-gingrich",
      fullName: "Newt Gingrich",
      kind: "HOUSE",
      state: "GA",
      party: "Republican",
      isCurrent: false,
    },
    {
      slug: "doug-collins",
      fullName: "Doug Collins",
      kind: "HOUSE",
      state: "GA",
      party: "Republican",
      isCurrent: false,
    },
    {
      slug: "joe-walsh",
      fullName: "Joe Walsh",
      kind: "HOUSE",
      state: "IL",
      party: "Republican",
      isCurrent: false,
    },
    {
      slug: "george-lemieux",
      fullName: "George LeMieux",
      kind: "SENATE",
      state: "FL",
      party: "Republican",
      isCurrent: false,
    },
    {
      slug: "anthony-weiner",
      fullName: "Anthony Weiner",
      kind: "HOUSE",
      state: "NY",
      party: "Democratic",
      isCurrent: false,
    },
  ],
  podcasts: [
    {
      slug: "verdict-with-ted-cruz",
      title: "Verdict with Ted Cruz",
      rssUrl:
        "https://www.omnycontent.com/d/playlist/e73c998e-6e60-432f-8610-ae210140c5b1/2bee9419-43de-46ce-8996-af2a01167517/84cf551f-a33b-41d8-b112-af2a01167541/podcast.rss",
      websiteUrl: "https://omny.fm/shows/verdict-with-ted-cruz-1",
      active: true,
      publishingStatus: "ACTIVE",
      verificationUrl: "https://omny.fm/shows/verdict-with-ted-cruz-1",
      verifiedAt: "2026-10-05",
      verificationNote:
        "Publisher page identifies Senator Ted Cruz as the show's host alongside Ben Ferguson.",
      people: [{ personSlug: "ted-cruz", role: "HOST" }],
    },
    {
      slug: "hold-these-truths-with-dan-crenshaw",
      title: "Hold These Truths with Dan Crenshaw",
      rssUrl: "https://holdthesetruthswithdancrenshaw.libsyn.com/rss",
      websiteUrl: "https://holdthesetruthswithdancrenshaw.libsyn.com/",
      active: true,
      publishingStatus: "ACTIVE",
      verificationUrl: "https://holdthesetruthswithdancrenshaw.libsyn.com/",
      verifiedAt: "2026-10-05",
      verificationNote:
        "Publisher page identifies Congressman Dan Crenshaw as the show's host.",
      people: [{ personSlug: "dan-crenshaw", role: "HOST" }],
    },
    {
      slug: "off-the-cuff-with-jared-huffman",
      title: "Off the Cuff with Jared Huffman",
      rssUrl:
        "https://feeds.soundcloud.com/users/soundcloud%3Ausers%3A268948247/sounds.rss",
      active: true,
      publishingStatus: "UNKNOWN",
      verificationUrl:
        "https://feeds.soundcloud.com/users/soundcloud%3Ausers%3A268948247/sounds.rss",
      verifiedAt: "2026-10-05",
      verificationNote:
        "Feed metadata identifies the show as brought to listeners by Congressman Jared Huffman.",
      people: [{ personSlug: "jared-huffman", role: "HOST" }],
    },
    {
      slug: "get-going-with-guy-reschenthaler",
      title: "Get Going with Guy Reschenthaler",
      rssUrl: "https://anchor.fm/s/57106164/podcast/rss",
      websiteUrl: "https://podcasters.spotify.com/pod/show/guyreschenthaler",
      active: true,
      publishingStatus: "UNKNOWN",
      verificationUrl: "https://podcasters.spotify.com/pod/show/guyreschenthaler",
      verifiedAt: "2026-10-05",
      verificationNote:
        "Show metadata identifies Congressman Guy Reschenthaler as the speaker and host.",
      people: [{ personSlug: "guy-reschenthaler", role: "HOST" }],
    },
    {
      slug: "the-al-franken-podcast",
      title: "The Al Franken Podcast",
      rssUrl: "https://audioboom.com/channels/5155312.rss",
      websiteUrl: "https://www.alfranken.com/the-al-franken-podcast",
      active: true,
      publishingStatus: "INACTIVE",
      verificationUrl: "https://www.alfranken.com/the-al-franken-podcast",
      verifiedAt: "2026-10-05",
      verificationNote:
        "Al Franken's official site identifies the show as his podcast; the feed is retained as a historical archive.",
      people: [{ personSlug: "al-franken", role: "HOST" }],
    },
    {
      slug: "the-trey-gowdy-podcast",
      title: "The Trey Gowdy Podcast",
      rssUrl: "https://feeds.megaphone.fm/FOXM9459947004",
      websiteUrl: "https://radio.foxnews.com/podcast/trey-gowdy",
      active: true,
      publishingStatus: "ACTIVE",
      verificationUrl: "https://radio.foxnews.com/podcast/trey-gowdy",
      verifiedAt: "2026-10-05",
      verificationNote:
        "Fox News Radio identifies former Congressman Trey Gowdy as the show's host.",
      people: [{ personSlug: "trey-gowdy", role: "HOST" }],
    },
    {
      slug: "jason-in-the-house",
      title: "Jason in the House",
      rssUrl: "https://feeds.megaphone.fm/FOXM9334533161",
      active: true,
      publishingStatus: "UNKNOWN",
      verificationUrl: "https://podnews.net/podcast/i7zo1",
      verifiedAt: "2026-10-05",
      verificationNote:
        "Podcast metadata identifies former Congressman Jason Chaffetz as the show's host.",
      people: [{ personSlug: "jason-chaffetz", role: "HOST" }],
    },
    {
      slug: "newts-world",
      title: "Newt's World",
      rssUrl:
        "https://www.omnycontent.com/d/playlist/e73c998e-6e60-432f-8610-ae210140c5b1/0b197502-72fe-4046-b7b3-ae27016ec147/8b19f8a8-4942-4dd1-b38d-ae27016ec151/podcast.rss",
      websiteUrl: "https://omny.fm/shows/newts-world",
      active: true,
      publishingStatus: "ACTIVE",
      verificationUrl: "https://omny.fm/shows/newts-world",
      verifiedAt: "2026-10-05",
      verificationNote:
        "Publisher page identifies former Speaker of the House Newt Gingrich as the show's host.",
      people: [{ personSlug: "newt-gingrich", role: "HOST" }],
    },
    {
      slug: "the-doug-collins-podcast",
      title: "The Doug Collins Podcast",
      rssUrl: "https://feed.podbean.com/thedougcollinspodcast/feed.xml",
      websiteUrl: "https://thedougcollinspodcast.podbean.com/",
      active: true,
      publishingStatus: "UNKNOWN",
      verificationUrl: "https://thedougcollinspodcast.podbean.com/",
      verifiedAt: "2026-10-05",
      verificationNote:
        "Publisher page identifies Doug Collins and notes his service as a former Congressman.",
      people: [{ personSlug: "doug-collins", role: "HOST" }],
    },
    {
      slug: "the-social-contract-with-joe-walsh",
      title: "The Social Contract with Joe Walsh",
      rssUrl: "https://feeds.acast.com/public/shows/66c247fb844d445153718f68",
      active: true,
      publishingStatus: "UNKNOWN",
      verificationUrl: "https://feeds.acast.com/public/shows/66c247fb844d445153718f68",
      verifiedAt: "2026-10-05",
      verificationNote:
        "Feed metadata identifies former Congressman Joe Walsh as the show's host.",
      people: [{ personSlug: "joe-walsh", role: "HOST" }],
    },
    {
      slug: "the-quill-podcast",
      title: "The Quill Podcast",
      rssUrl: "https://anchor.fm/s/20e77e74/podcast/rss",
      websiteUrl: "https://lemieuxcenter.org/",
      active: true,
      publishingStatus: "UNKNOWN",
      verificationUrl: "https://lemieuxcenter.org/",
      verifiedAt: "2026-10-05",
      verificationNote:
        "Show metadata identifies former U.S. Senator George LeMieux as a co-host with Dr. Robert Lloyd.",
      people: [{ personSlug: "george-lemieux", role: "COHOST" }],
    },
    {
      slug: "the-middle-with-anthony-weiner",
      title: "The Middle with Anthony Weiner",
      rssUrl: "https://feeds.megaphone.fm/WABC4595419758",
      active: true,
      publishingStatus: "UNKNOWN",
      verificationUrl: "https://podnews.net/podcast/iaimr",
      verifiedAt: "2026-10-05",
      verificationNote:
        "Podcast metadata identifies former Congressman Anthony Weiner as the show's host.",
      people: [{ personSlug: "anthony-weiner", role: "HOST" }],
    },
  ],
  candidates: [
    {
      person: "Bernie Sanders",
      show: "The Bernie Sanders Show",
      sourceUrl: "https://podcasts.apple.com/us/podcast/the-bernie-sanders-show/id1223800705",
      reason:
        "Host relationship is verified, but the canonical RSS feed still needs to be recovered before ingestion.",
    },
    {
      person: "Barack Obama",
      show: "Renegades: Born in the USA",
      sourceUrl: "https://rss.art19.com/renegades-born-in-the-usa",
      reason:
        "The host relationship and feed are known, but the public feed currently lacks a usable episode archive.",
    },
    {
      person: "Lisa Murkowski",
      show: "The Icebreaker",
      sourceUrl:
        "https://www.murkowski.senate.gov/press/release/murkowski-launches-the-icebreaker-podcast",
      reason:
        "The official Senate announcement verifies the show, but a stable canonical podcast RSS feed still needs to be identified.",
    },
  ],
};
