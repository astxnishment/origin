import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, describe, expect, it } from "vitest";

const script = fileURLToPath(new URL("../../scripts/check-deployment.mjs", import.meta.url));
// Avoid reading the workspace's private .env files during configuration tests.
const cwd = mkdtempSync(join(tmpdir(), "origin-deployment-check-"));
afterAll(() => rmSync(cwd, { recursive: true, force: true }));

const readyConfiguration: NodeJS.ProcessEnv = {
  NODE_ENV: "production",
  DEPLOYMENT_ENV: "production",
  NEXT_PUBLIC_SITE_URL: "https://originrepairs.com",
  PRODUCTION_OPERATIONS_ENABLED: "true",
  EMAILS_ENABLED: "true",
  ALLOW_PREVIEW_EMAILS: "false",
  RESEND_API_KEY: "configuration-test-email-key-no-provider-called",
  RESEND_FROM_EMAIL: "Origin Repairs <noreply@originrepairs.com>",
  TURNSTILE_SECRET_KEY: "configuration-test-private-turnstile-key",
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: "configuration-test-public-turnstile-key",
  NEXT_PUBLIC_BOOKING_ENABLED: "true",
  NEXT_PUBLIC_WALK_INS_ENABLED: "false",
  NEXT_PUBLIC_MAIL_IN_ENABLED: "true",
  NEXT_PUBLIC_TRACKING_ENABLED: "true",
  NEXT_PUBLIC_CUSTOMER_ACCOUNTS_ENABLED: "true",
  NEXT_PUBLIC_LIVE_CHAT_ENABLED: "false",
  SITE_INDEXING_ENABLED: "false",
  REPAIR_WRITES_ENABLED: "true",
  ALLOW_PREVIEW_REPAIR_WRITES: "false",
  DATABASE_URL: "postgresql://test:fake-password@database.example.test/repairs",
  STAFF_EMAILS: "staff@example.test",
  AUTH_SECRET: "configuration-test-auth-secret-never-use-for-real-accounts",
  AUTH_BASE_URL: "https://originrepairs.com",
};

function check(overrides: Record<string, string | undefined> = {}, args = ["--if-production"]) {
  const result = spawnSync(process.execPath, [script, ...args], {
    cwd,
    env: { ...readyConfiguration, ...overrides },
    encoding: "utf8",
    timeout: 10_000,
  });
  if (result.error) throw result.error;
  return { status: result.status, output: result.stdout + result.stderr };
}

