import { defineConfig } from "@playwright/test";

const port = process.env.PLAYWRIGHT_CLOUDFLARE_PORT ?? "3109";
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./tests/cloudflare",
  fullyParallel: true,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: process.env.CI ? "github" : "list",
  outputDir: "test-results/cloudflare",
  use: {
    baseURL,
    browserName: "chromium",
    serviceWorkers: "block",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "desktop-dark", use: { viewport: { width: 1440, height: 1000 }, colorScheme: "dark" } },
    { name: "mobile-light", use: { viewport: { width: 390, height: 844 }, colorScheme: "light" } },
    { name: "mobile-narrow", use: { viewport: { width: 320, height: 760 }, colorScheme: "light" } },
  ],
  webServer: {
    // Run a previously built Worker, never the development server or Next.js.
    command: `npm run preview:cloudflare -- --host 127.0.0.1 --port ${port}`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      VERCEL_ENV: "",
      DEPLOYMENT_ENV: "production",
      HOSTING_PROVIDER: "cloudflare",
      NEXT_PUBLIC_SITE_URL: "https://originrepairs.com",
      NEXT_PUBLIC_CONTACT_ONLY: "true",
      PRODUCTION_OPERATIONS_ENABLED: "false",
      SITE_INDEXING_ENABLED: "false",
      EMAILS_ENABLED: "false",
      ALLOW_PREVIEW_EMAILS: "false",
      REPAIR_WRITES_ENABLED: "false",
      ALLOW_PREVIEW_REPAIR_WRITES: "false",
      NEXT_PUBLIC_BOOKING_ENABLED: "false",
      NEXT_PUBLIC_WALK_INS_ENABLED: "false",
      NEXT_PUBLIC_MAIL_IN_ENABLED: "false",
      NEXT_PUBLIC_TRACKING_ENABLED: "false",
      NEXT_PUBLIC_CUSTOMER_ACCOUNTS_ENABLED: "false",
      NEXT_PUBLIC_LIVE_CHAT_ENABLED: "false",
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: "",
      NEXT_PUBLIC_TAWK_PROPERTY_ID: "",
      NEXT_PUBLIC_TAWK_WIDGET_ID: "",
      TURNSTILE_SECRET_KEY: "",
      RESEND_API_KEY: "",
      DATABASE_URL: "",
      AUTH_SECRET: "",
      STAFF_EMAILS: "",
    },
  },
});
