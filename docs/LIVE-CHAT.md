# Live chat setup

Prepared 25 September 2026. The website integration is implemented; the owner's tawk.to account is not connected yet. No real conversation has been sent and no agent has been hired.

## Customer experience

- A Chat with us button opens an accessible, keyboard-dismissible panel on public pages.
- No tawk.to request is made before the customer selects Start chat. The panel names the provider and links the privacy notice.
- The conversation runs in a separate `/support/chat` document within the panel. Closing it or navigating away removes that document and its active scripts/sockets. The iframe is lifecycle isolation, not a security sandbox against the provider.
- The website does not inject account identity, repair references, the referring page URL or form drafts into chat. Private account, staff, sign-in, tracking and booking routes have no launcher.
- Online, away and offline states come from the configured provider. The site does not invent agent availability or promise an instant reply.
- Missing configuration, a script error or a 20-second connection timeout leaves useful phone/email/contact alternatives. Closing the panel does not delete messages stored by tawk.to or existing provider cookies.
- The mobile launcher sits above the repair-action bar. Chat does not appear over a quote's sticky price bar.

## Connect the team's inbox

1. Sign in at [tawk.to](https://dashboard.tawk.to), or create the business's account. The owner completes password, verification and account-terms steps. The [core human-operated service is free](https://www.tawk.to/faqs/); branding removal, AI features and hired agents are separate optional services.
2. Create/select the Origin Repairs property for `https://originrepairs.co.uk`. Invite only the staff who should answer customer messages. Configure their app/browser notifications and who monitors offline messages.
3. Copy the **public Property ID and Widget ID** from Administration → Chat Widget. [Finding the IDs](https://help.tawk.to/article/where-can-i-find-the-property-and-widget-id). No secret API key is needed for this anonymous integration.
4. Set `NEXT_PUBLIC_LIVE_CHAT_ENABLED=true`, `NEXT_PUBLIC_TAWK_PROPERTY_ID` and `NEXT_PUBLIC_TAWK_WIDGET_ID` in the host's environment. Rebuild after changes. Set the feature to `false` if chat must be temporarily removed.
5. Turn on **Widget offline when all Agent(s) offline**. Set the scheduler to actual staffed hours in Europe/London. The default can otherwise show Online without an available person. [Availability settings](https://help.tawk.to/article/the-difference-between-online-away-and-invisible).
6. Configure an offline form asking only for name, reply email and message. Use an honest message such as “We're away from chat at the moment. Leave your question and email, and our team will reply during opening hours.” Do not promise a response time unless it is operationally supported.
7. Configure the provider consent form for **All visitors**, link `/privacy`, and verify behaviour for UK visitors. Leave AI Assist, promotional triggers and unrelated tracking integrations disabled for this human-chat scope. [Consent settings](https://help.tawk.to/article/enabling-and-managing-your-consent-form).
8. Record the processor arrangement, access controls and deletion/retention process for chat history alongside the other services. [Provider privacy notice](https://www.tawk.to/privacy-policy/).

## Verification before public activation

- With an available staff operator and explicit permission to send a controlled test message, verify a two-way conversation, mobile layout, notifications and offline-message delivery.
- Test online, away and offline availability; check that no unattended inbox appears online.
- Verify the real embed under the deployed Content Security Policy. The vendor-specific resource destinations are scoped to the iframe response; the site's other pages retain their existing policy. [Vendor CSP guidance](https://help.tawk.to/article/why-are-images-not-showing-up-in-the-widget).
- Verify the Close control, keyboard navigation, reopening a conversation, blocked scripts, and connection timeout.
- Check that opening an account/staff page closes the iframe. Browser navigation and full-page navigation must both remove it.

## Automated checks

Unit checks cover disabled/missing configuration, URL/HTML injection through IDs, nonce/cache/frame controls and private-route exclusions. Playwright checks use a local provider fixture and block external requests. Run default and configured builds separately so both fallback and connected states are covered. Public fixture IDs are not real service credentials. Automated tests do not verify a real inbox.

Verified locally on 25 September 2026: 213 unit tests, TypeScript, lint and the production build passed. The default chat build passed 22 browser checks; the configured fixture build passed 46 checks across the initial run and focused navigation-test rerun. These cover 50 distinct chat cases across desktop, 320px, 390px and tablet, including light/dark accessibility. The real `/support/chat` bootstrap, nonce/CSP and script-error bridge were exercised with the vendor script intercepted locally. The ordinary build was restored afterwards. Real inbox delivery remains unverified.

Implementation uses the documented [tawk.to JavaScript API](https://developer.tawk.to/jsapi/) and [delayed-loading pattern](https://help.tawk.to/article/delaying-the-tawkto-widget-using-javascript).
