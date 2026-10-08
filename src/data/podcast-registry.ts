export type RegistryPerson = {
  slug: string;
  fullName: string;
  kind: "HOUSE" | "SENATE" | "SHADOW_SENATE" | "PRESIDENT";
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
      slug: "ed-markey",
      fullName: "Ed Markey",
      kind: "SENATE",
      state: "MA",
      party: "Democratic",
      isCurrent: true,
    },
    {
      slug: "marsha-blackburn",
      fullName: "Marsha Blackburn",
      kind: "SENATE",
      state: "TN",
      party: "Republican",
      isCurrent: true,
    },
    {
      slug: "mark-pocan",
      fullName: "Mark Pocan",
      kind: "HOUSE",
      state: "WI",
      party: "Democratic",
      isCurrent: true,
    },
    {
      slug: "bernie-sanders",
      fullName: "Bernie Sanders",
      kind: "SENATE",
      state: "VT",
      party: "Independent",
      isCurrent: true,
    },
    {
      slug: "sheldon-whitehouse",
      fullName: "Sheldon Whitehouse",
      kind: "SENATE",
      state: "RI",
      party: "Democratic",
      isCurrent: true,
    },
    {
      slug: "james-lankford",
      fullName: "James Lankford",
      kind: "SENATE",
      state: "OK",
      party: "Republican",
      isCurrent: true,
    },
    {
      slug: "jim-clyburn",
      fullName: "James E. Clyburn",
      kind: "HOUSE",
      state: "SC",
      party: "Democratic",
      isCurrent: true,
    },
    {
      slug: "scott-peters",
      fullName: "Scott Peters",
      kind: "HOUSE",
      state: "CA",
      party: "Democratic",
      isCurrent: true,
    },
    {
      slug: "marc-veasey",
      fullName: "Marc Veasey",
      kind: "HOUSE",
      state: "TX",
      party: "Democratic",
      isCurrent: true,
    },
    {
      slug: "greg-landsman",
      fullName: "Greg Landsman",
      kind: "HOUSE",
      state: "OH",
      party: "Democratic",
      isCurrent: true,
    },
    {
      slug: "mike-johnson",
      fullName: "Mike Johnson",
      kind: "HOUSE",
      state: "LA",
      party: "Republican",
      isCurrent: true,
    },
    {
      slug: "anna-paulina-luna",
      fullName: "Anna Paulina Luna",
      kind: "HOUSE",
      state: "FL",
      party: "Republican",
      isCurrent: true,
    },
    {
      slug: "erin-houchin",
      fullName: "Erin Houchin",
      kind: "HOUSE",
      state: "IN",
      party: "Republican",
      isCurrent: true,
    },
    {
      slug: "eric-burlison",
      fullName: "Eric Burlison",
      kind: "HOUSE",
      state: "MO",
      party: "Republican",
      isCurrent: true,
    },
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
      slug: "tim-burchett",
      fullName: "Tim Burchett",
      kind: "HOUSE",
      state: "TN",
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
    {
      slug: "michael-d-brown",
      fullName: "Michael D. Brown",
      kind: "SHADOW_SENATE",
      state: "DC",
      party: "Democratic",
      isCurrent: false,
    },
  ],
  podcasts: [
    {
      slug: "the-ed-markey-podcast",
      title: "The Ed Markey Podcast",
      rssUrl: "https://media.rss.com/edmarkeypodcast/feed.xml",
      websiteUrl: "https://rss.com/podcasts/edmarkeypodcast",
      active: true,
      publishingStatus: "INACTIVE",
      verificationUrl:
        "https://podcasts.apple.com/us/podcast/the-ed-markey-podcast/id1729232913",
      verifiedAt: "2026-10-05",
      verificationNote:
        "Apple identifies Senator Ed Markey as creator and links the show website to rss.com/podcasts/edmarkeypodcast; RSS.com's documented canonical feed format yields this feed URL.",
      people: [{ personSlug: "ed-markey", role: "HOST" }],
    },
    {
      slug: "unmuted-with-senator-marsha-blackburn",
      title: "Unmuted with Senator Marsha Blackburn",
      rssUrl: "https://feeds.buzzsprout.com/2328442.rss",
      websiteUrl: "https://www.buzzsprout.com/2328442",
      active: true,
      publishingStatus: "ACTIVE",
      verificationUrl: "https://www.buzzsprout.com/2328442",
      verifiedAt: "2026-10-05",
      verificationNote:
        "Buzzsprout identifies Senator Marsha Blackburn as host and exposes the canonical RSS feed directly from the publisher page.",
      people: [{ personSlug: "marsha-blackburn", role: "HOST" }],
    },
    {
      slug: "with-liberty-and-justice-for-some",
      title: "With Liberty and Justice for Some",
      rssUrl: "https://anchor.fm/s/ff00a8d4/podcast/rss",
      websiteUrl: "https://pocan.house.gov/",
      active: true,
      publishingStatus: "ACTIVE",
      verificationUrl: "https://podcastrepublic.net/podcast/1794881118",
      verifiedAt: "2026-10-05",
      verificationNote:
        "Podcast directories identify Rep. Mark Pocan as host and expose the canonical Anchor RSS feed.",
      people: [{ personSlug: "mark-pocan", role: "HOST" }],
    },
    {
      slug: "hear-the-bern",
      title: "Hear the Bern",
      rssUrl: "https://feeds.blubrry.com/feeds/hear_the_bern.xml",
      websiteUrl: "https://berniesanders.com/podcast/",
      active: true,
      publishingStatus: "INACTIVE",
      verificationUrl: "https://podcastrepublic.net/podcast/1458648316",
      verifiedAt: "2026-10-05",
      verificationNote:
        "Podcast directories identify Bernie Sanders and Briahna Joy Gray as hosts; the historical campaign feed remains available.",
      people: [{ personSlug: "bernie-sanders", role: "COHOST" }],
    },
    {
      slug: "making-the-case",
      title: "Making the Case",
      rssUrl: "https://anchor.fm/s/e0d8cda0/podcast/rss",
      websiteUrl: "https://www.whitehouse.senate.gov/making-the-case/",
      active: true,
      publishingStatus: "ACTIVE",
      verificationUrl:
        "https://www.whitehouse.senate.gov/news/release/whitehouse-launches-making-the-case-podcast-to-shine-light-on-far-right-scheme-to-capture-supreme-court/",
      verifiedAt: "2026-10-05",
      verificationNote:
        "Senator Whitehouse's official Senate office launched the show and podcast directories expose the canonical Anchor RSS feed.",
      people: [{ personSlug: "sheldon-whitehouse", role: "HOST" }],
    },
    {
      slug: "the-breakdown-with-james-lankford",
      title: "The Breakdown with James Lankford",
      rssUrl: "https://feeds.feedburner.com/TheBreakdownwithJamesLankford",
      websiteUrl: "https://www.lankford.senate.gov/",
      active: true,
      publishingStatus: "INACTIVE",
      verificationUrl:
        "https://www.lankford.senate.gov/news/press-releases/senator-lankford-releases-podcast-on-solution-to-end-government-shutdowns/",
      verifiedAt: "2026-10-05",
      verificationNote:
        "Official Senate releases identify The Breakdown as Senator Lankford's podcast; the canonical feed is preserved for the historical archive.",
      people: [{ personSlug: "james-lankford", role: "HOST" }],
    },
    {
      slug: "clyburn-chronicles",
      title: "Clyburn Chronicles",
      rssUrl: "https://feed.podbean.com/clyburnchronicles/feed.xml",
      websiteUrl: "https://clyburnchronicles.podbean.com/",
      active: true,
      publishingStatus: "INACTIVE",
      verificationUrl: "https://clyburnchronicles.podbean.com/",
      verifiedAt: "2026-10-05",
      verificationNote:
        "Publisher page identifies Congressman James Clyburn as host; the feed follows Podbean's canonical feed endpoint for the publisher subdomain.",
      people: [{ personSlug: "jim-clyburn", role: "HOST" }],
    },
    {
      slug: "72-and-sunny-with-scott-peters",
      title: "72 and Sunny with Scott Peters",
      rssUrl:
        "https://www.omnycontent.com/d/playlist/d57f2f8a-7bab-4064-9571-ae7c0139f8ec/2e7a4896-2eb4-4fdb-97b4-b3df00fdbdd1/da3fe69b-dedc-4726-99f0-b3df00fdc27a/podcast.rss",
      active: true,
      publishingStatus: "ACTIVE",
      verificationUrl:
        "https://www.olaspodcast.com/72-and-sunny-with-scott-peters",
      verifiedAt: "2026-10-05",
      verificationNote:
        "Publisher page identifies Congressman Scott Peters as host and exposes the canonical Omny RSS feed.",
      people: [{ personSlug: "scott-peters", role: "HOST" }],
    },
    {
      slug: "the-fly-in",
      title: "The Fly-In",
      rssUrl: "https://api.substack.com/feed/podcast/5246009.rss",
      websiteUrl: "https://newdemocratcoalition.substack.com/",
      active: true,
      publishingStatus: "ACTIVE",
      verificationUrl:
        "https://newdemocratcoalition.house.gov/media-center/press-releases/new-democrat-coalition-launches-the-fly-in-podcast",
      verifiedAt: "2026-10-05",
      verificationNote:
        "New Democrat Coalition and podcast metadata identify Reps. Greg Landsman and Marc Veasey as co-hosts.",
      people: [
        { personSlug: "greg-landsman", role: "COHOST" },
        { personSlug: "marc-veasey", role: "COHOST" },
      ],
    },
    {
      slug: "truth-be-told-with-mike-and-kelly-johnson",
      title: "Truth be Told with Mike & Kelly Johnson",
      rssUrl: "https://feeds.libsyn.com/404672/rss",
      websiteUrl: "https://www.mikeandkellyjohnson.com/",
      active: true,
      publishingStatus: "INACTIVE",
      verificationUrl:
        "https://podcasts.apple.com/us/podcast/truth-be-told-with-mike-kelly-johnson/id1613637836",
      verifiedAt: "2026-10-05",
      verificationNote:
        "Podcast metadata identifies Congressman Mike Johnson and Kelly Johnson as co-hosts; the archived Libsyn feed remains available.",
      people: [{ personSlug: "mike-johnson", role: "COHOST" }],
    },
    {
      slug: "luna-talks-with-anna-paulina",
      title: "Luna Talks with Anna Paulina",
      rssUrl:
        "https://www.omnycontent.com/d/playlist/e73c998e-6e60-432f-8610-ae210140c5b1/35c394c3-f8c7-45f5-be55-ae27016d8c23/69d87d5f-23a7-4c22-a11c-ae27016d8c36/podcast.rss",
      websiteUrl: "https://omny.fm/shows/luna-talks-with-anna-paulina",
      active: true,
      publishingStatus: "INACTIVE",
      verificationUrl:
        "https://www.podbean.com/podcast-detail/22iqr-1b2b0d/Luna-Talks-with-Anna-Paulina-Podcast",
      verifiedAt: "2026-10-05",
      verificationNote:
        "Podcast directories identify Anna Paulina Luna as host and expose the canonical Omny RSS feed for the historical series.",
      people: [{ personSlug: "anna-paulina-luna", role: "HOST" }],
    },
    {
      slug: "the-contender-with-erin-houchin",
      title: "The Contender with Erin Houchin",
      rssUrl: "https://feed.podbean.com/thecontendereh/feed.xml",
      websiteUrl: "https://thecontendereh.podbean.com/",
      active: true,
      publishingStatus: "ACTIVE",
      verificationUrl: "https://thecontendereh.podbean.com/",
      verifiedAt: "2026-10-05",
      verificationNote:
        "Publisher page identifies Congresswoman Erin Houchin as host; the feed uses Podbean's canonical endpoint for the publisher subdomain.",
      people: [{ personSlug: "erin-houchin", role: "HOST" }],
    },
    {
      slug: "fresh-freedom",
      title: "Fresh Freedom",
      rssUrl: "https://anchor.fm/s/db2f52d4/podcast/rss",
      websiteUrl: "https://burlison.house.gov/",
      active: true,
      publishingStatus: "ACTIVE",
      verificationUrl:
        "https://podcasts.apple.com/us/podcast/fresh-freedom/id1674604542",
      verifiedAt: "2026-10-05",
      verificationNote:
        "Podcast metadata identifies Congressman Eric Burlison as host and Podstatus exposes the canonical Anchor RSS feed.",
      people: [{ personSlug: "eric-burlison", role: "HOST" }],
    },
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
      slug: "tennessee-talks-with-tim-burchett",
      title: "Tennessee Talks with Tim Burchett",
      rssUrl: "https://media.rss.com/tennesseetalks/feed.xml",
      websiteUrl: "https://rss.com/podcasts/tennesseetalks",
      active: true,
      publishingStatus: "INACTIVE",
      verificationUrl:
        "https://podcasts.apple.com/us/podcast/tennessee-talks-with-tim-burchett/id1604614351",
      verifiedAt: "2026-10-07",
      verificationNote:
        "Apple identifies Congressman Tim Burchett as creator and links the show website to rss.com/podcasts/tennesseetalks; the RSS.com canonical feed endpoint is live-probed in this PR before promotion.",
      people: [{ personSlug: "tim-burchett", role: "HOST" }],
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
    {
      slug: "shadow-politics",
      title: "Shadow Politics with US Senator Michael D Brown",
      rssUrl: "https://bbsradio.com/customshow/2570",
      websiteUrl: "https://bbsradio.com/shadowpolitics",
      active: true,
      publishingStatus: "ACTIVE",
      verificationUrl: "https://bbsradio.com/shadowpolitics",
      verifiedAt: "2026-10-05",
      verificationNote:
        "BBS Radio identifies former D.C. Shadow Senator Michael D. Brown as host and exposes this endpoint as the show's Audio RSS Feed.",
      people: [{ personSlug: "michael-d-brown", role: "HOST" }],
    },
  ],
  candidates: [
    {
      person: "Ruben Gallego",
      show: "Real Talk with Ruben",
      sourceUrl:
        "https://podcasts.apple.com/us/podcast/real-talk-with-ruben/id1888294647",
      reason:
        "Host relationship is verified and the active 2026 show is in scope; canonical public RSS feed still needs recovery.",
    },
    {
      person: "Angus King",
      show: "Inside Maine with Senator Angus King",
      sourceUrl:
        "https://podcasts.apple.com/us/podcast/inside-maine-with-senator-angus-king/id1089371119",
      reason:
        "Host relationship is verified; canonical public RSS feed still needs recovery.",
    },
    {
      person: "Tim Scott",
      show: "Opportunity With Tim Scott",
      sourceUrl:
        "https://www.scott.senate.gov/newsroom/newsletters/e-newsletter-justice-for-all/",
      reason:
        "Official Senate material verifies the podcast; canonical public RSS feed still needs recovery.",
    },
    {
      person: "Ron Johnson",
      show: "Hey, Wisconsin",
      sourceUrl:
        "https://www.ronjohnson.senate.gov/2016/06/10/2016-6-johnson-releases-new-hey-wisconsin-episode/",
      reason:
        "Official Senate material verifies the historical podcast; canonical public RSS feed still needs recovery.",
    },
    {
      person: "Pete Ricketts",
      show: "The Nebraska Way",
      sourceUrl:
        "https://podcasts.apple.com/us/podcast/the-nebraska-way/id1471046353",
      reason:
        "Host relationship is verified for the historical series; canonical public RSS feed still needs recovery.",
    },
    {
      person: "Brian Fitzpatrick and Tom Suozzi",
      show: "The Pod Couple",
      sourceUrl:
        "https://problemsolverscaucus.house.gov/news/documentsingle.aspx?DocumentID=889",
      reason:
        "Official caucus announcement verifies both members as co-hosts; canonical public RSS feed still needs recovery.",
    },
    {
      person: "Mike Levin",
      show: "Listening with Levin",
      sourceUrl:
        "https://levin.house.gov/media/press-releases/rep-mike-levin-launches-new-podcast-listening-with-levin",
      reason:
        "Official House announcement verifies the podcast; canonical public RSS feed still needs recovery.",
    },
    {
      person: "Tim Burchett",
      show: "Unscripted with Tim Burchett",
      sourceUrl:
        "https://podcasts.apple.com/us/podcast/unscripted-with-tim-burchett/id1823959003",
      reason:
        "The host relationship and 2025 audio series are verified; its canonical public RSS feed still needs recovery before separate ingestion.",
    },
    {
      person: "Troy Carter",
      show: "\"What Makes America Tick?\" with Congressman Troy A. Carter, Sr.",
      sourceUrl:
        "https://podcasts.apple.com/us/podcast/what-makes-america-tick-with-congressman-troy-a-carter-sr/id1809799553",
      reason:
        "Active host relationship is verified; canonical public RSS feed still needs recovery.",
    },
    {
      person: "Mark Alford",
      show: "Mark Alford's America",
      sourceUrl: "https://alford.house.gov/alfords-america-archive/",
      reason:
        "Official House archive explicitly calls it Rep. Alford's radio show/podcast; no canonical open RSS feed has been located.",
    },
    {
      person: "Gil Cisneros",
      show: "Who Dem?",
      sourceUrl:
        "https://www.gilonthehill.com/2025/03/21/congressman-gil-cisneros-introduces-who-dem-podcast/",
      reason:
        "Host relationship is verified; canonical public RSS feed still needs recovery.",
    },
    {
      person: "Andy Biggs",
      show: "What's the BIGGS Idea?",
      sourceUrl: "https://biggs.house.gov/media/whats-biggs-idea-podcast",
      reason:
        "Official House page verifies the series, but current distribution is primarily YouTube/Rumble and the historical audio RSS feed still needs recovery.",
    },
    {
      person: "Jeff Crank",
      show: "American Potential",
      sourceUrl: "https://americanpotential.podbean.com/",
      reason:
        "Jeff Crank previously hosted the show, but it now continues under David From. Ingestion needs host-date boundaries before the continuing feed can be safely attached to Crank's archive.",
    },
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
