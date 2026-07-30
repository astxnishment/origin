# Origin Repairs Launch Remediation

Updated 29 July 2026. This document records the launch-readiness work completed
in the repository and the decisions still requiring the business owner or a
qualified professional.

## Current Architecture

- Next.js 16.2.12 App Router, React 19 and TypeScript.
- `lib/repairPricing.ts` is the structured source import.
- `lib/repairCatalogue.ts` is the canonical public catalogue used by repair
  pages, calculators, pricing, booking quotes, metadata and the sitemap.
- `lib/business-config.ts` owns business facts, verified trust links and public
  feature flags.
- `lib/warranty.ts` normalises repair-specific warranty values.
- Booking and contact submissions are validated and processed server-side.
- Local fonts and compressed WebP service artwork avoid runtime image/font CDN
  dependencies.

## Remediation Log

| Issue | Priority | Resolution | Verification |
| --- | --- | --- | --- |
| Invented reviews and ratings | P0 | Removed placeholder customers, counts, scores and rating schema. Trust UI requires configured verified links. | Claim scan, unit and browser tests |
| Unverified operational claims | P0 | Centralised business facts and disabled walk-ins, mail-in, tracking and accounts by default. | Feature-flag tests |
| Blanket warranty promises | P0 | Repair-specific warranty values with clear installation/workmanship causation wording. | Warranty tests and claim scan |
| Mock accounts | P0 | Removed browser-only auth state, routes and navigation. | Route and navigation tests |
| Demo repair tracking | P0 | Removed sample customer data and public links; `/track` is noindex and unavailable. | Source scan and browser tests |
| Unsafe form handling | P0 | Added Zod validation, body limits, escaping, honeypots, timing checks, rate limits, idempotency and optional Turnstile. | API unit tests |
| Browser-controlled prices | P0 | Server recalculates price, time and warranty from the canonical catalogue. | Quote and API tests |
| False email success | P0 | Success is returned only after the business notification is accepted. | API tests |
| Preview indexing/email risk | P0 | Added environment-aware noindex, canonical URL handling and explicit production operation/email switches. | Deployment and sitemap tests |
| Duplicate repair datasets | P1 | Removed four stale catalogues and routed all public journeys through one compatibility-aware catalogue. | Catalogue tests and production build |
| Invalid SEO combinations | P1 | Only visible, compatible brand/model/repair/tier URLs are generated; unknown combinations return 404. | Route tests and build output |
| Overloaded calculators and booking | P1 | Added progressive selection, model search, explicit tiers and a three-stage booking request. | Multi-viewport browser tests |
| Sensitive draft persistence | P1 | Persists only service/date selections for the browser session; never contact details, issue notes or return addresses. | Browser tests and source review |
| Map/privacy overhead | P1 | Google Maps iframe loads only after user interaction. | Browser inspection |
| Missing error states | P1 | Added loading, not-found and error recovery pages. | Browser tests |
| Asset and route bloat | P2 | Replaced large service PNGs with WebP assets and reduced generated pages from 1,777 to 451. | Production build |
| Theme and mobile layout defects | P2 | Added system-first no-flash theme, safe-area spacing and overlap tests at 320px and 390px. | Browser tests |
| Missing quality gates | P2 | Added lint, typecheck, unit, build, Playwright and axe checks to GitHub Actions. | Local suite and workflow review |

## Final Verification

- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run test:unit`: 25 tests passed across 7 files.
- `npm run test:e2e`: 38 checks passed across desktop, 320px mobile,
  390px mobile and tablet; 2 desktop/tablet checks intentionally skipped
  because they test the mobile-only action bar.
- `npm run build`: passed and generated 451 pages.
- Automated axe checks: no automatically detectable violations on major pages.
- `npm audit --omit=dev`: 0 known production vulnerabilities.
- Full dependency audit: 9 development-only advisories remain in ESLint's
  `minimatch`/`brace-expansion` chain. npm's forced proposal downgrades
  `eslint-config-next` from 16 to 12, so it was rejected. Recheck when the
  current Next lint stack publishes a compatible resolution.
- Lighthouse and field Core Web Vitals were not measured in this local audit.
  Run them against the final production domain after environment configuration.

## Production Environment

Required or intentionally explicit:

- `NEXT_PUBLIC_SITE_URL`
- `PRODUCTION_OPERATIONS_ENABLED=true`
- `SITE_INDEXING_ENABLED=true`
- `SITE_CONTENT_LAST_MODIFIED`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `BOOKING_NOTIFICATION_EMAIL`
- `CONTACT_NOTIFICATION_EMAIL`
- `BOOKING_EMAILS_ENABLED=true`
- `CONTACT_EMAILS_ENABLED=true`

Optional feature and trust configuration:

- `NEXT_PUBLIC_BOOKING_ENABLED`
- `NEXT_PUBLIC_WALK_INS_ENABLED`
- `NEXT_PUBLIC_MAIL_IN_ENABLED`
- `NEXT_PUBLIC_TRACKING_ENABLED`
- `NEXT_PUBLIC_ACCOUNTS_ENABLED`
- `NEXT_PUBLIC_GOOGLE_BUSINESS_URL`
- `NEXT_PUBLIC_TRUSTPILOT_URL`
- `NEXT_PUBLIC_VERIFIED_REVIEW_COUNT`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`

Keep indexing and outbound email switches off until the production URL, business
details and recipient addresses have been verified.

## Owner Verification Required

- Trading identity, physical address, telephone number and email.
- Opening hours and whether customers may visit or drop off without a booking.
- Which parts and service tiers are stocked, their genuine/OEM-equivalent
  descriptions and the prices currently offered.
- Warranty coverage, diagnostic charges, data-recovery terms and liquid-damage
  limitations.
- Google Business Profile, review count and any Trustpilot profile.
- Whether mail-in service will launch, plus insured shipping, intake, return and
  abandoned-device procedures.

## Professional Review Required

- UK privacy notice, lawful bases, processors and retention schedule.
- Consumer repair terms, warranty exclusions and limitation wording.
- Data-recovery consent and handling terms.
- Mail-in transit risk, insurance, ownership and abandoned-device terms.

## Deferred Backend Work

- Durable database records for booking/contact requests and audit history.
- Shared Redis/database rate limiting and idempotency for multi-instance hosting.
- Calendar capacity and transactional time-slot locking.
- Durable email retry queue, delivery monitoring and operational alerting.
- Real customer accounts and authenticated repair tracking, if the business
  chooses to offer them.
- Verified review ingestion rather than manually configured trust figures.
- Consent-aware analytics, error monitoring and production Core Web Vitals.
