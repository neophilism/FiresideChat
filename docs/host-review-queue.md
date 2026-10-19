# FC-P04 - official host and production evidence queue

The `HostReviewCandidate`, `HostReviewEvidence` and `HostReviewAudit` models and the server-side review route are a private editorial staging system. The queue is deliberately separate from `PodcastPerson`, verified show feeds and publication: **no submitted or verified queue entry automatically imports a feed, attributes an episode or publishes a person/show association**.

## Provenance and decisions

* Store an explicit official identity key (`BIOGUIDE:<seven-character-id>` or a stable `PRESIDENT:<identifier>`), independently cited identity URL, show key and title, claimed role, optional feed lead, and claimed role-effective start/end dates. Identical names are not an identity join.
* Each source citation has a URL, credited role/evidence kind, observed date and publisher excerpt. More than one source and more than one official per show are permitted. A network listing or guest appearance is categorically insufficient to prove hosting.
* All candidates start `PENDING`. Only an authenticated admin can append evidence or record a decision. Verification needs a role-matched citation and an explicit start date. `NEEDS_EVIDENCE`, guest exclusion and rejection remain distinct audit states.
* Every state revision creates an append-only audit row. Concurrent edits use an expected-revision update; stale operators must reload. The shared admin session can be authenticated but does not uniquely identify a human operator; do not claim individual attribution.
* The submitted dates are operator claims, **not independent live-world validation**. An approved identity/role/date record is still an editorial decision. Reviewers must inspect the original publisher and official source and cite evidence sufficient to justify that role *during the claimed period*. A show cannot be included based only on directory search, network ownership, guest status or name similarity.
* Per-episode checks must apply the period for each official separately, permitting overlapping cohosts while excluding pre-host episodes. Shared feeds, repurposed episodes and changed-host publication filtering belong to FC-P05; never infer archive coverage from this queue.

## Security and operational gates

The private mutation endpoint is `POST /api/admin/host-reviews` (form-encoded). It checks the existing admin session, strict same-origin POST, size and field validation, server-side role citation predicates and optimistic revisions. It does not fetch source URLs, send emails, use paid APIs or access private feeds. Never use this endpoint for automated approval from untrusted candidate feeds.

Schema is additive; apply the checked-in PostgreSQL migration through the normal deployment process. Do not call schema existence or a passing unit test proof of production data being migrated. Integration testing with an isolated PostgreSQL database and actual admin session remains necessary. No external/independent security review is claimed.

The pure reviewer contract is in `src/lib/host-review.ts`; negative/period/multi-host tests are in `tests/host-review.test.ts`. The main repository validation CI is authoritative for the exact committed head only; tests not included by its command must be run separately or included in the scripted suite. Unverified entries must never be auto-enabled or advertised as verified official podcasts.

Unapproved role dates and the claimed role can be amended via the private form with a revision check and `CLAIM_AMENDED` audit entry. Once a candidate has been verified, rejected or excluded, updates are closed; corrections need a new explicitly reviewed candidate rather than silent overwrites.

The authenticated operations view supports status-specific pending/needs-evidence/approved/guest-excluded/rejected queues with stable pagination. Verification and rejection always require distinct evidence and audited operator action.

`approvedHostsForEpisode` projects separately authenticated role/date decisions into a read-only per-episode official-key list; it cannot write a person/show link. It deduplicates the same official on a shared show and excludes guest-only and pre-host episodes.

Rejection is also source-backed: without a timely citation, operators must request more evidence rather than entering a final negative verdict. Network-only credits and guest appearances cannot silently prove a host relationship.
