import { XMLParser, XMLValidator } from "fast-xml-parser";
import type { NormalizedEpisode, ParsedFeed } from "./types";

type XmlRecord = Record<string, unknown>;

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text",
  trimValues: true,
  parseTagValue: false,
  parseAttributeValue: false,
  processEntities: false,
  allowBooleanAttributes: true,
  removeNSPrefix: false,
});

export class FeedParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FeedParseError";
  }
}

function asRecord(value: unknown): XmlRecord | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null;
  }

  return value as XmlRecord;
}

function asArray(value: unknown): unknown[] {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

function readText(value: unknown): string | null {
  if (typeof value === "string") return value.trim() || null;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    for (const entry of value) {
      const text = readText(entry);
      if (text) return text;
    }
    return null;
  }

  const record = asRecord(value);
  if (!record) return null;

  return (
    readText(record["#text"]) ??
    readText(record.__cdata) ??
    readText(record._text) ??
    null
  );
}

function firstText(record: XmlRecord, keys: string[]): string | null {
  for (const key of keys) {
    const value = readText(record[key]);
    if (value) return value;
  }

  return null;
}

function attribute(record: XmlRecord | null, name: string): string | null {
  if (!record) return null;
  return readText(record[`@_${name}`]);
}

function isValidCodePoint(value: number): boolean {
  return (
    Number.isInteger(value) &&
    value >= 0 &&
    value <= 0x10ffff &&
    !(value >= 0xd800 && value <= 0xdfff)
  );
}

function decodeCommonHtmlEntities(value: string): string {
  const named: Record<string, string> = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    nbsp: " ",
    quot: '"',
  };

  return value.replace(
    /&(#x[0-9a-f]+|#\d+|amp|apos|gt|lt|nbsp|quot);/gi,
    (match, entity: string) => {
      if (entity.startsWith("#x") || entity.startsWith("#X")) {
        const codePoint = Number.parseInt(entity.slice(2), 16);
        return isValidCodePoint(codePoint)
          ? String.fromCodePoint(codePoint)
          : match;
      }

      if (entity.startsWith("#")) {
        const codePoint = Number.parseInt(entity.slice(1), 10);
        return isValidCodePoint(codePoint)
          ? String.fromCodePoint(codePoint)
          : match;
      }

      return named[entity.toLowerCase()] ?? match;
    },
  );
}

function decodeRepeatedly(value: string): string {
  let decoded = value;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const next = decodeCommonHtmlEntities(decoded);
    if (next === decoded) break;
    decoded = next;
  }

  return decoded;
}

export function toPlainText(value: string | null): string | null {
  if (!value) return null;

  const plain = decodeRepeatedly(value)
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(
      /<\s*\/?(?:p|div|li|h[1-6]|section|article|blockquote)[^>]*>/gi,
      "\n",
    )
    .replace(/<[^>]*>/g, "")
    .replace(/[\t\r ]+/g, " ")
    .replace(/ *\n+ */g, "\n")
    .trim();

  return plain || null;
}

function parseDate(value: string | null): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function parseDurationSeconds(value: unknown): number | null {
  const raw = readText(value);
  if (!raw) return null;

  if (/^\d+(?:\.\d+)?$/.test(raw)) {
    const seconds = Number.parseFloat(raw);
    return Number.isFinite(seconds) ? Math.max(0, Math.round(seconds)) : null;
  }

  const isoMatch = raw.match(
    /^PT(?:(\d+(?:\.\d+)?)H)?(?:(\d+(?:\.\d+)?)M)?(?:(\d+(?:\.\d+)?)S)?$/i,
  );
  if (isoMatch) {
    const hours = Number.parseFloat(isoMatch[1] ?? "0");
    const minutes = Number.parseFloat(isoMatch[2] ?? "0");
    const seconds = Number.parseFloat(isoMatch[3] ?? "0");
    return Math.round(hours * 3600 + minutes * 60 + seconds);
  }

  const parts = raw.split(":");
  if (parts.length < 2 || parts.length > 3) return null;
  if (!parts.every((part) => /^\d+(?:\.\d+)?$/.test(part))) return null;

  const values = parts.map(Number);
  const seconds = values.at(-1) ?? 0;
  const minutes = values.at(-2) ?? 0;
  const hours = values.length === 3 ? values[0] : 0;

  if (minutes >= 60 || seconds >= 60) return null;
  return Math.round(hours * 3600 + minutes * 60 + seconds);
}

