# E2EESA component/data-flow assessment — congressional podcast production inquiries

**Date:** 2026-10-10  
**Standard:** neophilism/End-To-End-Everywhere-Security-Architecture-Standard; normative language and terminology at current development HEAD. The upstream standard is undergoing AUD v2 remediation toward 0.9.0-rc.2. This implementation does **not** claim assessed 0.9.0-rc.1, 0.9.0-rc.2 or 1.0 conformance.

## Classification — inventory before security claims

This is a public form whose **intended recipient is the FiresideChat production-services operator**. No anonymous user cryptographic identity or peer-to-peer messaging session is established. The website backend necessarily reads the submitted form fields to route the business inquiry. Encrypting the saved payload using a service-controlled key is **server-side encryption**, as defined in spec/terminology.md, **not end-to-end encryption**. HTTPS protects browser↔service and service↔approved vendor hops, but HTTPS alone is not E2EE. We explicitly reject use of an unscoped “E2EESA compliant” label.

Classification may change only following an updated role/data-flow inventory and approved standard security profile. E2EE for a future optional confidential channel would require client-side encryption to operator-held recipient endpoints whose private keys are unavailable to ordinary server intermediaries, plus key verification, lifecycle and operational recovery work; it is not silently represented by this simple web intake.

## Component and protected-data inventory

| Component / boundary | Data accessed | Protection, recipient, or known limitation |
|---|---|---|
| Member or authorized staff browser | Member identity, state, district, staff role, office email, optional phone and message | HTTPS POST to FiresideChat. Browser sends plaintext to intended service recipient. Public website cannot authenticate actual congressional employment merely by receiving a claimed .gov address. |
| FiresideChat Next.js API | All submitted fields on arrival | Validates bounded fields, checks same-origin browser request, rate-limits by keyed hashes, avoids logging private body, ensures office email suffix matches chamber; rejects when at-rest encryption key unavailable. |
| Neon PostgreSQL inquiry table | Public office identity and timestamps; private encrypted payload | AES-256-GCM with 96-bit random nonce, authenticated tag, version marker, separately configured 256-bit secret. Queryable digest of contact email and IP are HMAC keyed from secret and should not be used for other products. A compromised server with the key can still decrypt; this is a documented server-side-trust limit. |
| FiresideChat authenticated admin | Full decrypted contact/message after login | Server-side decrypt on private SSR route with cookie authentication; do not publish data to public APIs or React client state outside protected admin view. No unauthenticated detail endpoint. |
| Resend transactional email API (optional) | Public officeholder name + state/chamber + link to private admin | TLS and verified sender; mail contains no submitted contact email, phone or message. Mail delivery is not guaranteed to be encrypted end-to-end; durable outbox and retry status preserve failures. Provider credentials are secrets. |
| Engine Room private server API | Unique self-reported congressional offices count and **public officeholder identification only** | Read-only token-authenticated endpoint, HTTPS and scoped 256-bit random shared secret, no contact email, phone or message; Engine Room renders the summary only inside authenticated dashboard and alerts views. No third-party audience data. |
| Engine Room website | Count, official names and chambers/states; links to private FiresideChat admin | Red conspicuous alert, unverified attribution label, server-only API token. No PII beyond officeholder public identity. |
| Logs/telemetry | Response status, request ID, delivery state, aggregate errors | No body, no API key, no ciphertext, no raw IP, no confidential signed link. Rate-limit hashed client identity is opaque to public readers. |

## Security controls and threats

1. **Endpoint and identity distinction:** the intended recipient is the service; official email suffix and declarations are not proof of actual role. Display **self-reported / not yet independently verified** until an approved challenge/office review policy is added. Do not send secure private material to a merely supplied address.
2. **Cross-site submission/abuse:** bound JSON request body, same-origin browser POST check, honeypot, per-client/office rate ceilings, email/office dedupe, server validation, constrained public form and read-only internal endpoint. These controls are useful but not a distributed bot-defense guarantee; monitor abuse and consider verified CAPTCHA only if needed and authorized.
3. **At-rest confidentiality/integrity:** encrypt only private contact/message fields under versioned AEAD before database insert. Key injected via Render environment, not GitHub, browser bundle or logs; tamper produces authenticated decryption failure. Officeholder names, chamber, state, district, creation time and keyed hashes remain metadata in plaintext. Backups inherit database exposure and require restricted backup access.
4. **Key lifecycle:** currently a single service secret. Protect its copy, back it up securely, limit Render/Neon access, and document rotation requirement as a future change with multi-key version support before rotating production ciphertext. Never rotate without a tested decrypt/migration path.
5. **Sender/recipient verification:** email outbox is durable and avoids mailing full contact/message content. Delivery is best-effort until a verified sender and provider API key are provisioned; no claim of delivery from successful form submission alone. Never embed Resend token in source or route to browser.
6. **Cross-service least privilege:** the separate shared token authorizes only GET of bounded public office summary, never contact details. Compare constant-time, reject missing or weak config, no-store/no-cache, HTTPS, fixed URL. Client browsers cannot invoke the server-only protected token.
7. **Retention/correction:** operator must establish a retention and deletion window for contact inquiries, including correction/deletion requests and audit, before handling significant production volumes. A disclosure and retention choice must not be silently inferred from normative E2EESA profiles.
8. **Supply chain/integrity:** follow current upstream dependency policies; security tests cover invalid form, tampered AEAD, unauthorized token, duplicate/rate and failure cases; deployment and actual browser-to-email-to-alert acceptance are separate requirements.
9. **Non-conformance / non-claims:** no forward secrecy, PQ resilience, key transparency, cross-device E2EE, identity authentication or independent certification is claimed for this feature.

## Operations acceptance

- Source review: data-flow inventory, scoped crypto key/transport decisions and audit limitations recorded in this document.
- Tests: valid and malformed House/Senate submissions, source-origin failure, bounded content, remote-office spoof claims, rate/dedupe, tampered AES-GCM ciphertext, missing secrets, unauthenticated Engine Room read, and no private data in the summary.
- Deploy: distinct keys configured privately, successful Prisma migration, no credentials in logs, secret scopes checked.
- Live: create a marked test inquiry only with an authorized real office contact or controlled staging test, verify Neon persistence and encryption, authorized admin detail, Resend recipient notification and Room red alert; remove staging test before any production count is portrayed as genuine.
- Preserve honest states: planned, PR merged, deployed, tested, email configured, email delivered and full E2E journey verified.

## Deferred hardening backlog

- Cryptographic key rotation/key ID and documented disaster recovery to prevent loss of stored inquiries.
- Optional challenge to the claimed congressional email and a verified officeholder roster to replace self-report status with confirmed identity.
- Record-level acknowledgements / manual review status, lifecycle retention and deletion, suspicious-rate monitoring, a less leakable admin audit, and optional durable cross-service alert polling if sleeping Render causes unacceptable latency.
- Formal E2EESA requirement-by-requirement independent assessment after upstream remediation and final applicable product profiles exist.
