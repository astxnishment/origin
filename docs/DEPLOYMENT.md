# Origin Repairs launch plan

Prepared 22 September 2026; hosting and live-chat setup updated 25 September 2026. This records the implemented release and the remaining real-service setup. No public deployment, hosting purchase, DNS change or real email has been performed.

## Release status

The owner supplied the operator name **Origin Repairs** and selected **both mail-in and live tracking**. These services are implemented. Hosting, a production PostgreSQL database, verified email delivery, production spam-protection keys and approved staff addresses are still needed. The existing Leeds address and other business details have been preserved; the owner's name reply did not independently confirm the address.

The owner requested a provider other than Vercel on 25 September. The replacement provider and budget are pending. The application now supports an explicit `DEPLOYMENT_ENV` on other Node.js hosts while retaining Vercel compatibility. No plan is purchased by this work.

Release destination check on 25 September: GitHub records an existing Vercel production deployment for `main` commit `1aad4fff971720e37275bc497247a732ca0e9853` (deployed 3 August). Its deployment URL redirects to Vercel sign-in, and `originrepairs.co.uk` did not resolve from the release environment. GitHub access works. Publishing to the existing connection remains pending clarification because the owner requested another host. The local deployment check still reports missing production configuration; do not treat the old successful deployment as verification of the new services.

Use a Node.js host with managed HTTPS, a canonical custom domain and persistent PostgreSQL. Production stage detection, redirects, staff origin protection and spam/write controls are portable. Verify the selected host's proxy/header and domain configuration before launch. Static-only hosting cannot support these features.

## Implemented scope

| Area | Behavior |
| --- | --- |
| Device catalogue | Current iPhone, Samsung, Pixel, MacBook, iPad and Galaxy additions; unpriced new models require assessment, with no invented repair prices or turnaround promises |
| Navigation and images | One iPhone model-selection page; old links retain selections; current MacBook and mixed iPhone/Samsung service image; compact menu on tablets |
| Quotes and requests | Compatible device/repair prefills, server-verified pricing and eligibility, Leeds-local opening hours and dates |
| Mail-in | Return-address capture, acceptance required before dispatch, shipping and return arrangements agreed by the team |
| Tracking | PostgreSQL repair record and reference, private customer timeline linked to verified email, automatic refresh every 30 seconds while visible |
| Staff dashboard | Email allowlist, manual intake, search, customer-visible status notes and history; concurrent stale updates rejected |
| Email | Business notification and customer receipt; saved repairs remain visible to staff if notification delivery fails |
| Accounts | Signed email links and 30-day secure sessions, restricted return paths, logout; no password database |
| Live chat | Customer-initiated embedded tawk.to conversation, provider availability and offline message support, contact fallback, no chat on private pages; account connection and real inbox test pending |
| Reliability and protection | Bounded input, server access controls, spam challenge recovery, explicit production write controls and retry protection |
| Search and accessibility | Page-specific metadata, private routes excluded from indexing, keyboard access, responsive and light/dark accessibility checks |

Tracking reflects staff updates; it does not locate devices or automatically detect bench work. Status changes appear on the website. Automatic status-change emails are not implemented. Staff must monitor the dashboard, including requests whose notification email failed.

## 1. Complete business setup

- Confirm the preserved address **76 Cookridge Street, Leeds LS2 8GL**, telephone **+44 7768 426754**, and inbox **tech@originrepairs.co.uk**. Record the correct legal operator details if anything beyond the supplied name is required.
- Confirm prices, part descriptions, turnaround estimates, opening hours, warranty terms and the drop-off procedure. New devices are enquiries until parts and repair pricing are agreed.
- Nominate the staff email addresses allowed to manage repairs. There is no default staff access. Protect those email accounts and remove departed staff from the allowlist.
- Confirm packing instructions, accepted devices, postage responsibility, insurance, returns and when a mail-in request is accepted. Customers are told to wait for instructions before shipping.
- Check the public policies against actual business procedures, including distance-contract acceptance/cancellation and retention. [Policy review](POLICY-REVIEW.md) records sources and specific operational checks; it is not a legal certification.
- Review image source records and [the catalogue review](DEVICE-CATALOGUE-REVIEW.md).

## 2. Configure hosting and services

For a managed Node.js host: use the project root, Node.js 22 or 24, locked install `npm ci`, build `npm run build`, and start `npm run start -- --hostname 0.0.0.0 --port "$PORT"` using the port supplied by the host. Terminate HTTPS at the managed proxy and configure the canonical domain. Separate production and preview secrets. Use a separate staging database; previews must never share the customer database or production authentication secret.

