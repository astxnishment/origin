// One non-secret release profile shared by the browser build and Worker runtime.
// Enable services only after their authentication, storage and delivery are tested.
export const cloudflareEnvironment = {
  HOSTING_PROVIDER: 'cloudflare',
  DEPLOYMENT_ENV: 'production',
  NEXT_PUBLIC_SITE_URL: 'https://originrepairs.com',
  NEXT_PUBLIC_CONTACT_ONLY: 'true',
  PRODUCTION_OPERATIONS_ENABLED: 'false',
  SITE_INDEXING_ENABLED: 'false',
  EMAILS_ENABLED: 'false',
  REPAIR_WRITES_ENABLED: 'false',
  ALLOW_PREVIEW_EMAILS: 'false',
  ALLOW_PREVIEW_REPAIR_WRITES: 'false',
  NEXT_PUBLIC_BOOKING_ENABLED: 'false',
  NEXT_PUBLIC_WALK_INS_ENABLED: 'false',
  NEXT_PUBLIC_MAIL_IN_ENABLED: 'false',
  NEXT_PUBLIC_TRACKING_ENABLED: 'false',
  NEXT_PUBLIC_CUSTOMER_ACCOUNTS_ENABLED: 'false',
  NEXT_PUBLIC_LIVE_CHAT_ENABLED: 'true',
  NEXT_PUBLIC_TAWK_PROPERTY_ID: '6abc1fa0926103343dfe973b',
  NEXT_PUBLIC_TAWK_WIDGET_ID: '1k3ndn318',
};
