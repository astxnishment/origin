# Origin Repairs

Device repair website for Origin Repairs in Leeds, built with Next.js App Router, React, TypeScript and Tailwind CSS. The current migration targets Cloudflare Workers with vinext and the canonical domain `https://originrepairs.com`. The existing Next.js/Vercel path remains available for rollback.

The Cloudflare profile is contact-only: public repair information, estimates, phone and WhatsApp contact. Online requests, accounts, tracking, email, chat, database writes and indexing remain disabled. The repository contains the earlier PostgreSQL repair flows, custom email-link authentication and Tawk adapter. Requested Clerk authentication and a Cloudflare-hosted human chat inbox are not implemented; credentials alone will not enable them.

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

Follow [the Cloudflare migration guide](docs/CLOUDFLARE.md) for current status, commands and remaining work, and [the operational deployment plan](docs/DEPLOYMENT.md) for service acceptance and rollback. Cloudflare is selected; successful production deployment, domain cutover and service delivery still require verification. The current toolchain pins vinext 1.0.0 and the `cf` beta CLI through the lockfile.

```sh
npm run build:cloudflare
npm run test:cloudflare
npm run preview:cloudflare -- --host 127.0.0.1 --port 3109
```

The Cloudflare wrappers share `scripts/cloudflare-environment.mjs` with the Worker configuration, keeping browser/runtime flags aligned. They run the readiness gate and keep services off. `npm run deploy:cloudflare` changes the hosted Worker and should follow review and runtime verification. Lower-level vinext commands do not apply this safe release profile. The Cloudflare CI workflow builds and tests locally; it does not deploy.

For a Node.js host, set `DEPLOYMENT_ENV=production` on the intended public release or `preview` for staging. Vercel's platform-provided `VERCEL_ENV` takes precedence if present. Production detection, canonical redirects, staff origin checks, spam protection and write controls support both. `NODE_ENV` alone never turns a preview into a live service. Static-only hosting cannot run the database, form or sign-in routes.

## Customer live chat

The requested replacement is a Cloudflare-hosted conversation between customers and human staff, with a private staff inbox. Durable Object persistence, customer/staff permissions, reconnect/offline behavior and real delivery remain to be implemented. Clerk keys are also pending, and the session adapter and CSP/API integration need work.

The retained Tawk adapter is disabled in the Cloudflare profile. Its [setup guide](docs/LIVE-CHAT.md) is historical implementation documentation, not instructions to activate the planned inbox. Preserve explicit customer activation and the existing privacy boundaries when replacing it. Mocked tests do not prove real delivery or staff availability.

## Main sources

- `lib/business-config.ts`: business details and public service switches.
- `lib/currentDevices.ts`, `lib/repairCatalogue.ts`: current models, repair eligibility and prices.
- `lib/serviceImages.ts`, `lib/deviceImages/`: device imagery and references.
- `lib/server/repairStore.ts`, `db/migrations/`: persistent repairs and status history.
- `app/track/`, `app/admin/repairs/`: customer and staff workflows.
- `app/api/`: validated repair, contact and authentication routes.
- `docs/DEVICE-CATALOGUE-REVIEW.md`, `docs/POLICY-REVIEW.md`: content sources and operational follow-through.
- `tests/`: unit, database, journey, responsive and accessibility checks.