| Variable | Production value |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://originrepairs.co.uk` |
| `DEPLOYMENT_ENV` | `production` for the intended public release; `preview` during setup |
| `PRODUCTION_OPERATIONS_ENABLED` | `true` after operational setup is verified |
| `EMAILS_ENABLED` | `true` |
| `ALLOW_PREVIEW_EMAILS` | `false` |
| `RESEND_API_KEY` | Real secret for the verified sending domain |
| `RESEND_FROM_EMAIL` | Verified sender at `originrepairs.co.uk` |
| `TURNSTILE_SECRET_KEY` | Production-domain secret |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Matching public widget key |
| `DATABASE_URL` | Production PostgreSQL connection URL with provider-required TLS |
| `REPAIR_WRITES_ENABLED` | `true` after migration and operational approval |
| `ALLOW_PREVIEW_REPAIR_WRITES` | `false` |
| `STAFF_EMAILS` | Comma-separated, owner-approved staff email addresses |
| `AUTH_SECRET` | Dedicated random secret of at least 32 characters |
| `AUTH_BASE_URL` | `https://originrepairs.co.uk` |
| `NEXT_PUBLIC_BOOKING_ENABLED` | `true` |
| `NEXT_PUBLIC_MAIL_IN_ENABLED` | `true` |
| `NEXT_PUBLIC_TRACKING_ENABLED` | `true` |
| `NEXT_PUBLIC_CUSTOMER_ACCOUNTS_ENABLED` | `true` (tracking requires accounts) |
| `NEXT_PUBLIC_WALK_INS_ENABLED` | `false` unless availability is confirmed |
| `SITE_INDEXING_ENABLED` | `false` during acceptance; `true` for final reviewed public release |
| `SITE_CONTENT_LAST_MODIFIED` | Actual content revision date, currently `2026-09-25` |
| `NEXT_PUBLIC_LIVE_CHAT_ENABLED` | `true` once the inbox is configured, or explicitly `false` to omit chat |
| `NEXT_PUBLIC_TAWK_PROPERTY_ID` | Public 24-character property identifier from tawk.to |
| `NEXT_PUBLIC_TAWK_WIDGET_ID` | Public widget identifier from tawk.to |

Other hosts use `DEPLOYMENT_ENV`. Vercel supplies `VERCEL_ENV`, which takes precedence if present so previews cannot be promoted by a generic flag. `NODE_ENV=production` is not sufficient to activate live operations. All `NEXT_PUBLIC_*` values are compiled into the browser: rebuild after changing them. Leave review-profile URLs blank until verified. `.env.local.example` is a template and contains no usable live credentials.

Connect and verify the customer chat inbox using [the live-chat setup guide](LIVE-CHAT.md). The UI and mocked tests do not establish that staff are available or that messages reach the real inbox.

25 September verification: the updated portable-host controls and chat integration pass 213 unit tests, TypeScript, lint and production build checks. Chat browser coverage includes 50 distinct cases across the default and simulated-provider configurations; the final ordinary build is restored. This does not change the outstanding hosting, account, database, email, domain and owner-operation requirements.

Production builds run `deploy:check` automatically. The same check can be run manually without sending messages or printing secrets. It verifies configuration shape and required controls, not credential validity, DNS, database readiness or inbox delivery. The tracking APIs separately require explicit permission to write records. Non-production writes require `ALLOW_PREVIEW_REPAIR_WRITES=true`; enable it only for controlled staging/local tests.

Preview defaults: production operations, indexing, email delivery and database writes all off. Keep `ALLOW_PREVIEW_EMAILS=false`. Provider abuse protection and Turnstile are necessary because in-memory rate limits are per instance.

## 3. Prepare the production database

