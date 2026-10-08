# Production operations

Fireside Chat has one maintenance command for the recurring archive update cycle:

```bash
npm run sync:archive
```

The command runs both stages in order:

1. **Feed ingestion** — checks every due active RSS/Atom feed, inserts new episodes, refreshes metadata, and ingests publisher-provided transcripts.
2. **Generated transcript fallback** — attempts automatic transcription only when it is explicitly enabled and only for episodes that still have no publisher transcript.

The transcript stage still runs when an individual feed fails, so one bad source cannot prevent unrelated missing transcripts from progressing. The maintenance command exits non-zero when either stage reports failures, which lets a scheduler surface the run for attention.

## Recommended schedule

For the current low-cost deployment, run the maintenance command once per day:

```
npm run sync:archive
```

If the archive later needs faster freshness, the same command can be scheduled more frequently without changing the application architecture. RSS conditional requests and feed retry backoff reduce unnecessary transfer.

## Generated transcription cost guard

Generated transcription is disabled by default. It requires both:

```bash
TRANSCRIPTION_ENABLED=true
OPENAI_API_KEY=...
```

The worker is additionally bounded by:

- `TRANSCRIPTION_MAX_EPISODES_PER_RUN`
- `TRANSCRIPTION_MAX_ATTEMPTS`
- `TRANSCRIPTION_RETRY_DELAY_MINUTES`
- `TRANSCRIPTION_MAX_AUDIO_BYTES`
- `TRANSCRIPTION_TIMEOUT_MS`

Publisher transcripts always take priority and are never replaced by generated text.

## Health endpoints

- `/api/health/live` — process liveness only; does not touch PostgreSQL.
- `/api/health/ready` — database readiness plus feed and archive diagnostics.
- `/api/health` — backward-compatible alias with the readiness diagnostics.

Use the liveness endpoint when the hosting platform only needs to know whether the web process is responsive. Use readiness when database reachability matters.

## Private operations dashboard

The private dashboard is available at `/admin` after these values are configured:

```bash
ADMIN_PASSWORD=...
ADMIN_SESSION_SECRET=...
```

The session secret should be a long random value independent of the login password. The dashboard shows feed failures, staleness, retry state, transcript coverage, generated-transcription failures, and recent ingestion runs.

## Command-line status

For a machine-readable production snapshot:

```bash
npm run archive:status
```

This reports active/healthy/stale/failing feeds, latest successful ingestion time, episode count, transcript coverage, and unresolved transcript failures.

## Failure response

When `sync:archive` exits non-zero:

1. Run `npm run archive:status`.
2. Open `/admin` and identify the failing feed or transcript job.
3. For feed failures, inspect the publisher URL and the stored last error before forcing a retry.
4. For generated-transcript failures, check audio size, source availability, retry count, and provider configuration.
5. Do not clear failure state merely to make monitoring green; resolve the underlying source or configuration problem first.


## One-time bootstrap / recovery sync

If a newly provisioned production database has the registry but no episodes yet, temporarily set:

```bash
STARTUP_ARCHIVE_SYNC=true
```

The next web-service startup will seed the registry and then run `npm run sync:archive`. Feed failures are surfaced in logs but do not prevent the web process from starting. After the bootstrap run completes, set `STARTUP_ARCHIVE_SYNC=false` again so normal deployments do not perform a full archive sync.
