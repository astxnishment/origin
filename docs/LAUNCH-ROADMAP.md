# Origin Repairs — full service launch roadmap

Prepared 29 September 2026. Main domain: **https://originrepairs.com**.

## Starting point

Cloudflare hosting, HTTPS, the www redirect, public pages, device artwork and local quote estimates are live. The original hosting migration is merged (PR #3), with both hosting verification workflows passing for that migration. The subsequent Tawk release is deployed as Cloudflare version `9e19d24d-230b-4a68-b899-9e41ac75a1f2`: local typecheck, lint and 296 unit tests passed, along with the Cloudflare build/runtime typecheck and 40 browser checks (two duplicate API probes skipped). This does not claim final CI success for the Tawk update.

The public site offers phone/WhatsApp contact and a customer-initiated Tawk widget. The real widget renders on desktop and at 320px without browser errors, and provider status reaches the panel; no messages were sent. Staff availability, two-way delivery and offline-message receipt remain unverified. Tawk supersedes the earlier custom Cloudflare inbox proposal, while the website stays on Cloudflare. Clerk accounts, online repair requests, mail-in requests, tracking, website outbound email and database writes remain non-operational; live empty requests to contact, booking, account-link and staff-write APIs returned 503. Search indexing remains disabled. Existing booking/tracking code and tests provide a starting point, but do not establish production readiness on Workers.

This document is a plan. It does not activate services, create provider accounts or authorize a paid subscription.

## Ordered work

| Order | Work and responsibility | Completion evidence |
| --- | --- | --- |
| 1 | **Confirm business and staff setup.** Owner confirms operator details, address, phone, opening hours, prices, warranties, support inbox, staff access, chat coverage and mail-in procedures. Development records the approved values. | One agreed business configuration; named people responsible for new requests, status updates and customer messages. |
| 2 | **Prepare service infrastructure.** Development sets up separate test and production resources, adapts repair storage for Workers, configures database backups, email sending and Turnstile. Owner supplies provider access and confirms any costs before purchase. | Data persists correctly, an isolated backup restore works, and controlled customer/business inboxes receive test messages. Test environments cannot write to production. |
| 3 | **Integrate Clerk accounts.** Development replaces the existing email-link session system, connects customer ownership and repair-staff authorization, and validates Clerk on the pinned Cloudflare runtime. Owner configures the Clerk application and supplies authorized staff identities. | Sign-in, verification, sign-out and expired sessions work on the real domain. Customers cannot access each other's repairs or the repair-staff dashboard. Tawk staff permissions are configured separately. |
| 4 | **Complete repair operations.** Development connects booking, mail-in requests, the staff dashboard and customer tracking to the production-ready account/storage/email boundaries. Staff rehearse intake and updates. | A test request produces one persistent reference, reaches the business inbox/dashboard, sends a receipt and shows a staff update in the correct customer's account. A mail-in request requires staff acceptance before shipping. |
| 5 | **Finish Tawk delivery acceptance.** The supplied widget is deployed through the Start chat iframe using an embedded container, and desktop/320px rendering is verified. Owner grants staff access to the intended Tawk property and confirms coverage, notifications and offline handling. | An available staff member receives and answers a controlled customer message. Reopening/reconnect and offline receipt work, and unattended chat does not appear online. These delivery and staffing checks remain open. |
| 6 | **Run the complete launch rehearsal.** Development and owner test the actual services together, review public content/policies and confirm the support procedures. | Customer journeys, permissions, mobile/keyboard use, delivery failures, storage outages and recovery pass the acceptance record below. No draft or unsupported service promises remain. |
| 7 | **Activate the full public release.** Development replaces legacy provider checks, aligns build/runtime settings, deploys enabled services and verifies them on .com. Enable public indexing after the operational checks pass. | Accounts, requests, tracking and chat work on the live domain. Robots/sitemap expose intended public pages and exclude private areas. The correct sitemap is submitted through the owner's Search Console account. |
| 8 | **Operate and maintain the service.** Owner monitors the repair dashboard and chat inbox. Development establishes failure alerts, spending visibility, backup checks, a tested rollback and a documented release process. | The first real requests are followed from submission to staff response; a named owner handles failures and missed messages. Future releases have an understood deployment path. |

Steps 2 and 3 can progress together after the owner inputs are available. Tawk is already deployed independently of Clerk and repair storage; its delivery acceptance can proceed while contact-only mode keeps those services disabled. All full-service acceptance checks must pass before step 7. Configure monitoring and recovery during implementation; step 8 is the continuing operational responsibility, not a reason to postpone alerts until after launch.

## First owner inputs

1. **Business details:** confirm 76 Cookridge Street, Leeds LS2 8GL; +44 7768 426754; hours; legal operator details; the prices and warranty terms that can be offered at launch.
2. **Support and staff:** choose the working support mailbox. The repository still contains `tech@originrepairs.co.uk`; a new .com mailbox has not been established. Identify the staff email addresses allowed to manage repairs, separately invite the intended Tawk operators, and assign offline-message follow-up.
3. **Clerk:** make the chosen application available for integration, with separate development and production configuration for `originrepairs.com`. Put secrets in provider settings or an ignored local secrets file, not messages or source control.
4. **Database and email:** identify an existing managed PostgreSQL and transactional-email account if available; otherwise select them and agree a monthly service budget. Resend is already implemented for repair emails and is the lowest-change starting point. Mailbox hosting/forwarding and application email sending are separate needs.
5. **Mail-in process:** confirm accepted devices, packing instructions, postage/insurance responsibility, returns, assessment charges and how staff give permission to dispatch a device.

The owner has chosen Tawk and supplied public Property ID `6abc1fa0926103343dfe973b` and Widget ID `1k3ndn318`; no additional chat-provider decision or secret API key is needed for this anonymous integration. Confirm staff access and operational settings in that property. The earlier custom Cloudflare/Durable Object inbox plan is superseded. No paid add-on or hired agent is part of this update.

## Implementation decisions

- **Hosting:** retain the current Cloudflare Worker and domain. Keep the known working Vercel deployment available during the transition.
- **Accounts:** use Clerk as requested. Complete a small sign-in/server-session compatibility check on the pinned vinext/Workers runtime before replacing all session consumers. Bind repair ownership to verified identity; define how existing records, account-email changes, account deletion, staff revocation and legacy sessions are handled. Never grant staff access just because an account exists. Configure production keys, domain DNS, redirects and CSP using [Clerk's production guide](https://clerk.com/docs/guides/development/deployment/production).
- **Repair storage:** retain the existing PostgreSQL schema and transaction behavior. Adapt the global client to request-scoped Worker connections. Cloudflare documents this pattern for the existing driver in its [Postgres.js/Hyperdrive guide](https://developers.cloudflare.com/hyperdrive/examples/connect-to-postgres/postgres-drivers-and-libraries/postgres-js/). If Hyperdrive is used, disable query caching for repair data so committed updates appear immediately. Establish whether there is existing production customer data before applying migrations; preserve and reconcile any records.
- **Email and forms:** configure a verified sending domain, working staff destination and production Turnstile keys. Preserve saved requests when an email fails, make failures visible to staff, and provide retry/recovery behavior. Replace isolate-local replay/rate-limit assumptions with controls suitable for distributed Workers before enabling public submissions.
- **Chat:** use the existing customer-initiated Tawk adapter. Validate the fixed-host embed identifiers; preserve no provider load before Start chat, removal of its iframe on close/navigation, private-route exclusions, and no injected account or repair data. The same-origin iframe provides lifecycle isolation, not a security sandbox. Configure Tawk staff permissions, real availability, notifications, consent and retention/deletion. Follow [LIVE-CHAT.md](LIVE-CHAT.md); verify actual two-way delivery rather than treating a loaded widget as proof.
- **Tracking:** initially reflects updates entered by staff. It does not detect repair work automatically. Automatic status-change emails are not implemented and should only be promised if that additional delivery workflow is built and tested.
- **Release controls:** the Cloudflare wrapper applies one reviewed profile to build and runtime. The deployed release permits explicit validated Tawk chat while keeping contact-only repair/account/email/write/indexing safeguards. Remove contact-only mode only after full-service acceptance. Replace the readiness gate's custom-auth requirements with Clerk checks and keep Tawk validation for the selected chat provider; do not populate dummy legacy settings. Keep preview/staging indexing and real outbound messages disabled except explicitly scoped test sends.
- **Future deployments:** current Cloudflare CI verifies builds but does not publish them. Use the documented release command, or add deployment automation gated on passing checks with secrets scoped to the intended environment. Do not imply a Git push alone updates Cloudflare.

## Required acceptance record

Record the environment, test identity, result and relevant evidence for each check. Use agreed staff/test inboxes and labelled test records; obtain the owner's specific recipient authorization before sending test messages.

Extend the Cloudflare suite to exercise enabled Clerk and database journeys on the actual Worker runtime. The current 40 passing Cloudflare browser checks cover the contact-only profile and Tawk opt-in; live desktop/mobile widget loading is also verified. Passing Next.js/PostgreSQL CI, mocked chat checks or widget rendering alone does not prove the unfinished repair services or real inbox delivery work.

- Customer creates/verifies an account, signs in, signs out and loses access after session expiry.
- Customer A cannot view customer B's repairs; ordinary customers cannot use repair-staff APIs. Separately verify private Tawk sessions and authorized team-inbox access without connecting chat identity to repair ownership.
- A booking saves once even if the customer retries after a lost response; its displayed price and repair eligibility match server validation.
- A staff member receives and processes a booking, updates its status and confirms the matching customer's timeline refreshes.
- A mail-in request records the return address and correctly explains acceptance and dispatch instructions.
- Actual business and customer inboxes receive the intended emails; a failed email leaves a saved repair visible to staff.
- A failed database write does not claim the request was accepted; restoration is demonstrated in a separate database without touching live records.
- Customer/staff chat works in both directions, retains history after reconnect, rejects unauthorized access and accurately displays offline availability.
- Spam-check expiry/retry works; form and chat controls remain usable on mobile and by keyboard.
- Public wording, privacy notice, service terms, warranty, image usage and retention match the implemented services and business procedures.
- Live .com navigation, artwork, quotes, HTTPS, canonical metadata, security headers and error handling remain correct after service activation.
- Public pages become indexable only at release; account, staff and private tracking/chat content remain excluded and access-controlled.
- Staff know how to handle missed notifications, disable an affected service and keep phone contact available during recovery.

Completion means a customer can request a repair, receive confirmation, follow a staff update and reach a staffed support channel reliably. A successful deployment or green automated tests alone does not establish those real-service outcomes.

For detailed technical context, see [Cloudflare migration](CLOUDFLARE.md), [deployment plan](DEPLOYMENT.md) and [policy review](POLICY-REVIEW.md).
