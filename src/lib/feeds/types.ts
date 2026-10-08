export type FeedMetadata = {
  title: string | null;
  description: string | null;
  websiteUrl: string | null;
  imageUrl: string | null;
  language: string | null;
};

export type PublisherTranscriptReference = {
  url: string;
  mimeType: string | null;
};

export type NormalizedEpisode = {
  guid: string;
  title: string;
  description: string | null;
  publishedAt: Date;
  sourceUpdatedAt: Date | null;
  durationSeconds: number | null;
  audioUrl: string;
  audioMimeType: string | null;
  episodeUrl: string | null;
  imageUrl: string | null;
  publisherTranscript: PublisherTranscriptReference | null;
};

export type ParsedFeed = {
  metadata: FeedMetadata;
  episodes: NormalizedEpisode[];
  skippedItems: number;
  duplicateItems: number;
};

export type FeedFetchOptions = {
  etag?: string | null;
  lastModified?: string | null;
  timeoutMs?: number;
  maxBytes?: number;
  userAgent?: string;
};

export type FeedFetchResult =
  | {
      status: "not-modified";
      httpStatus: 304;
      finalUrl: string;
      etag: string | null;
      lastModified: string | null;
      bytes: 0;
    }
  | {
      status: "ok";
      httpStatus: number;
      finalUrl: string;
      etag: string | null;
      lastModified: string | null;
      bytes: number;
      xml: string;
    };

export type IngestionResult = {
  podcastSlug: string;
  status: "succeeded" | "not-modified" | "skipped" | "failed";
  episodesSeen: number;
  episodesCreated: number;
  episodesUpdated: number;
  episodesSkipped: number;
  message?: string;
};
