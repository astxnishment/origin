# Cloudflare migration

Updated 29 September 2026. The informational, contact-only website is live on Cloudflare at **[originrepairs.com](https://originrepairs.com)**. The CLI confirmed deployment to `originrepairs.com` and `www.originrepairs.com`. The existing Vercel deployment is untouched and remains available for rollback.

The owner selected **Clerk authentication** for future website accounts and supplied a **tawk.to** widget for human customer/staff chat. Tawk replaces the earlier proposal for a custom Cloudflare inbox; Cloudflare remains the website host. Clerk integration and credentials are still pending. The Tawk widget is deployed and renders on desktop and narrow mobile screens. Staff availability, real two-way delivery and offline-message receipt remain unverified.

## Verified deployment record

- Cloudflare version: `9e19d24d-230b-4a68-b899-9e41ac75a1f2`, deployed 29 September 2026 to the `.com` and `www` domains.
- Live `https://originrepairs.com` returned HTTPS 200 with Content Security Policy and HSTS. `/support/chat` returned 200 with the supplied embed URL, embedded container, CSP and `Cache-Control: private, no-store`.
- The real Tawk widget rendered on desktop and at 320px width without browser errors. Provider status reached the first-party panel. No conversation or offline message was sent; status reporting does not prove staff availability.
- Local typecheck, lint and all 296 unit tests passed. The Cloudflare build and runtime typecheck passed; 40 Cloudflare browser checks passed, with two duplicate API-probe cases intentionally skipped. This records local checks, not a final CI result. The preceding migration dependency audit reported zero vulnerabilities.
- Live empty-request probes to `/api/contact`, `/api/booking`, `/api/auth/magic-link` and `/api/admin/repairs` all returned 503. No customer data or real messages were submitted.
- Earlier migration verification confirmed canonical metadata, client navigation, the generated `origin-repairs.blentiugov.workers.dev` HTTPS address, HTTP-to-HTTPS 301 and `www`-to-apex 308 preserving path and query. Cloudflare Always Use HTTPS remains enabled. Use `.com` as the public address.

These checks record the deployed contact-only website with explicit Tawk chat enabled. Booking, mail-in requests, customer accounts, tracking, Clerk, website outbound email, database writes and indexing remain disabled. Widget loading does not establish real message delivery or acceptance of repair requests.

## Current implementation

The existing Next.js 16 app remains available alongside the Cloudflare migration. `vinext` 1.0.0 provides the Workers build path; `cf` 1.0.0-beta.5 is the pinned Cloudflare CLI. Use the lockfile instead of installing an unreviewed newer CLI during deployment. The beta CLI and framework migration need their own runtime checks; a successful Next.js build does not verify Workers compatibility.

| File | Responsibility |
| --- | --- |
| `cloudflare.config.ts` | Worker, asset binding, compatibility settings and observability configuration |
| `vite.config.ts` | vinext/Cloudflare build integration |
| `scripts/cloudflare-environment.mjs` | Shared non-secret settings for the browser build and Worker runtime |
| `scripts/cloudflare.mjs` | Build/preview/deploy wrappers that apply the safe profile and run the readiness gate |
| `playwright.cloudflare.config.ts`, `tests/cloudflare/` | Browser checks against the built local Worker |
| `.github/workflows/cloudflare.yml` | Build and local Worker verification; it does not deploy the site |

The shared profile sets:

```dotenv
HOSTING_PROVIDER=cloudflare
DEPLOYMENT_ENV=production
NEXT_PUBLIC_SITE_URL=https://originrepairs.com
NEXT_PUBLIC_CONTACT_ONLY=true
PRODUCTION_OPERATIONS_ENABLED=false
SITE_INDEXING_ENABLED=false
EMAILS_ENABLED=false
REPAIR_WRITES_ENABLED=false
ALLOW_PREVIEW_EMAILS=false
ALLOW_PREVIEW_REPAIR_WRITES=false
```

All booking, walk-in, mail-in, tracking and account feature flags remain `false`. The deployed Tawk integration has one explicit exception:

```dotenv
NEXT_PUBLIC_LIVE_CHAT_ENABLED=true
NEXT_PUBLIC_TAWK_PROPERTY_ID=6abc1fa0926103343dfe973b
NEXT_PUBLIC_TAWK_WIDGET_ID=1k3ndn318
```

The widget identifiers are public. This opt-in must pass configuration validation while all other contact-only safeguards remain in force. Shared settings override the invoking shell's values in the Cloudflare wrappers, including removal of a stale `VERCEL_ENV`. Editing a dashboard setting or adding credentials does not override this reviewed profile. Changing a public feature requires a new build and aligned Worker settings.

Metadata uses the verified `.com` canonical. No wildcard `workers.dev` address is accepted as a production canonical. Contact-only validation also retains the exact `https://origin-peach.vercel.app` address for Vercel compatibility.

Contact-only mode rejects website contact-form submissions before reading customer data and disables accounts, repair submissions, database writes and website outbound email. The explicit Tawk opt-in permits customer-initiated chat without enabling those services; Tawk handles its own conversations and staff notifications. Public repair information, images, estimates, phone and WhatsApp contact remain available. Search indexing stays off until the canonical public release is reviewed.

## Build and verify before deployment

Use Node.js 22 or 24 and the committed lockfile:

```sh
npm ci
npm run check
npm run build:cloudflare
npx playwright install chromium
npm run test:cloudflare
```

For manual inspection of the already built Worker:

```sh
npm run preview:cloudflare -- --host 127.0.0.1 --port 3109
```

Use `build:cloudflare`, `preview:cloudflare` and `deploy:cloudflare` for this release. The lower-level `*:vinext` commands do not apply the shared safety profile. Authenticate to the intended Cloudflare account and review the target Worker before an authorized deployment:

```sh
npm run deploy:cloudflare
```

This last command changes the hosted service; building or previewing does not. The deployment gate checks configuration shape, not account access, DNS, credentials or delivery. For each subsequent release, verify HTTPS, images/fonts, navigation, canonical metadata, CSP nonces, security headers, noindex, and direct rejection of disabled API routes. Preserve the known working deployment until its replacement passes verification.

## Work required before full services

### Clerk accounts

- Add and validate the Clerk integration under the selected vinext/Workers runtime. The current code still uses its own email-link tokens and `origin_customer_session` cookie.
- Replace the server session boundary used by account pages, tracking and staff APIs. Require a verified account email when matching existing repair ownership; do not trust a client-supplied email or grant staff access merely because someone signed in.
- Preserve the owner-approved staff allowlist or implement an equivalent server-enforced role policy. Decide how existing sessions and repair ownership are migrated.
- Compose Clerk middleware with the current proxy behavior. The existing proxy excludes API routes; authenticated APIs need coverage and explicit authorization. Preserve canonical redirects, nonce propagation, security headers and the isolated chat route.
- Add the selected Clerk instance's CSP sources and test sign-in/out, expiry, cross-account denial, staff denial, redirects and API requests in the Worker runtime.
- Configure the Clerk publishable key, server-only secret and production domain only after integration exists. Never place the secret in a `NEXT_PUBLIC_*` variable or a committed file.

### Human chat through Tawk

The owner-supplied widget uses Tawk for conversation storage and the staff inbox. The previous custom Cloudflare/Durable Object inbox proposal is superseded and is no longer a launch dependency. This integration does not require Clerk or repair-database access.

- Apply the public widget identifiers through the reviewed build/runtime profile and test the real embed under the iframe's Content Security Policy. No arbitrary script URL or provider secret should be accepted in the public settings.
- Keep Tawk's `embedded: 'origin-tawk-container'` configuration and full-size container inside `/support/chat`. This makes the vendor UI fit the existing panel, including the verified 320px layout, rather than positioning a floating widget within a narrow iframe.
- Retain explicit Start chat activation, removal of the iframe on close/navigation, private-route exclusions and the absence of injected account identity or repair data. The same-origin iframe limits the provider's lifetime; it is not a security sandbox against Tawk.
- Configure the intended team property, staff permissions, notifications, actual staffed hours and honest offline handling. A connected widget does not prove someone is available to reply.
- Confirm provider consent settings, privacy disclosures and retention/deletion procedures. Closing the panel does not erase Tawk conversations or provider cookies.
- Verify a real two-way customer/staff conversation and offline-message receipt before claiming delivery. Widget IDs, a rendered launcher and mocked tests alone are insufficient.

Follow the current [Tawk setup guide](LIVE-CHAT.md). No paid add-on, hired agent or AI chatbot is part of this update.

### Repair database, email and spam protection

- Refactor the globally cached PostgreSQL client in `lib/server/repairStore.ts` to use request-scoped Workers connections. Configure a production PostgreSQL service and, if using Hyperdrive, its binding with **query caching disabled** for repair reads and writes. Customers and staff must see committed status updates immediately.
- Apply the tracked schema using the controlled migration command, restrict database access, configure backups and verify restore into a separate database. Tawk conversation storage does not replace the existing PostgreSQL repair schema.
- Preserve transactional booking idempotency, customer filtering, append-only status history and stale-update rejection. Contact replay and rate limits currently use isolate-local Maps; they are not global Worker guarantees.
- `HOSTING_PROVIDER=cloudflare` trusts only a valid `CF-Connecting-IP`. Missing or malformed values fail rate-limit and Turnstile checks without falling back to forwarding headers. Direct local tests of enabled forms must deliberately supply test headers or use a generic local host profile.
- Configure real email delivery and both Turnstile keys for `originrepairs.com`. Retain server-side hostname verification and challenge recovery. Verify controlled inbox delivery; successful API responses alone are insufficient.

The business contact mailbox is still `tech@originrepairs.co.uk` pending owner confirmation; domain ownership does not establish a replacement mailbox. Do not substitute a guessed `.com` address. A future operational release requires an explicitly configured, verified `.com` sending address under the current gate.

## Domain, operations and rollback

`originrepairs.com` and `www.originrepairs.com` are attached to the deployed Worker. Preserve existing MX/TXT email records when maintaining domain routing. Keep secrets in the provider's secret settings and separate test resources from production data.

Before removing contact-only mode, complete the remaining implementation and acceptance work above and the business checks in [DEPLOYMENT.md](DEPLOYMENT.md). Replace the readiness gate's custom-auth requirements when Clerk is integrated; keep the validated Tawk requirements for the chosen chat provider. Do not set dummy legacy auth values to bypass the gate. Chat has a separate explicit opt-in during contact-only mode; each enabled service must have matching server behavior, UI and build/runtime flags.

Retain the last working Vercel deployment and record the pre-cutover domain routing. If verification fails, keep or restore that known deployment without blindly reverting database schema or losing accepted records. Keep operations and indexing disabled throughout the migration until their own acceptance checks pass.

Official references: [vinext migration](https://github.com/cloudflare/vinext/blob/main/.agents/skills/migrate-to-vinext/SKILL.md), [Workers Node environment behavior](https://developers.cloudflare.com/workers/runtime-apis/nodejs/process/), [Postgres.js with Hyperdrive](https://developers.cloudflare.com/hyperdrive/examples/connect-to-postgres/postgres-drivers-and-libraries/postgres-js/), [Hyperdrive cache behavior](https://developers.cloudflare.com/hyperdrive/concepts/query-caching/), [Clerk setup](https://clerk.com/docs/nextjs/getting-started/quickstart), [Clerk CSP](https://clerk.com/docs/guides/secure/best-practices/csp-headers).
