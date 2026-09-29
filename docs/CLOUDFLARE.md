# Cloudflare migration

Updated 29 September 2026. The owner selected Cloudflare and confirmed **originrepairs.com** as the main domain. The migration currently targets an informational, contact-only website. Cloudflare production deployment, domain routing and live acceptance still need verification; this document is not evidence that a deployment succeeded. Keep the existing Vercel deployment available for rollback.

The owner also requested **Clerk authentication** and a **Cloudflare-hosted human staff/customer chat inbox**. Neither replacement is implemented. Clerk credentials are pending; chat storage, authentication and delivery still need to be built. Adding API keys alone will not enable these services.

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

All booking, walk-in, mail-in, tracking, account and live-chat feature flags are also `false`. These settings override the invoking shell's values in the Cloudflare wrappers, including removal of a stale `VERCEL_ENV`. Editing a dashboard setting or adding credentials does not override this reviewed profile. Changing a public feature requires a new build and aligned Worker settings.

The Worker can be verified on its generated address while metadata uses the confirmed `.com` canonical. No wildcard `workers.dev` address is accepted as a production canonical. Contact-only validation also retains the exact `https://origin-peach.vercel.app` address for Vercel compatibility.

Contact-only mode rejects website messages before reading submitted customer data and disables accounts, repair submissions, database writes, outbound email and chat. Public repair information, images, estimates, phone and WhatsApp contact remain available. Search indexing stays off until the canonical public release is reviewed.

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

This last command changes the hosted service; building or previewing does not. The deployment gate checks configuration shape, not account access, DNS, credentials or delivery. After deployment, verify HTTPS, images/fonts, navigation, canonical metadata, CSP nonces, security headers, noindex, and direct rejection of disabled API routes. Do not switch the canonical domain away from the existing host until the replacement is verified.

## Work required before full services

### Clerk accounts

- Add and validate the Clerk integration under the selected vinext/Workers runtime. The current code still uses its own email-link tokens and `origin_customer_session` cookie.
- Replace the server session boundary used by account pages, tracking and staff APIs. Require a verified account email when matching existing repair ownership; do not trust a client-supplied email or grant staff access merely because someone signed in.
- Preserve the owner-approved staff allowlist or implement an equivalent server-enforced role policy. Decide how existing sessions and repair ownership are migrated.
- Compose Clerk middleware with the current proxy behavior. The existing proxy excludes API routes; authenticated APIs need coverage and explicit authorization. Preserve canonical redirects, nonce propagation, security headers and the isolated chat route.
- Add the selected Clerk instance's CSP sources and test sign-in/out, expiry, cross-account denial, staff denial, redirects and API requests in the Worker runtime.
- Configure the Clerk publishable key, server-only secret and production domain only after integration exists. Never place the secret in a `NEXT_PUBLIC_*` variable or a committed file.

### Human chat on Cloudflare

Cloudflare hosting does not provide this application's staff inbox automatically. The current optional implementation is a tawk.to iframe; it remains disabled. The planned replacement needs:

- Durable Object conversation storage and a declared migration/binding, with reconnect and message retry behavior that prevents duplicate messages.
- A customer conversation capability or authenticated ownership check, plus a staff inbox with server-enforced read/reply permissions. A guessed conversation ID must never expose another customer's messages.
- Bounded messages, abuse protection, origin validation for socket/HTTP mutations, safe rendering and retention/deletion procedures. Keep message bodies and customer identifiers out of routine logs.
- Honest online/offline availability, persistence across restarts, reconnection, offline handling and a staffed notification process. Do not label an unattended inbox online.
- A real two-way customer/staff delivery check, including offline/reconnect behavior and isolation between customers, before enabling the public launcher.

Keep the existing explicit customer activation and privacy boundaries. Update the public privacy notice and [legacy Tawk guide](LIVE-CHAT.md) to match the implemented replacement before activation. An AI chatbot is outside the requested human-support scope.

### Repair database, email and spam protection

- Refactor the globally cached PostgreSQL client in `lib/server/repairStore.ts` to use request-scoped Workers connections. Configure a production PostgreSQL service and, if using Hyperdrive, its binding with **query caching disabled** for repair reads and writes. Customers and staff must see committed status updates immediately.
- Apply the tracked schema using the controlled migration command, restrict database access, configure backups and verify restore into a separate database. Workers/Durable Objects chat storage does not replace the existing PostgreSQL repair schema.
- Preserve transactional booking idempotency, customer filtering, append-only status history and stale-update rejection. Contact replay and rate limits currently use isolate-local Maps; they are not global Worker guarantees.
- `HOSTING_PROVIDER=cloudflare` trusts only a valid `CF-Connecting-IP`. Missing or malformed values fail rate-limit and Turnstile checks without falling back to forwarding headers. Direct local tests of enabled forms must deliberately supply test headers or use a generic local host profile.
- Configure real email delivery and both Turnstile keys for `originrepairs.com`. Retain server-side hostname verification and challenge recovery. Verify controlled inbox delivery; successful API responses alone are insufficient.

The business contact mailbox is still `tech@originrepairs.co.uk` pending owner confirmation; domain ownership does not establish a replacement mailbox. Do not substitute a guessed `.com` address. A future operational release requires an explicitly configured, verified `.com` sending address under the current gate.

## Domain, operations and rollback

Attach `originrepairs.com` and the intended `www` redirect using the account's actual Cloudflare routing instructions. Preserve existing MX/TXT email records. Keep secrets in the provider's secret settings and separate test resources from production data.

Before removing contact-only mode, complete the implementation and acceptance work above and the business checks in [DEPLOYMENT.md](DEPLOYMENT.md). Review the readiness gate for the actual selected auth/chat providers; it currently checks the legacy auth/Tawk configuration. Do not set dummy legacy values to bypass it. Enable each service only when its server behavior, UI and build/runtime flags agree.

Retain the last working Vercel deployment and record the pre-cutover domain routing. If verification fails, keep or restore that known deployment without blindly reverting database schema or losing accepted records. Keep operations and indexing disabled throughout the migration until their own acceptance checks pass.

Official references: [vinext migration](https://github.com/cloudflare/vinext/blob/main/.agents/skills/migrate-to-vinext/SKILL.md), [Workers Node environment behavior](https://developers.cloudflare.com/workers/runtime-apis/nodejs/process/), [Postgres.js with Hyperdrive](https://developers.cloudflare.com/hyperdrive/examples/connect-to-postgres/postgres-drivers-and-libraries/postgres-js/), [Hyperdrive cache behavior](https://developers.cloudflare.com/hyperdrive/concepts/query-caching/), [Clerk setup](https://clerk.com/docs/nextjs/getting-started/quickstart), [Clerk CSP](https://clerk.com/docs/guides/secure/best-practices/csp-headers).
