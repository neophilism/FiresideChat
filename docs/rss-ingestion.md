# RSS and Atom ingestion

Fireside Chat ingests only podcasts in the curated registry. The ingestion worker reads those seeded database records, fetches their canonical feeds, normalizes episodes, and stores them idempotently.

## Run it

After migrating and seeding the database:

```bash
npm run ingest:feeds
```

Useful options:

```bash
# One show
npm run ingest:feeds -- --slug verdict-with-ted-cruz

# Several shows
npm run ingest:feeds -- --slug verdict-with-ted-cruz --slug newts-world

# Ignore retry backoff and disabled status
npm run ingest:feeds -- --slug verdict-with-ted-cruz --force

# Change parallelism (1-10)
npm run ingest:feeds -- --concurrency 5
```

The command returns a nonzero exit code when any feed fails, while continuing to process the other feeds.

## Idempotency

Episodes are uniquely identified by `(podcastId, guid)`. If a publisher omits a GUID, Fireside Chat uses the enclosure URL as a deterministic fallback. Re-running ingestion updates existing episode metadata rather than creating duplicates.

The worker also records a row in `IngestionRun` for every attempted feed, including counts for episodes seen, created, updated, and skipped.

## Network behavior

The fetcher:

- accepts HTTPS feed URLs only;
- rejects localhost, IP-literal, credential-bearing, and `.local` destinations;
- manually validates redirects before following them;
- sends `If-None-Match` and `If-Modified-Since` when publishers provide cache validators;
- treats HTTP 304 as a successful no-op;
- defaults to a 20-second timeout and a 10 MiB response limit; and
- rejects XML documents containing a `DOCTYPE` declaration.

The limits can be changed with `FEED_FETCH_TIMEOUT_MS`, `FEED_MAX_BYTES`, and `FEED_USER_AGENT`.

## Failure handling

A failed feed does not stop the rest of the run. Fireside Chat stores a compact error message and applies exponential retry backoff starting at 15 minutes and capped at 24 hours. A successful fetch resets the failure count and clears the error.

## Supported formats

The parser currently supports RSS 2.0 and Atom. It normalizes:

- feed title, description, website, image, and language;
- episode GUID, title, description, publication/update dates;
- audio enclosure URL and MIME type;
- episode page and image URLs; and
- common podcast duration formats.

Publisher transcripts are intentionally deferred to the transcript-ingestion milestone.

## Scheduling

Production should invoke `npm run ingest:feeds` roughly once per hour from the hosting platform's scheduler. Scheduling is deliberately separate from parsing and persistence so the same worker can run under a platform cron, a container scheduler, or a manual recovery job.
