import nextEnv from '@next/env';
const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd(), false, { info() {}, error() {} });
const env = process.env;
// Keep the same precedence as getDeploymentEnvironment() in lib/deployment.ts.
// A provider's preview marker cannot be overridden by the generic marker.
const deploymentEnvironment = env.VERCEL_ENV?.trim() || env.DEPLOYMENT_ENV?.trim();
if (process.argv.includes('--if-production') && deploymentEnvironment !== 'production') process.exit(0);
const problems = [];
const notes = [];
const required = (condition, message) => { if (!condition) problems.push(message); };
const configured = (value) => Boolean(value?.trim()) && !/xxxxx|replace.me|your[_-]/i.test(value);

required(deploymentEnvironment === 'production', 'Set DEPLOYMENT_ENV=production on the intended production host (Vercel uses its platform-provided VERCEL_ENV).');
required(env.HOSTING_PROVIDER === undefined || ['cloudflare', 'vercel', 'generic'].includes(env.HOSTING_PROVIDER), 'Set HOSTING_PROVIDER to cloudflare, vercel or generic, or leave it unset on an existing host.');
const contactOnly = env.NEXT_PUBLIC_CONTACT_ONLY === 'true';
function checkChatConfiguration() {
  required(/^[a-f0-9]{24}$/i.test(env.NEXT_PUBLIC_TAWK_PROPERTY_ID?.trim() ?? ''), 'Configure NEXT_PUBLIC_TAWK_PROPERTY_ID with the 24-character hexadecimal property ID from the live-chat account.');
  required(/^[a-z0-9]{1,64}$/i.test(env.NEXT_PUBLIC_TAWK_WIDGET_ID?.trim() ?? ''), 'Configure NEXT_PUBLIC_TAWK_WIDGET_ID with the 1–64 character alphanumeric widget ID from the live-chat account.');
  notes.push('Test live chat with a real available agent and verify its offline message form before launch.');
}
if (contactOnly) {
  required(['https://origin-peach.vercel.app', 'https://originrepairs.com'].includes(env.NEXT_PUBLIC_SITE_URL), 'Contact-only publishing requires NEXT_PUBLIC_SITE_URL=https://origin-peach.vercel.app or https://originrepairs.com with no path, credentials, port or query.');
  for (const flag of [
    'PRODUCTION_OPERATIONS_ENABLED', 'EMAILS_ENABLED', 'REPAIR_WRITES_ENABLED',
    'SITE_INDEXING_ENABLED', 'ALLOW_PREVIEW_EMAILS', 'ALLOW_PREVIEW_REPAIR_WRITES',
    'NEXT_PUBLIC_BOOKING_ENABLED', 'NEXT_PUBLIC_WALK_INS_ENABLED',
    'NEXT_PUBLIC_MAIL_IN_ENABLED', 'NEXT_PUBLIC_TRACKING_ENABLED',
    'NEXT_PUBLIC_CUSTOMER_ACCOUNTS_ENABLED',
  ]) {
    required(env[flag] === undefined || env[flag] === 'false', `Contact-only publishing requires ${flag}=false or unset.`);
  }
  required(env.NEXT_PUBLIC_LIVE_CHAT_ENABLED === undefined || ['true', 'false'].includes(env.NEXT_PUBLIC_LIVE_CHAT_ENABLED), 'Set NEXT_PUBLIC_LIVE_CHAT_ENABLED to true or false, or leave it unset to disable chat in contact-only mode.');
  if (env.NEXT_PUBLIC_LIVE_CHAT_ENABLED === 'true') checkChatConfiguration();
  notes.push('Contact-only mode: online repair requests, mail-in, tracking, accounts, outbound email, database writes and search indexing remain disabled.');
  notes.push(env.NEXT_PUBLIC_LIVE_CHAT_ENABLED === 'true' ? 'Live chat is explicitly enabled as a separate customer-initiated contact channel.' : 'Live chat remains disabled.');
} else {
  required(env.NEXT_PUBLIC_SITE_URL === 'https://originrepairs.com', 'Set NEXT_PUBLIC_SITE_URL to https://originrepairs.com before building.');
  required(env.PRODUCTION_OPERATIONS_ENABLED === 'true', 'Confirm the owner checklist in docs/DEPLOYMENT.md, then set PRODUCTION_OPERATIONS_ENABLED=true.');
  required(env.EMAILS_ENABLED === 'true', 'Set EMAILS_ENABLED=true for live repair requests and contact messages.');
  required(env.ALLOW_PREVIEW_EMAILS !== 'true', 'Keep ALLOW_PREVIEW_EMAILS=false in production.');
  required(configured(env.RESEND_API_KEY), 'Configure a real RESEND_API_KEY with a verified sending domain.');
  required(configured(env.RESEND_FROM_EMAIL) && /@originrepairs\.com>?$/.test(env.RESEND_FROM_EMAIL?.trim() ?? ''), 'Configure RESEND_FROM_EMAIL with a verified originrepairs.com sender.');
  required(configured(env.TURNSTILE_SECRET_KEY) && configured(env.NEXT_PUBLIC_TURNSTILE_SITE_KEY), 'Configure both Turnstile keys for the production domain; in-memory rate limits do not span server instances.');
  for (const flag of ['NEXT_PUBLIC_BOOKING_ENABLED', 'NEXT_PUBLIC_WALK_INS_ENABLED', 'NEXT_PUBLIC_MAIL_IN_ENABLED', 'NEXT_PUBLIC_TRACKING_ENABLED', 'NEXT_PUBLIC_CUSTOMER_ACCOUNTS_ENABLED', 'NEXT_PUBLIC_LIVE_CHAT_ENABLED', 'SITE_INDEXING_ENABLED']) {
    required(['true', 'false'].includes(env[flag]), `Set ${flag} explicitly to true or false.`);
  }
  // These features default to enabled in business-config.ts/liveChat.ts. Missing
  // or invalid public flags must not suppress their configuration checks.
  const enabledByDefault = (name) => env[name] !== 'false';
  if (enabledByDefault('NEXT_PUBLIC_TRACKING_ENABLED')) {
    required(env.REPAIR_WRITES_ENABLED === 'true', 'Set REPAIR_WRITES_ENABLED=true after the production repair database is ready.');
    required(env.ALLOW_PREVIEW_REPAIR_WRITES !== 'true', 'Keep ALLOW_PREVIEW_REPAIR_WRITES=false in production.');
    required(configured(env.DATABASE_URL) && /^postgres(?:ql)?:\/\//.test(env.DATABASE_URL), 'Configure DATABASE_URL for the production PostgreSQL database and apply the tracked migration.');
    required(env.NEXT_PUBLIC_CUSTOMER_ACCOUNTS_ENABLED === 'true', 'Tracking requires customer accounts for private repair access.');
    required(configured(env.STAFF_EMAILS) && env.STAFF_EMAILS.split(',').every((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())), 'Configure STAFF_EMAILS with the owner-approved staff email addresses.');
    notes.push('Verify the database migration and backups, customer isolation, staff access and the first real status update. Staff must monitor the dashboard even if a notification email fails.');
  }
  if (enabledByDefault('NEXT_PUBLIC_CUSTOMER_ACCOUNTS_ENABLED')) {
    required(configured(env.AUTH_SECRET) && env.AUTH_SECRET.trim().length >= 32, 'Configure a dedicated AUTH_SECRET of at least 32 random characters for customer accounts.');
    required(env.AUTH_BASE_URL === env.NEXT_PUBLIC_SITE_URL, 'Set AUTH_BASE_URL to the canonical HTTPS site URL.');

  }
  if (enabledByDefault('NEXT_PUBLIC_MAIL_IN_ENABLED')) {
    required(env.NEXT_PUBLIC_BOOKING_ENABLED === 'true', 'Mail-in requires online repair requests to be enabled.');
    notes.push('Confirm packing instructions, postage responsibility, return process and service terms before accepting mail-in devices.');
  }
  if (enabledByDefault('NEXT_PUBLIC_LIVE_CHAT_ENABLED')) {
    checkChatConfiguration();
  }
  if (env.SITE_INDEXING_ENABLED !== 'true') notes.push('Search indexing is disabled. Enable it only for the reviewed canonical production release.');
}
if (env.SITE_CONTENT_LAST_MODIFIED) {
  const date = new Date(env.SITE_CONTENT_LAST_MODIFIED);
  required(!Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === env.SITE_CONTENT_LAST_MODIFIED, 'SITE_CONTENT_LAST_MODIFIED must be a real date in YYYY-MM-DD format.');
}
console.log('Origin Repairs deployment readiness');
for (const problem of problems) console.log(`BLOCKED: ${problem}`);
for (const note of notes) console.log(`NOTE: ${note}`);
console.log(problems.length ? `${problems.length} configuration requirement(s) remain. No secrets printed and no messages sent.` : contactOnly ? 'Contact-only configuration checks passed. Full-service launch remains disabled.' : 'Configuration checks passed. Complete the live delivery, domain and owner checks in docs/DEPLOYMENT.md before launch.');
process.exitCode = problems.length ? 1 : 0;
