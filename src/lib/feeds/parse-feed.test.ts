import assert from "node:assert/strict";
import test from "node:test";
import {
  FeedParseError,
  parseDurationSeconds,
  parseFeed,
  toPlainText,
} from "./parse-feed";

test("parses RSS, normalizes metadata, and rejects unusable items", () => {
  const feed = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:podcast="https://podcastindex.org/namespace/1.0">
    <channel>
      <title>Capitol &amp; Country</title>
      <description><![CDATA[<p>A public affairs show.</p>]]></description>
      <link>https://example.com/show</link>
      <language>en-us</language>
      <itunes:image href="https://cdn.example.com/show.jpg" />
      <item>
        <guid isPermaLink="false">episode-1</guid>
        <title>Episode &amp; One</title>
        <content:encoded><![CDATA[<p>Hello <strong>world</strong>.</p>]]></content:encoded>
        <pubDate>Sun, 04 Oct 2026 15:30:00 GMT</pubDate>
        <itunes:duration>01:02:03</itunes:duration>
        <enclosure url="https://cdn.example.com/episode-1.mp3" type="audio/mpeg" />
        <link>https://example.com/show/episode-1</link>
        <itunes:image href="https://cdn.example.com/episode-1.jpg" />
        <podcast:transcript url="https://cdn.example.com/episode-1.vtt" type="text/vtt" />
      </item>
      <item>
        <guid>episode-1</guid>
        <title>Duplicate</title>
        <pubDate>Sun, 04 Oct 2026 15:30:00 GMT</pubDate>
        <enclosure url="https://cdn.example.com/duplicate.mp3" type="audio/mpeg" />
      </item>
      <item>
        <guid>missing-audio</guid>
        <title>No enclosure</title>
        <pubDate>Sun, 04 Oct 2026 15:30:00 GMT</pubDate>
      </item>
    </channel>
  </rss>`;

  const parsed = parseFeed(feed);

  assert.equal(parsed.metadata.title, "Capitol & Country");
  assert.equal(parsed.metadata.description, "A public affairs show.");
  assert.equal(parsed.metadata.websiteUrl, "https://example.com/show");
  assert.equal(parsed.metadata.imageUrl, "https://cdn.example.com/show.jpg");
  assert.equal(parsed.metadata.language, "en-us");
  assert.equal(parsed.episodes.length, 1);
  assert.equal(parsed.duplicateItems, 1);
  assert.equal(parsed.skippedItems, 1);

  const episode = parsed.episodes[0];
  assert.equal(episode.guid, "episode-1");
  assert.equal(episode.title, "Episode & One");
  assert.equal(episode.description, "Hello world.");
  assert.equal(episode.durationSeconds, 3723);
  assert.equal(episode.audioUrl, "https://cdn.example.com/episode-1.mp3");
  assert.equal(episode.audioMimeType, "audio/mpeg");
  assert.equal(episode.episodeUrl, "https://example.com/show/episode-1");
  assert.equal(episode.imageUrl, "https://cdn.example.com/episode-1.jpg");
  assert.deepEqual(episode.publisherTranscript, {
    url: "https://cdn.example.com/episode-1.vtt",
    mimeType: "text/vtt",
  });
  assert.equal(episode.publishedAt.toISOString(), "2026-10-04T15:30:00.000Z");
});

test("parses Atom entries and resolves relative URLs", () => {
  const feed = `<?xml version="1.0" encoding="UTF-8"?>
  <feed xmlns="http://www.w3.org/2005/Atom" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xml:lang="en">
    <title>House Notes</title>
    <subtitle>Long-form conversations</subtitle>
    <link rel="alternate" href="https://example.org/podcast/" />
    <logo>images/logo.png</logo>
    <entry>
      <id>tag:example.org,2026:42</id>
      <title>Budget Week</title>
      <summary type="html">&lt;p&gt;A summary with &lt;b&gt;detail&lt;/b&gt;.&lt;/p&gt;</summary>
      <published>2026-10-03T10:00:00Z</published>
      <updated>2026-10-03T11:00:00Z</updated>
      <itunes:duration>PT1M35S</itunes:duration>
      <link rel="enclosure" type="audio/mp4" href="audio/42.m4a" />
      <link rel="alternate" href="episodes/42" />
    </entry>
  </feed>`;

  const parsed = parseFeed(feed);
  assert.equal(parsed.metadata.title, "House Notes");
  assert.equal(parsed.metadata.description, "Long-form conversations");
  assert.equal(parsed.metadata.websiteUrl, "https://example.org/podcast/");
  assert.equal(parsed.metadata.imageUrl, "https://example.org/podcast/images/logo.png");
  assert.equal(parsed.metadata.language, "en");
  assert.equal(parsed.episodes.length, 1);

  const episode = parsed.episodes[0];
  assert.equal(episode.guid, "tag:example.org,2026:42");
  assert.equal(episode.description, "A summary with detail.");
  assert.equal(episode.durationSeconds, 95);
  assert.equal(episode.audioUrl, "https://example.org/podcast/audio/42.m4a");
  assert.equal(episode.episodeUrl, "https://example.org/podcast/episodes/42");
  assert.equal(episode.sourceUpdatedAt?.toISOString(), "2026-10-03T11:00:00.000Z");
});

test("uses the enclosure URL when an item has no GUID", () => {
  const parsed = parseFeed(`
    <rss version="2.0"><channel><title>Test</title>
      <item>
        <title>Fallback identity</title>
        <pubDate>2026-10-02T00:00:00Z</pubDate>
        <enclosure url="https://example.com/audio.mp3" type="audio/mpeg" />
      </item>
    </channel></rss>
  `);

  assert.equal(parsed.episodes[0].guid, "enclosure:https://example.com/audio.mp3");
});

test("rejects empty, unsupported, and DOCTYPE-bearing feeds", () => {
  assert.throws(() => parseFeed(""), FeedParseError);
  assert.throws(() => parseFeed("<html></html>"), FeedParseError);
  assert.throws(
    () => parseFeed("<!DOCTYPE rss><rss><channel /></rss>"),
    /DOCTYPE declarations/,
  );
});

test("parses common podcast duration forms", () => {
  assert.equal(parseDurationSeconds("90"), 90);
  assert.equal(parseDurationSeconds("01:30"), 90);
  assert.equal(parseDurationSeconds("1:02:03"), 3723);
  assert.equal(parseDurationSeconds("PT1H2M3S"), 3723);
  assert.equal(parseDurationSeconds("PT1M1.5S"), 62);
  assert.equal(parseDurationSeconds("1:99"), null);
  assert.equal(parseDurationSeconds("n/a"), null);
});

test("converts publisher HTML to plain text", () => {
  assert.equal(
    toPlainText("<p>Hello&nbsp;<strong>Congress</strong>.</p><p>Next.</p>"),
    "Hello Congress.\nNext.",
  );
});
