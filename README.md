# Origin Repairs

Device repair website for Origin Repairs in Leeds, built with Next.js App Router, React, TypeScript and Tailwind CSS. Includes repair quotations, drop-off and mail-in requests, email-link customer access, private repair timelines and a staff dashboard backed by PostgreSQL.

## Local development

Use Node.js 22 or 24, install with `npm ci`, then run `npm run dev`. `.env.local.example` describes configuration; keep real credentials out of git. The public service flags enable booking, mail-in and tracking. Database writes and external email remain disabled until explicitly configured.

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

See [the deployment plan](docs/DEPLOYMENT.md) for configuration, migration, verification, monitoring and rollback. Hosting and live service credentials have not been selected or configured. `npm run deploy:check` checks required production settings without contacting providers or printing secret values. Production builds run this check automatically before compiling.

For a Node.js host, set `DEPLOYMENT_ENV=production` on the intended public release or `preview` for staging. Vercel's platform-provided `VERCEL_ENV` takes precedence if present. Production detection, canonical redirects, staff origin checks, spam protection and write controls support both. `NODE_ENV` alone never turns a preview into a live service. Static-only hosting cannot run the database, form or sign-in routes.

## Customer live chat

The first-party chat button loads an embedded tawk.to conversation only after the customer chooses Start chat. Set the public property/widget IDs in `.env.local.example`; without them the panel offers phone, email and contact options. Closing or navigating away removes the provider iframe, and chat is excluded from private account, staff and repair-request pages. [Chat setup](docs/LIVE-CHAT.md) covers staff availability, the offline form and live verification. No message delivery or agent availability is implied by the local mocked tests.

## Main sources

- `lib/business-config.ts`: business details and public service switches.
- `lib/currentDevices.ts`, `lib/repairCatalogue.ts`: current models, repair eligibility and prices.
- `lib/serviceImages.ts`, `lib/deviceImages/`: device imagery and references.
- `lib/server/repairStore.ts`, `db/migrations/`: persistent repairs and status history.
- `app/track/`, `app/admin/repairs/`: customer and staff workflows.
- `app/api/`: validated repair, contact and authentication routes.
- `docs/DEVICE-CATALOGUE-REVIEW.md`, `docs/POLICY-REVIEW.md`: content sources and operational follow-through.
- `tests/`: unit, database, journey, responsive and accessibility checks.
