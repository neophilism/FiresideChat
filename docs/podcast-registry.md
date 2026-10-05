# Verified podcast registry

Fireside Chat uses a curated registry rather than accepting arbitrary podcast-search matches.

## Inclusion rule

A show qualifies when a current or former member of the U.S. House, U.S. Senate, or a U.S. president is a host, co-host, or the show is officially produced on that person's behalf. Guest appearances alone do not qualify.

Every ingestable registry entry must include:

- a canonical RSS URL;
- the public servant relationship to the show;
- a verification URL;
- the date that relationship/feed was checked; and
- a short verification note.

The registry is intentionally auditable. Discovery services can suggest candidates later, but candidates do not enter automated ingestion until their host relationship and canonical feed are verified.

## Publishing status vs. ingestion status

`publishingStatus` describes whether a show appears to be actively publishing. The existing `active` flag controls whether Fireside Chat should ingest the feed.

An ended show may therefore be:

- `publishingStatus: "INACTIVE"`
- `active: true`

That allows Fireside Chat to preserve and search historical podcast archives.

## Initial verified tranche

The first seed contains 12 ingestable shows spanning current and former officeholders and both major parties. It is a starting corpus, not an exhaustive census.

Candidates whose public-service/host relationship is known but whose current ingestable RSS situation still needs resolution live in the `candidates` section of `src/data/podcast-registry.ts`. They are deliberately excluded from the database seed until that issue is resolved.

## Updating the registry

After editing `src/data/podcast-registry.ts`, run:

```bash
npm run registry:validate
npm run db:seed
```

The seed is idempotent. It upserts people and podcasts by slug and resets the seeded person/podcast relationships to match the registry.