function normalizeUrl(value: string | null, baseUrl?: string | null): string | null {
  if (!value) return null;

  try {
    const url = new URL(value, baseUrl ?? undefined);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

function pickRssEnclosure(item: XmlRecord): {
  url: string;
  mimeType: string | null;
} | null {
  const candidates = [
    ...asArray(item.enclosure),
    ...asArray(item["media:content"]),
  ];

  let fallback: { url: string; mimeType: string | null } | null = null;

  for (const candidate of candidates) {
    const record = asRecord(candidate);
    const url = normalizeUrl(attribute(record, "url"));
    if (!url) continue;

    const mimeType = attribute(record, "type");
    const medium = attribute(record, "medium");
    const normalized = { url, mimeType };

    if (mimeType?.toLowerCase().startsWith("audio/") || medium === "audio") {
      return normalized;
    }

    fallback ??= normalized;
  }

  return fallback;
}

function readRssImage(item: XmlRecord): string | null {
  const itunesImage = asRecord(item["itunes:image"]);
  const mediaThumbnail = asRecord(item["media:thumbnail"]);
  return (
    normalizeUrl(attribute(itunesImage, "href")) ??
    normalizeUrl(attribute(mediaThumbnail, "url"))
  );
}

function readPublisherTranscript(record: XmlRecord) {
  for (const candidate of asArray(record["podcast:transcript"])) {
    const transcript = asRecord(candidate);
    const url = normalizeUrl(attribute(transcript, "url"));
    if (!url) continue;

    return {
      url,
      mimeType: attribute(transcript, "type"),
    };
  }

  return null;
}

function stableGuid(guid: string | null, audioUrl: string): string {
  return guid ?? `enclosure:${audioUrl}`;
}

function normalizeRssItem(value: unknown): NormalizedEpisode | null {
  const item = asRecord(value);
  if (!item) return null;

  const enclosure = pickRssEnclosure(item);
  if (!enclosure) return null;

  const publishedAt = parseDate(
    firstText(item, ["pubDate", "dc:date", "published", "date"]),
  );
  if (!publishedAt) return null;

  const title = firstText(item, ["title"]) ?? "Untitled episode";
  const guid = stableGuid(firstText(item, ["guid", "id"]), enclosure.url);

  return {
    guid,
    title: toPlainText(title) ?? "Untitled episode",
    description: toPlainText(
      firstText(item, ["content:encoded", "description", "summary"]),
    ),
    publishedAt,
    sourceUpdatedAt: parseDate(
      firstText(item, ["atom:updated", "updated", "dcterms:modified"]),
    ),
    durationSeconds: parseDurationSeconds(item["itunes:duration"]),
    audioUrl: enclosure.url,
    audioMimeType: enclosure.mimeType,
    episodeUrl: normalizeUrl(firstText(item, ["link"])),
    imageUrl: readRssImage(item),
    publisherTranscript: readPublisherTranscript(item),
  };
}

function atomLinks(record: XmlRecord): XmlRecord[] {
  return asArray(record.link)
    .map(asRecord)
    .filter((value): value is XmlRecord => value !== null);
}

function pickAtomLink(
  record: XmlRecord,
  predicate: (link: XmlRecord) => boolean,
): XmlRecord | null {
  return atomLinks(record).find(predicate) ?? null;
}

function normalizeAtomEntry(
  value: unknown,
  feedWebsiteUrl: string | null,
): NormalizedEpisode | null {
  const entry = asRecord(value);
  if (!entry) return null;

  const enclosure = pickAtomLink(entry, (link) => {
    const relation = attribute(link, "rel");
    const mimeType = attribute(link, "type");
    return relation === "enclosure" || mimeType?.startsWith("audio/") === true;
  });
  const audioUrl = normalizeUrl(attribute(enclosure, "href"), feedWebsiteUrl);
  if (!audioUrl) return null;

  const publishedAt = parseDate(firstText(entry, ["published", "updated"]));
  if (!publishedAt) return null;

  const alternate = pickAtomLink(entry, (link) => {
    const relation = attribute(link, "rel");
    return relation === null || relation === "alternate";
  });
  const title = firstText(entry, ["title"]) ?? "Untitled episode";

  return {
    guid: stableGuid(firstText(entry, ["id", "guid"]), audioUrl),
    title: toPlainText(title) ?? "Untitled episode",
    description: toPlainText(firstText(entry, ["summary", "content"])),
    publishedAt,
    sourceUpdatedAt: parseDate(firstText(entry, ["updated"])),
    durationSeconds: parseDurationSeconds(entry["itunes:duration"]),
    audioUrl,
    audioMimeType: attribute(enclosure, "type"),
    episodeUrl: normalizeUrl(attribute(alternate, "href"), feedWebsiteUrl),
    imageUrl:
      normalizeUrl(firstText(entry, ["logo", "icon"]), feedWebsiteUrl) ??
      normalizeUrl(
        attribute(asRecord(entry["itunes:image"]), "href"),
        feedWebsiteUrl,
      ),
    publisherTranscript: readPublisherTranscript(entry),
  };
}

function deduplicateEpisodes(episodes: NormalizedEpisode[]): {
  episodes: NormalizedEpisode[];
  duplicateItems: number;
} {
  const byGuid = new Map<string, NormalizedEpisode>();
  let duplicateItems = 0;

  for (const episode of episodes) {
    if (byGuid.has(episode.guid)) {
      duplicateItems += 1;
      continue;
    }
    byGuid.set(episode.guid, episode);
  }

  return { episodes: [...byGuid.values()], duplicateItems };
}

function parseRss(channel: XmlRecord): ParsedFeed {
  const rawItems = asArray(channel.item);
  const normalized = rawItems
    .map(normalizeRssItem)
    .filter((episode): episode is NormalizedEpisode => episode !== null);
  const deduplicated = deduplicateEpisodes(normalized);
  const image = asRecord(channel.image);

  return {
    metadata: {
      title: toPlainText(firstText(channel, ["title"])),
      description: toPlainText(firstText(channel, ["description", "subtitle"])),
      websiteUrl: normalizeUrl(firstText(channel, ["link"])),
      imageUrl:
        normalizeUrl(attribute(asRecord(channel["itunes:image"]), "href")) ??
        normalizeUrl(firstText(image ?? {}, ["url"])),
      language: firstText(channel, ["language"]),
    },
    episodes: deduplicated.episodes,
    skippedItems: rawItems.length - normalized.length,
    duplicateItems: deduplicated.duplicateItems,
  };
}

function parseAtom(feed: XmlRecord): ParsedFeed {
  const alternate = pickAtomLink(feed, (link) => {
    const relation = attribute(link, "rel");
    return relation === null || relation === "alternate";
  });
  const websiteUrl = normalizeUrl(attribute(alternate, "href"));
  const rawEntries = asArray(feed.entry);
  const normalized = rawEntries
    .map((entry) => normalizeAtomEntry(entry, websiteUrl))
    .filter((episode): episode is NormalizedEpisode => episode !== null);
  const deduplicated = deduplicateEpisodes(normalized);

  return {
    metadata: {
      title: toPlainText(firstText(feed, ["title"])),
      description: toPlainText(firstText(feed, ["subtitle", "description"])),
      websiteUrl,
      imageUrl: normalizeUrl(firstText(feed, ["logo", "icon"]), websiteUrl),
      language:
        attribute(feed, "xml:lang") ?? attribute(feed, "lang") ?? null,
    },
    episodes: deduplicated.episodes,
    skippedItems: rawEntries.length - normalized.length,
    duplicateItems: deduplicated.duplicateItems,
  };
}

export function parseFeed(xml: string): ParsedFeed {
  if (!xml.trim()) throw new FeedParseError("Feed is empty");
  if (/<!DOCTYPE/i.test(xml)) {
    throw new FeedParseError("DOCTYPE declarations are not accepted in feeds");
  }

  const validation = XMLValidator.validate(xml, {
    allowBooleanAttributes: true,
  });
  if (validation !== true) {
    throw new FeedParseError(
      `Invalid XML: ${validation.err.msg} at line ${validation.err.line}`,
    );
  }

  let document: XmlRecord;
  try {
    const parsed = parser.parse(xml);
    const record = asRecord(parsed);
    if (!record) throw new Error("Parser did not return an object");
    document = record;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new FeedParseError(`Invalid XML: ${message}`);
  }

  const rss = asRecord(document.rss);
  const channel = rss ? asRecord(rss.channel) : null;
  if (channel) return parseRss(channel);

  const feed = asRecord(document.feed);
  if (feed) return parseAtom(feed);

  throw new FeedParseError("Unsupported feed format: expected RSS or Atom");
}
