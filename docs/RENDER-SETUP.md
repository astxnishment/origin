# Render deployment setup

29 September 2026 status: **historical proposal, not the selected deployment path**. The owner selected Cloudflare and `originrepairs.com`. Do not apply this older Blueprint or use its domain/service settings for the current migration. Follow [CLOUDFLARE.md](CLOUDFLARE.md); the existing Vercel deployment is retained for rollback. Prices and setup below describe the earlier proposal and require fresh review if Render is reconsidered.

Prepared 27 September 2026. [render.yaml](../render.yaml) is a proposed configuration, not a purchased or deployed service. Obtain the owner's approval of the recurring cost before creating resources. Follow the operational checks in [DEPLOYMENT.md](DEPLOYMENT.md).

## Proposed monthly cost

| Resource | Configuration | USD/month |
| --- | --- | ---: |
| Next.js web service | Frankfurt, `1c-2g`, one instance | $25.00 |
| PostgreSQL 16 | Frankfurt, `0.5c-1g` | $19.00 |
| Database storage | 5 GB at $0.30/GB | $1.50 |
| **Total** | **Free Hobby workspace assumed** | **$45.50** |

This excludes tax, usage overages, domain registration, email services, optional paid chat and workspace upgrades. Reconfirm prices in the creation screen. Storage autoscaling and preview deployments are disabled; monitor capacity and agree any increase. [Render pricing](https://render.com/pricing).

## Values to prepare

Enter secrets directly into Render's prompted fields. Do not use test credentials or copy production secrets into Git, logs or preview services.

| Prompted setting | Required value or decision |
| --- | --- |
| `RESEND_API_KEY` | Real sending key for the verified business domain |
| `RESEND_FROM_EMAIL` | Verified sender ending in `@originrepairs.co.uk` |
| `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Matching production keys allowing `originrepairs.co.uk` |
| `STAFF_EMAILS` | Owner-approved staff addresses, comma-separated |
| `NEXT_PUBLIC_TAWK_PROPERTY_ID`, `NEXT_PUBLIC_TAWK_WIDGET_ID` | Actual chat account IDs; needed when chat is enabled |
| `PRODUCTION_OPERATIONS_ENABLED`, `EMAILS_ENABLED`, `REPAIR_WRITES_ENABLED` | Explicit `true` only after the owner approves the business workflow and production services |
| `NEXT_PUBLIC_BOOKING_ENABLED`, `NEXT_PUBLIC_MAIL_IN_ENABLED`, `NEXT_PUBLIC_TRACKING_ENABLED`, `NEXT_PUBLIC_CUSTOMER_ACCOUNTS_ENABLED` | Explicit `true` for the requested launch; mail-in needs booking and tracking needs accounts |
| `NEXT_PUBLIC_WALK_INS_ENABLED` | `false` unless walk-in availability is confirmed |
| `NEXT_PUBLIC_LIVE_CHAT_ENABLED` | Explicit `true` after inbox setup; otherwise `false` |
| `SITE_INDEXING_ENABLED` | `false` during acceptance, then `true` for the reviewed public release |

Render generates `AUTH_SECRET` and supplies the private `DATABASE_URL`. Keep the generated authentication secret stable across releases. The production marker and canonical URLs are already set. Do not add `VERCEL_ENV` or enable either preview override.

## Setup sequence

1. Obtain cost approval and prepare the real-service values above. Confirm the address, prices, mail-in procedure, staff access and monitored inbox using the owner checklist.
2. After the reviewed configuration is pushed, connect Render to the GitHub repository and select **New → Blueprint**, branch `codex/launch-refresh`, file `render.yaml`. Review the exact plans, 5 GB disk and Frankfurt region before creating anything. Keep Blueprint auto-sync off during setup as well as the service's automatic deploy setting. Resource creation is chargeable even if the application build fails.
3. Enter the prompted values. The production build intentionally fails while required settings or approvals are missing. An initial deployment can start during Blueprint creation even though subsequent automatic deployments are off. Do not approve operations just to bypass that check.
4. Verify database recovery/backup settings. The pre-deploy command applies the tracked migration and checks every required column before starting the application. An incompatible existing database needs a reviewed migration; do not treat this as a general migration tool. Test backup restoration into a separate database before accepting customers.
5. Add the canonical domain using Render's displayed DNS instructions, preserving email-related DNS records. Confirm HTTPS and the `www` redirect before the final manual deploy. The `onrender.com` address is deliberately disabled; acceptance tests need the canonical domain. Do not remove the old host until the replacement passes acceptance.
6. Manually deploy the reviewed commit. Verify the migration/check output, then test real contact delivery, a mail-in request and reference, customer isolation, staff updates, magic-link sign-in, Turnstile, and chat with an available agent plus its offline form. Confirm image loading and mobile layouts. Then enable indexing and rebuild. Changes to any `NEXT_PUBLIC_*` value always require a new build.

`sync: false` prompts apply at initial Blueprint creation; later edits to these values happen in the service's Environment settings. Keep automatic deploys and preview environments off until the owner approves a release process. [Blueprint reference](https://render.com/docs/blueprint-spec).

## Database connection and checks

The private database URL stays inside the same Render account and Frankfurt region. `ipAllowList: []` blocks public database connections. Both the runtime and migration script use postgres.js; `PGSSL=require` forces TLS for this driver. `PGSSLMODE` alone does not. Render's internal certificate is self-signed, so this mode encrypts the connection without CA/hostname verification. Do not replace it with `prefer` or disable TLS. [Render private PostgreSQL connections](https://render.com/docs/postgresql-creating-connecting#internal-connections).

Run database commands from Render's service environment; the private URL is not reachable from a developer laptop. The web health check only confirms the home page responds. It does not verify email, chat, staff access or database recovery. The app's transient image cache can be recreated after deployments; repair records are stored in PostgreSQL.

Validate configuration with Render CLI 2.7+ before applying: `render blueprints validate render.yaml`. Local JSON Schema validation checks structure only; it cannot prove account access, plan availability, credentials, DNS or live delivery. Never run integration tests against the production database.
