# Origin Repairs

Device repair website for Origin Repairs in Leeds, built with Next.js App Router, React, TypeScript and Tailwind CSS. The contact-only website is live on Cloudflare Workers with vinext at [originrepairs.com](https://originrepairs.com), with `www.originrepairs.com` also attached. The existing Next.js/Vercel deployment is untouched and remains available for rollback.

The deployed Cloudflare site offers public repair information, estimates, phone/WhatsApp contact and customer-initiated Tawk chat. Online requests, accounts, tracking, website email, database writes and indexing remain disabled. The real widget loads on desktop and narrow mobile screens; staff availability and actual message delivery remain unverified. Tawk replaces the earlier custom Cloudflare inbox proposal. The repository retains PostgreSQL repair flows and custom email-link authentication; requested Clerk integration remains unfinished, and credentials alone will not enable it.

## Local development

Use Node.js 22 or 24, install with `npm ci`, then run `npm run dev` for the retained Next.js app. `.env.local.example` defaults to safe contact-only settings; keep real credentials out of git. To exercise existing forms locally, explicitly disable contact-only mode and enable the required features using the isolated CI test profile. Database writes and external email require separate opt-ins.

For tracking development, use a separate local PostgreSQL database, set `DATABASE_URL`, apply `npm run db:migrate`, configure a local-only `AUTH_SECRET` and `STAFF_EMAILS`, and opt into `ALLOW_PREVIEW_REPAIR_WRITES=true`. Never connect a public preview to the live customer database. `npm run db:check` verifies connectivity and required columns without reading records.

## Release checks

```sh
npm run check
npm audit --omit=dev --audit-level=high
npm run build
npx playwright install chromium
npm run test:e2e -- --workers=1
```

Browser tests run a separate production server on port 3108 at desktop, 320px, 390px and tablet sizes. Real email delivery is disabled. `NEXT_PUBLIC_*` settings are embedded at build time: build and test with identical flags.

The tracking integration suite is deliberately gated. See `.github/workflows/quality.yml` for a complete PostgreSQL-backed test setup and [the deployment plan](docs/DEPLOYMENT.md) for local test settings. The Turnstile recovery suite needs a separate build with a nonempty public widget key and uses a mocked widget and delivery endpoints.

## Deployment

Follow [the Cloudflare migration guide](docs/CLOUDFLARE.md) for the verified deployment record, commands and remaining work, and [the operational deployment plan](docs/DEPLOYMENT.md) for service acceptance and rollback. On 29 September 2026, Cloudflare version `9e19d24d-230b-4a68-b899-9e41ac75a1f2` was deployed to `.com` and `www`. The live homepage returned HTTPS 200 with CSP and HSTS; the real Tawk widget rendered on desktop and at 320px without browser errors. Local typecheck, lint and 296 unit tests passed, as did the Cloudflare build/runtime typecheck and 40 browser checks, with two duplicate API probes skipped. The preceding migration dependency audit reported zero vulnerabilities. These results do not claim final CI success or real chat delivery. The current toolchain pins vinext 1.0.0 and the `cf` beta CLI through the lockfile.

```sh
npm run build:cloudflare
npm run test:cloudflare
npm run preview:cloudflare -- --host 127.0.0.1 --port 3109
```

The Cloudflare wrappers share `scripts/cloudflare-environment.mjs` with the Worker configuration, keeping browser/runtime flags aligned. They run the readiness gate and keep operational services off, with a separate validated opt-in for Tawk chat during contact-only mode. `npm run deploy:cloudflare` changes the hosted Worker and should follow review and runtime verification. Lower-level vinext commands do not apply this safe release profile. The Cloudflare CI workflow builds and tests locally; it does not deploy.

For a Node.js host, set `DEPLOYMENT_ENV=production` on the intended public release or `preview` for staging. Vercel's platform-provided `VERCEL_ENV` takes precedence if present. Production detection, canonical redirects, staff origin checks, spam protection and write controls support both. `NODE_ENV` alone never turns a preview into a live service. Static-only hosting cannot run the database, form or sign-in routes.

## Customer live chat

The owner selected Tawk and supplied public Property ID `6abc1fa0926103343dfe973b` and Widget ID `1k3ndn318`. Chat runs through the existing Start chat panel and separate iframe; Tawk provides conversations and the staff inbox while Cloudflare hosts the website. The previous custom Cloudflare inbox plan is superseded. No Clerk session, repair data or provider secret is supplied to the widget.

The deployed widget uses Tawk's embedded container mode inside the panel's iframe so it fits desktop and narrow mobile screens. Follow the [Tawk setup guide](docs/LIVE-CHAT.md) for staff access, availability, notifications, privacy and acceptance checks. No real messages were sent during verification; a two-way conversation and offline-message receipt still need testing with the intended team. Clerk integration remains separate future work.

## Main sources

- `lib/business-config.ts`: business details and public service switches.
- `lib/currentDevices.ts`, `lib/repairCatalogue.ts`: current models, repair eligibility and prices.
- `lib/serviceImages.ts`, `lib/deviceImages/`: device imagery and references.
- `lib/server/repairStore.ts`, `db/migrations/`: persistent repairs and status history.
- `app/track/`, `app/admin/repairs/`: customer and staff workflows.
- `app/api/`: validated repair, contact and authentication routes.
- `docs/DEVICE-CATALOGUE-REVIEW.md`, `docs/POLICY-REVIEW.md`: content sources and operational follow-through.
- `tests/`: unit, database, journey, responsive and accessibility checks.
