# FiresideChat — verified handoff status

**Snapshot:** October 10, 2026 (GitHub repo/PR and checked-in operational docs). Refresh all PRs, live site and Neon state before acting. This snapshot is not automatically synchronized with production.

## Authoritative documents
- [Full development plan](DEVELOPMENT_PLAN.md): original MVP-01..11 and added FC-P01..20 exhaustive census/episodes/transcript backlog.
- [Agent rules](../AGENTS.md); [README](../README.md); [operations](operations.md); [former-member census](former-member-census.md); [verified podcast registry](podcast-registry.md); [RSS ingestion](rss-ingestion.md); [October expansion](podcast-expansion-2026-10.md).
- [Engine Room certification audit](https://github.com/neophilism/Engine-Room/issues/71).

## Existing code and point-in-time census
- Next.js/TypeScript/Prisma/PostgreSQL application with person/podcast/episode pages, persistent player, timestamped transcript search, source registry, private admin, feed ingestion and transcript recovery. Code existence is **not** proof the same commit and data are already live.
- As reported by docs/operations.md on October 10: **10,208 episodes**, **978 complete transcripts**, **1,881 episodes carrying linked pending source transcript URLs**, and **7,349 episodes lacking an RSS transcript reference**. This is a static point-in-time database report, not a current live query.
- docs/former-member-census.md documents 12,231 historical roster people, with 2,716 prioritized potential podcast-era cases; all remaining rows still require an honest searched/not-yet-searched classification. A sample of 37 feeds mentioned in prior operations is not verified exhaustive qualifying coverage.
- The current source registry is src/data/podcast-registry.ts. Qualifying host/cohost/official production needs positive evidence, not guest appearances. Ended shows must remain ingestable when their old episodes are accessible.
- TRANSCRIPTION_ENABLED=false by default, with OPENAI_API_KEY and daily/monthly audio-minute caps as separate gates. Published transcript download/recovery is unmetered; do it first. Metered generated transcription never self-enables.

## Open PR and recent merge check (2026-10-10)
- [#46 — complete former-member census descriptions and host regressions](https://github.com/neophilism/FiresideChat/pull/46) was OPEN, mergeable as last checked. Inspect CI and current overlap before merging or editing same files.
- [#47 — publisher/episode-site transcript backfill](https://github.com/neophilism/FiresideChat/pull/47) MERGED at 2026-10-10 12:08 UTC.
- [#48 — free-preview non-blocking background feed/transcript maintenance](https://github.com/neophilism/FiresideChat/pull/48) MERGED at 2026-10-10 12:14 UTC.
- Render paid cron previously returned HTTP 402; existing wake-transcript-backfill.yml plus running-instance ~20-minute worker is a **best-effort** free-tier workaround. Verify production deploy, scheduled wake cadence, source freshness and current STARTUP_ARCHIVE_SYNC=false independently before claiming autonomous operation.

## Next unblocked implementation work
1. Check the current #46 state and ensure historical-member census output remains a durable full-population audit, with candidates separately reviewed and real host relationships.
2. Build/reconcile the complete current/former/presidential BioGuide-keyed roster and missing/ambiguous show source queue; continue source-review and canonical-feed imports. Review known names/series gaps, do not auto-add unrelated network feeds.
3. Run and tune publisher RSS/official episode-page/other lawful transcript discovery backfill across all existing and newly ingested episodes; verify public search/time-coded rendering, exact backlog reduction and failure states.
4. Ensure incremental feed/background jobs operate after cold Render startup and don't double-run. Document actual uptime/freshness/deployment state.
5. Evaluate affordable, provider-neutral STT throughput and prepare a cost approval/authorization request *only when* the free transcript backlog has been evaluated; any paid audio is blocked until credentials/budget.
6. Update Engine Room with trustworthy actual work-to-PR and production evidence, not inferred completion from 11 MVP headings or number of portraits.

## Local runbook
    npm install
    npm run dev:setup
    npm run registry:validate
    npm run ingest:feeds
    npm run backfill:transcripts -- --publisher-limit=200 --discovery-limit=30
    npm run archive:status
    npm test
    npm run lint
    npm run typecheck
    npm run build
    npm run smoke:mvp

Local setup requires Docker PostgreSQL or configured DATABASE_URL. Production credentials remain in authorized environment only. A smoke page backed by demo/seed data is not sufficient to mark full Congress coverage.

## Release/handoff exit criteria
Every current/former Congressional and presidential roster row is counted and transparently classified; every verified qualifying podcast is imported or specifically blocked; available episode history is preserved and correctly host-attributed; free publisher and accessible online transcripts have been exhausted/reconciled; authorized STT completes or carries an accurate backlog/expense blocker; timestamp search and persistent player work on the live site; repeatable feed and transcript updates are observed; Neon backup/restore, security and administrator operations pass; Engine Room separately reports PR merged, deployed, imported and verified status.
