# Systematic podcast search across all former U.S. Congress members

## Canonical population
Use the publicly maintained [unitedstates/congress-legislators](https://github.com/unitedstates/congress-legislators) `legislators-historical.yaml` together with `legislators-current.yaml` and each subject's Biographical Directory ID (bioguide).

The October 10, 2026 snapshot of the historical file contained **12,231 people**. Cross-check IDs against current members to prevent duplicate classification. **1,436** of the historical members have a term ending in 1990 or later. This is **not** the number of podcast hosts.

Older members must remain present in the all-member census. Discovery prioritizes **2,716 potential podcast-era people** (served through or after 1990, or birth year 1900 or later) rather than automatically treating very old historical records as modern podcast hosts. Historical entries not automatically queried are still represented in the audit and are not labeled as having no podcast.

## Repeatable discovery
`scripts/discover-former-podcasts.py` can be run locally with Python 3.12 and PyYAML, or in GitHub Actions via `former-congress-podcast-census.yml`.

Examples:

```bash
python -m pip install PyYAML==6.0.2
python scripts/discover-former-podcasts.py --roster-only --out-dir census-results
python scripts/discover-former-podcasts.py --shards 8 --shard 0 --sleep 3 --out-dir census-results
```

The full workflow runs eight shards and uploads separate audit CSV and potential-match CSV artifacts per shard. It is available for manual dispatch and monthly reevaluation. Search failures remain visibly marked, never converted to negative findings.

Each potential hit records the member's stable ID, podcast title, publisher, Apple URL, feed URL, match reason, and the status `HOST_RELATIONSHIP_UNVERIFIED`.

## Editorial verification before a show enters FiresideChat

1. Confirm the subject is the *same person* as the congressional roster record; similar names are common.
2. Verify a sustained host, co-host, or officially produced-on-their-behalf relationship using podcast publisher metadata or the member's official site. Guest-only episodes do not qualify.
3. Obtain the **exact, show-specific RSS URL** from the podcast directory/publisher, not an inferred URL.
4. Verify that the returned feed has playable episodes with that host; reject multi-show network feeds unless ingestion is restricted to the relevant episodes and date range.
5. Record the exact verification source, date, role and publication status in `src/data/podcast-registry.ts`.
6. Run CI validation, merge, deploy, seed, ingest, and check the production failure log. Registration alone does not prove a show has been ingested.

Examples that require additional engineering rather than guessed feeds: Peter Roskam's *The Cloakroom* under a shared BakerHosts feed; Claire McCaskill's *How to Win 2024* under a repurposed feed; series whose hosts changed over time.

## Interpretation
**SEARCHED_NO_DIRECT_NAME_MATCH** means only that the name-query search found no literal match in indexed show title/creator. It is not proof no qualifying podcast exists. A second editorial search through official member pages, publishers, audio/video archives, alternate names, and network show listings is required for strong negative coverage.

Episode archival coverage is distinct from member discovery. Podcasts may have been canceled, migrated, paywalled, deleted, or published only as video. Such cases should be documented as source limitations, not silently erased.