1. Create a persistent PostgreSQL database in the agreed region with restricted credentials and provider-required TLS. Record the provider, access controls, processing region, retention and costs.
2. Configure the intended `DATABASE_URL`, take an appropriate backup if it contains existing data, and run `npm run db:migrate`. This applies `db/migrations/001_repairs.sql`; application requests never create or alter tables. Initial schema creation is repeatable, but existing incompatible tables need a reviewed migration.
3. Run `npm run db:check`. It verifies connectivity and every required column without reading customer records.
4. Enable automated backups and agree a retention/recovery target. Perform a restore into a separate database before launch. [PostgreSQL backup documentation](https://www.postgresql.org/docs/current/backup.html) describes the supported approaches.
5. Keep runtime access limited to the required database; restrict dashboard/provider access. Define a process for retention review, export/correction and deletion/anonymisation consistent with the privacy notice and backup expiry. No automatic retention job is configured.

Bookings use unique request keys and payload hashes in a database transaction. Status updates append history and reject stale versions. A saved booking is the request record even when email fails. Provider email keys supplement retry protection for up to [Resend's documented retention window](https://resend.com/docs/dashboard/emails/idempotency-keys); API acceptance alone does not prove inbox delivery.

## 4. Run release checks

```sh
npm ci
npm run check
npm audit --omit=dev --audit-level=high
npm run db:migrate
npm run db:check
npm run build
npx playwright install chromium
npm run test:e2e -- --workers=1
```

Use a local test database, not production, for the automated suite. CI supplies PostgreSQL 16 on port 55432 and enables the intended mail-in/tracking/account flags. Integration tests require `TRACKING_INTEGRATION_TEST=true`, `ALLOW_PREVIEW_REPAIR_WRITES=true`, `EMAILS_ENABLED=false`, empty Turnstile variables, a localhost PostgreSQL URL on port 55432, a dummy `AUTH_SECRET` of at least 32 characters and `STAFF_EMAILS=teststaff@example.com`. They create synthetic records and remove those test records afterwards. Never use the dummy secret in a deployed service.

The browser suite runs a separate production server on port 3108 across desktop, 320px, 390px and tablet. It covers public pages/images, canonical metadata, quotes, forms, mobile navigation, contrast and keyboard access. Tracking checks exercise the actual database, customer isolation, staff permissions, status updates, manual intake and mail-in persistence/retries. A separate build with a nonempty `NEXT_PUBLIC_TURNSTILE_SITE_KEY` runs `tests/e2e/turnstile-retry.spec.ts`; its widget and delivery endpoints are mocked so no external messages are sent.

## 5. Verify real services and staff operations

- Verify the sender domain with Resend and preserve existing email DNS records. Confirm that the business inbox is monitored. Configure delivery/failure alerts without logging customer message bodies or credentials.
- Configure both Turnstile keys for the real hostname. Test successful verification and expired/failed challenge recovery. Production requires a matching widget hostname.
- With explicit authorization, send a clearly labelled contact message and repair request using controlled addresses. Check the business notification, customer receipt, reference, model, estimate wording and service method. No real messages were sent by the local audit.
- Verify real sign-in link delivery, expiry/tampering rejection and logout. Sign in as an approved staff member at `/admin/repairs`, update a test repair, then check its customer timeline at `/track` using the matching customer email. Verify a different customer cannot view it.
- Test a mail-in request and the staff acceptance/shipping instructions process. The form records a request; it does not accept the device for shipment or confirm an appointment automatically.
- Check a database outage and an email failure: failed persistence must not claim acceptance; a saved request with email failure must remain in the staff dashboard. Assign staff to check new requests there even without an inbox alert.

## 6. Attach the domain and release

Add `originrepairs.co.uk` and `www.originrepairs.co.uk` to the chosen host using its exact DNS instructions. Preserve MX/TXT email records. Verify HTTPS, the www-to-apex redirect, canonical metadata and security headers. Keep staging deployments private/noindex.

Build with the approved configuration, complete the live acceptance checks, then enable indexing and rebuild the final public release. Verify robots permits public pages, sitemap includes intended services and excludes accounts/admin/tracking, and the final hostname loads correctly on mobile. Keep a known working deployment for rollback. Submit the sitemap through the owner's search-console account when ready.

## 7. Monitor and recover

Assign someone to monitor the staff dashboard, business inbox, host/database health and email failures on launch day. Check the first genuine requests and status updates. Recheck dependencies on later releases.

To stop new repair writes during an incident, set `REPAIR_WRITES_ENABLED=false` and apply the host's runtime/redeployment procedure. Leave telephone/email contact routes available. Restore the last working application deployment when appropriate; do not roll back database schema blindly. Restore backups only through the agreed recovery procedure. Feature flag changes require a rebuild to update navigation and browser behavior.

## Verification record

Verified locally on 22 September 2026:

| Check | Result |
| --- | --- |
| TypeScript, lint and unit/database/security checks | Passed; 143 tests across 18 files |
| Public browser checks | 100 passed across desktop, 320px, 390px and tablet; 4 mobile-only cases intentionally skipped on larger screens |
| Public pages and assets | 22 pages per viewport; unique canonicals, loaded images, no horizontal overflow or captured page exceptions |
| Public accessibility | Light and dark checks passed on all 22 pages at each viewport, including contrast and visible link distinction |
| Tracking integration | 17 passed; 3 repeated mail-in submissions intentionally skipped on non-desktop projects |
| Spam-check recovery | 16 passed across all four viewports: contact delivery/lost-response retries, booking retry and sign-in retry; widget and endpoints mocked |
| Tracking access and interface | Real mail-in form, persistent reference, retry/conflict handling, manual intake, customer isolation, staff updates, safe note rendering and customer/staff accessibility/overflow checks passed |
| Database setup | Initial migration applied twice safely; connection/required-column check passed |
| Production dependency audit | No known vulnerabilities reported |
| Production build | Passed; final standard configuration restored after the separate spam-check tests |
| Diff/whitespace checks | Passed |
| Live production configuration | Still requires hosting, database, real credentials, staff allowlist and explicit launch settings |
| External delivery, domain and backup restore | Not verified; requires selected services and the controlled live checks above |

These counts record the final passing coverage across the release run and focused reruns after fixes. The local database tests used PGlite's PostgreSQL engine and wire server with the actual production driver; they are not proof of full managed-PostgreSQL concurrency, availability or backup recovery. CI is configured to repeat the suite against PostgreSQL 16. No CI run is claimed here.

Automated accessibility checks supplement visual and keyboard review; they do not certify full accessibility compliance. Mocked delivery and disabled external email do not establish inbox delivery. Public launch remains dependent on the real-service and owner checks above, regardless of automated results.
