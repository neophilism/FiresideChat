# Former Congress podcast census — editorial checkpoint (2026-10-11)

Source discovery: GitHub Actions run 38047722108 (eight successful shards; original commit 21f9cee). The source roster contained 12,231 historical Bioguide IDs. The podcast-era screening queried 2,716, leaving 9,515 retained for historical review. The original Apple lookup generated 6,271 unverified Bioguide–Apple associations with zero recorded API failures. All hits are only discovery leads.

PR #46 (merge commit 7c04488e) improved narrative-description matching *after* the eight-shard run. Do not treat the original run as a scan using the new algorithm. A full post-#46 eight-shard run is outstanding.

Editorial review through pass 15: 167 unique Bioguide–Apple associations adjudicated, 6,104 of the original candidate associations left for adjudication. Twenty-four distinct publisher-verified or unresolved program leads remain in a separate, non-ingesting validation queue. These are not live registrations or proof of episode retrieval.

Verification gates: same congressperson's Bioguide ID; independent publisher-supported host or cohost role; show-specific RSS validated for XML, audio enclosure and ownership; episode-scoped filtering for shared/repurposed feeds; duplicate prevention against current registry and existing episode GUIDs. Name-only, guest-only or network-level matches must not be attached.

Progress keys: Bioguide ID + Apple track ID for discovery dispositions, with separate one-to-many mapping for alternate Apple IDs pointing to a common canonical show-specific feed. Preserve publisher sources, date, previous status and reason for reclassification. Avoid copying exported artifact ZIPs into git.

Next: trigger full discovery on a post-#46 SHA, verify all eight shard artifacts; process a priority queue of the remaining 6,104 leads, then open small independent registry PRs with CI and verified production follow-through. Any staging entry remains inactive until the ingestion gate passes.
