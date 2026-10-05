# Fireside Chat

Fireside Chat is a nonpartisan podcast player and searchable archive for podcasts hosted, co-hosted, or officially produced by current and former members of the U.S. Congress and U.S. presidents.

The product is organized around public servants rather than shows. A person may host multiple podcasts over time, while their Fireside Chat page remains the durable home for episodes, transcripts, accomplishments, and eventually official contact information.

## MVP roadmap

1. Application and PostgreSQL data foundation
2. Verified politician/podcast registry
3. RSS/Atom ingestion and automatic episode updates
4. Homepage and podcast directory
5. Persistent bottom audio player
6. Person pages and episode browsing
7. Publisher transcript ingestion
8. Automatic transcription when publisher transcripts are absent
9. Full-text transcript search with timestamp playback
10. Private administration and source-health interface
11. Production hardening and deployment

## Local development

Requirements: Node.js 20.9+ and Docker.

```bash
npm install
npm run dev:setup
npm run ingest:feeds
npm run dev
```

Open http://localhost:3000. Health check: http://localhost:3000/api/health.

For local development and Codespaces, database commands default to the Docker Compose PostgreSQL instance when `DATABASE_URL` is not set. Production still requires an explicit `DATABASE_URL`. If you want to use another local database, copy `.env.example` to `.env` and edit it before running setup.

Run validation independently with:

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

## Verified podcast registry

The curated registry lives in `src/data/podcast-registry.ts`. Every ingestable show carries a canonical RSS URL, a verified host relationship, provenance, and a verification date. See `docs/podcast-registry.md` for the inclusion and review policy.

## Feed ingestion

`npm run ingest:feeds` fetches all active, due feeds and idempotently inserts or updates their episodes. It supports conditional HTTP requests, RSS 2.0 and Atom, bounded concurrency, per-feed run records, failure isolation, and retry backoff. See `docs/rss-ingestion.md` for commands and operational details.

## Editorial scope

The verified registry includes a podcast only when a current or former member of Congress, or a U.S. president, hosts it, co-hosts it, or the show is officially produced on their behalf. Guest appearances alone do not qualify.

Fireside Chat is independent and is not affiliated with or endorsed by the public officials whose publicly available podcasts it indexes.