describe("deployment readiness on any Node host", () => {
  it.each(["CLOUDFLARE", "cloudflar", ""])("rejects an ambiguous hosting provider setting: %s", (provider) => {
    const result = check({ HOSTING_PROVIDER: provider });
    expect(result.status).toBe(1);
    expect(result.output).toContain("Set HOSTING_PROVIDER");
  });

  it("accepts a fully configured explicit Cloudflare deployment", () => {
    expect(check({ HOSTING_PROVIDER: "cloudflare" }).status).toBe(0);
  });

  it("rejects the former domain and sender for a full launch", () => {
    const result = check({ NEXT_PUBLIC_SITE_URL: "https://originrepairs.co.uk", RESEND_FROM_EMAIL: "Origin Repairs <noreply@originrepairs.co.uk>" });
    expect(result.status).toBe(1);
    expect(result.output).toContain("Set NEXT_PUBLIC_SITE_URL to https://originrepairs.com");
    expect(result.output).toContain("verified originrepairs.com sender");
  });

  it("runs the production build gate for the generic production marker without contacting providers", () => {
    const result = check();
    expect(result.status).toBe(0);
    expect(result.output).toContain("Configuration checks passed");
    for (const key of ["RESEND_API_KEY", "TURNSTILE_SECRET_KEY", "AUTH_SECRET", "DATABASE_URL"]) {
      expect(result.output).not.toContain(readyConfiguration[key]);
    }
  });

  it("fails the generic production build when required configuration is missing", () => {
    const result = check({ RESEND_API_KEY: undefined, DATABASE_URL: undefined });
    expect(result.status).toBe(1);
    expect(result.output).toContain("Configure a real RESEND_API_KEY");
    expect(result.output).toContain("Configure DATABASE_URL");
  });

  it("keeps Vercel production checks active when a generic value says preview", () => {
    const result = check({ VERCEL_ENV: "production", DEPLOYMENT_ENV: "preview", AUTH_SECRET: undefined });
    expect(result.status).toBe(1);
    expect(result.output).toContain("Configure a dedicated AUTH_SECRET");
  });

  it.each([
    { VERCEL_ENV: "preview", DEPLOYMENT_ENV: "production" },
    { VERCEL_ENV: undefined, DEPLOYMENT_ENV: "preview" },
    { VERCEL_ENV: undefined, DEPLOYMENT_ENV: undefined },
  ])("does not mistake a preview or NODE_ENV alone for a production release: %j", (environment) => {
    const result = check({ ...environment, AUTH_SECRET: undefined, DATABASE_URL: undefined });
    expect(result.status).toBe(0);
    expect(result.output).toBe("");
  });

  it("rejects promoting a Vercel preview in the explicit readiness command", () => {
    const result = check({ VERCEL_ENV: "preview", DEPLOYMENT_ENV: "production" }, []);
    expect(result.status).toBe(1);
    expect(result.output).toContain("Set DEPLOYMENT_ENV=production on the intended production host");
  });

  it.each([undefined, "invalid"])("checks default-on tracking/account requirements when public flags are %s", (flag) => {
    const result = check({
      NEXT_PUBLIC_TRACKING_ENABLED: flag,
      NEXT_PUBLIC_CUSTOMER_ACCOUNTS_ENABLED: flag,
      REPAIR_WRITES_ENABLED: undefined,
      DATABASE_URL: undefined,
      STAFF_EMAILS: undefined,
      AUTH_SECRET: undefined,
      AUTH_BASE_URL: undefined,
    });
    expect(result.status).toBe(1);
    for (const key of ["NEXT_PUBLIC_TRACKING_ENABLED", "NEXT_PUBLIC_CUSTOMER_ACCOUNTS_ENABLED", "REPAIR_WRITES_ENABLED", "DATABASE_URL", "STAFF_EMAILS", "AUTH_SECRET", "AUTH_BASE_URL"]) {
      expect(result.output).toContain(key);
    }
  });

  it("does not require disabled tracking/accounts services", () => {
    const result = check({
      NEXT_PUBLIC_TRACKING_ENABLED: "false",
      NEXT_PUBLIC_CUSTOMER_ACCOUNTS_ENABLED: "false",
      DATABASE_URL: undefined,
      STAFF_EMAILS: undefined,
      AUTH_SECRET: undefined,
      AUTH_BASE_URL: undefined,
    });
    expect(result.status).toBe(0);
  });

  it("continues to require operation approval and disables production preview overrides", () => {
    const result = check({ PRODUCTION_OPERATIONS_ENABLED: "false", ALLOW_PREVIEW_EMAILS: "true", ALLOW_PREVIEW_REPAIR_WRITES: "true" });
    expect(result.status).toBe(1);
    expect(result.output).toContain("PRODUCTION_OPERATIONS_ENABLED=true");
    expect(result.output).toContain("ALLOW_PREVIEW_EMAILS=false");
    expect(result.output).toContain("ALLOW_PREVIEW_REPAIR_WRITES=false");
  });

  it.each(["true", undefined, "invalid"])("requires live-chat IDs when its default-on flag is %s", (flag) => {
    const result = check({ NEXT_PUBLIC_LIVE_CHAT_ENABLED: flag });
    expect(result.status).toBe(1);
    expect(result.output).toContain("Configure NEXT_PUBLIC_TAWK_PROPERTY_ID");
    expect(result.output).toContain("Configure NEXT_PUBLIC_TAWK_WIDGET_ID");
    if (flag !== "true") expect(result.output).toContain("Set NEXT_PUBLIC_LIVE_CHAT_ENABLED explicitly");
  });

  it.each([
    { property: "a".repeat(23), widget: "Widget1", invalidKey: "NEXT_PUBLIC_TAWK_PROPERTY_ID" },
    { property: "g".repeat(24), widget: "Widget1", invalidKey: "NEXT_PUBLIC_TAWK_PROPERTY_ID" },
    { property: "a".repeat(24), widget: "", invalidKey: "NEXT_PUBLIC_TAWK_WIDGET_ID" },
    { property: "a".repeat(24), widget: "w".repeat(65), invalidKey: "NEXT_PUBLIC_TAWK_WIDGET_ID" },
    { property: "a".repeat(24), widget: "widget/path", invalidKey: "NEXT_PUBLIC_TAWK_WIDGET_ID" },
  ])("rejects malformed live-chat IDs: %j", ({ property, widget, invalidKey }) => {
    const result = check({ NEXT_PUBLIC_LIVE_CHAT_ENABLED: "true", NEXT_PUBLIC_TAWK_PROPERTY_ID: property, NEXT_PUBLIC_TAWK_WIDGET_ID: widget });
    expect(result.status).toBe(1);
    expect(result.output).toContain(`Configure ${invalidKey}`);
  });

  it.each(["w", "Widget1", "w".repeat(64)])("accepts configured live chat and records the real-agent/offline launch check: %s", (widget) => {
    const result = check({ NEXT_PUBLIC_LIVE_CHAT_ENABLED: "true", NEXT_PUBLIC_TAWK_PROPERTY_ID: " 0123456789ABCDEF01234567 ", NEXT_PUBLIC_TAWK_WIDGET_ID: ` ${widget} ` });
    expect(result.status).toBe(0);
    expect(result.output).toContain("Test live chat with a real available agent and verify its offline message form before launch.");
  });

  it("does not require IDs or imply availability for explicitly disabled live chat", () => {
    const result = check({ NEXT_PUBLIC_LIVE_CHAT_ENABLED: "false" });
    expect(result.status).toBe(0);
    expect(result.output).not.toContain("NEXT_PUBLIC_TAWK_PROPERTY_ID");
    expect(result.output).not.toContain("NEXT_PUBLIC_TAWK_WIDGET_ID");
    expect(result.output).not.toContain("Test live chat with a real available agent");
  });
});
