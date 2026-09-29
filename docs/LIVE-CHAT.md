# Tawk live chat setup

29 September 2026 update: the owner supplied the **tawk.to** widget and selected it for human customer/staff chat. The website remains hosted on Cloudflare; conversations and the staff inbox use Tawk. This supersedes the earlier plan to build a custom Cloudflare inbox. Clerk remains the selected provider for future website accounts and is independent of this anonymous chat integration.

The customer-initiated integration is deployed with public Property ID `6abc1fa0926103343dfe973b` and Widget ID `1k3ndn318`. The embed URL is `https://embed.tawk.to/6abc1fa0926103343dfe973b/1k3ndn318`. These are public widget identifiers, not secret API credentials. Cloudflare version `9e19d24d-230b-4a68-b899-9e41ac75a1f2` was deployed on 29 September 2026. The real widget rendered on the live site at desktop and 320px widths without browser errors, and provider status reached the panel. No messages were sent: staff availability, real two-way conversation delivery and offline-message receipt remain unverified. No agent has been hired or paid add-on selected.

## Customer experience

- A Chat with us button opens an accessible, keyboard-dismissible panel on public pages.
- No tawk.to request is made before the customer selects Start chat. The panel names the provider and links the privacy notice.
- The conversation runs in a separate `/support/chat` document within the panel. Closing it or navigating away removes that document and its active scripts/sockets. The iframe is lifecycle isolation, not a security sandbox against the provider.
- Tawk uses `embedded: 'origin-tawk-container'` and a full-size container within that document. The widget fits the first-party panel on desktop and narrow mobile screens instead of retaining floating-widget offsets inside the iframe.
- The website does not inject account identity, repair references, the referring page URL or form drafts into chat. Private account, staff, sign-in, tracking and booking routes have no launcher.
- Online, away and offline states come from the configured provider. The site does not invent agent availability or promise an instant reply.
- Missing configuration, a script error or a 20-second connection timeout leaves useful direct-contact alternatives. During contact-only mode these are phone and WhatsApp; the website contact form remains disabled. Closing the panel does not delete messages stored by tawk.to or existing provider cookies.
- The mobile launcher sits above the repair-action bar. Chat does not appear over a quote's sticky price bar.

## Connect the team's inbox

1. Sign in at [tawk.to](https://dashboard.tawk.to), or create the business's account. The owner completes password, verification and account-terms steps. The [core human-operated service is free](https://www.tawk.to/faqs/); branding removal, AI features and hired agents are separate optional services.
2. Create/select the Origin Repairs property for `https://originrepairs.com`. Invite only the staff who should answer customer messages. Configure their app/browser notifications and who monitors offline messages.
3. The owner has supplied the **public Property ID and Widget ID** recorded above. Confirm this property is the intended team inbox in Administration → Chat Widget. [Finding the IDs](https://help.tawk.to/article/where-can-i-find-the-property-and-widget-id). No secret API key or Clerk session is needed for this anonymous integration.
4. The deployed profile sets `NEXT_PUBLIC_LIVE_CHAT_ENABLED=true` with the validated IDs. For subsequent Cloudflare changes, update the reviewed `scripts/cloudflare-environment.mjs` profile shared by the build and runtime; a dashboard setting alone does not override it. This explicit chat opt-in retains `NEXT_PUBLIC_CONTACT_ONLY=true` and disables website booking, accounts, tracking, email, database writes and indexing. Rebuild and deploy after changes. Set chat to `false` in the shared profile and rebuild/redeploy if it must be removed.
5. Turn on **Widget offline when all Agent(s) offline**. Set the scheduler to actual staffed hours in Europe/London. The default can otherwise show Online without an available person. [Availability settings](https://help.tawk.to/article/the-difference-between-online-away-and-invisible).
6. Configure an offline form asking only for name, reply email and message. Use an honest message such as “We're away from chat at the moment. Leave your question and email, and our team will reply during opening hours.” Do not promise a response time unless it is operationally supported.
7. Configure the provider consent form for **All visitors**, link `/privacy`, and verify behaviour for UK visitors. Leave AI Assist, promotional triggers and unrelated tracking integrations disabled for this human-chat scope. [Consent settings](https://help.tawk.to/article/enabling-and-managing-your-consent-form).
8. Record the processor arrangement, access controls and deletion/retention process for chat history alongside the other services. [Provider privacy notice](https://www.tawk.to/privacy-policy/).

## Delivery acceptance and subsequent release checks

- Widget deployment and rendering are verified as recorded above. Do not treat this as receipt by an available staff operator or a completed conversation test.
- With an available staff operator and explicit permission to send a controlled test message, verify a two-way conversation, mobile layout, notifications and offline-message delivery.
- Test online, away and offline availability; check that no unattended inbox appears online.
- Verify the real embed under the deployed Content Security Policy. The vendor-specific resource destinations are scoped to the iframe response; the site's other pages retain their existing policy. [Vendor CSP guidance](https://help.tawk.to/article/why-are-images-not-showing-up-in-the-widget).
- Verify the Close control, keyboard navigation, reopening a conversation, blocked scripts, and connection timeout.
- Check that opening an account/staff page closes the iframe. Browser navigation and full-page navigation must both remove it.

## Automated checks

Unit checks cover disabled/missing configuration, URL/HTML injection through IDs, nonce/cache/frame controls and private-route exclusions. Playwright checks use a local provider fixture and block external requests. Run default and configured builds separately so both fallback and connected states are covered. Public fixture IDs are not real service credentials. Automated tests do not verify a real inbox.

For the 29 September Cloudflare chat release, local typecheck, lint and 296 unit tests passed, along with the Cloudflare build/runtime typecheck and 40 browser checks; two duplicate API checks were skipped. Live `/support/chat` returned 200 with the configured embed, embedded container, CSP and no-store headers. Disabled contact, booking, account-link and staff-write endpoints returned 503. These are local and live-probe results, not a final CI claim.

Historical verification on 25 September 2026: 213 unit tests, TypeScript, lint and the production build passed. The default chat build passed 22 browser checks; the configured fixture build passed 46 checks across the initial run and focused navigation-test rerun. These cover 50 distinct chat cases across desktop, 320px, 390px and tablet, including light/dark accessibility. The real `/support/chat` bootstrap, nonce/CSP and script-error bridge were exercised with the vendor script intercepted locally. The ordinary build was restored afterwards. These results do not verify the newly supplied widget on Cloudflare or real inbox delivery.

Implementation uses the documented [tawk.to JavaScript API](https://developer.tawk.to/jsapi/) and [delayed-loading pattern](https://help.tawk.to/article/delaying-the-tawkto-widget-using-javascript).
