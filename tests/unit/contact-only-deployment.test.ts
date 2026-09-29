import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { NextRequest } from "next/server";
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const script = fileURLToPath(new URL("../../scripts/check-deployment.mjs", import.meta.url));
const cwd = mkdtempSync(join(tmpdir(), "origin-contact-only-check-"));
afterAll(() => rmSync(cwd, { recursive: true, force: true }));

const disabledFlags = [
  "PRODUCTION_OPERATIONS_ENABLED", "EMAILS_ENABLED", "REPAIR_WRITES_ENABLED",
  "SITE_INDEXING_ENABLED", "ALLOW_PREVIEW_EMAILS", "ALLOW_PREVIEW_REPAIR_WRITES",
  "NEXT_PUBLIC_BOOKING_ENABLED", "NEXT_PUBLIC_WALK_INS_ENABLED",
  "NEXT_PUBLIC_MAIL_IN_ENABLED", "NEXT_PUBLIC_TRACKING_ENABLED",
  "NEXT_PUBLIC_CUSTOMER_ACCOUNTS_ENABLED", "NEXT_PUBLIC_LIVE_CHAT_ENABLED",
] as const;

function check(overrides: Record<string, string | undefined> = {}, args: string[] = []) {
  // A fresh directory and explicit environment prevent accidental use of real
  // local credentials. These checks do not contact any service providers.
  const result = spawnSync(process.execPath, [script, ...args], {
    cwd,
    env: {
      NODE_ENV: "production",
      VERCEL_ENV: "production",
      NEXT_PUBLIC_CONTACT_ONLY: "true",
      NEXT_PUBLIC_SITE_URL: "https://origin-peach.vercel.app",
      ...overrides,
    },
    encoding: "utf8",
    timeout: 10_000,
  });
  if (result.error) throw result.error;
  return { status: result.status, output: result.stdout + result.stderr };
}

beforeEach(() => {
  vi.resetModules();
  vi.stubEnv("NEXT_PUBLIC_CONTACT_ONLY", "true");
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://origin-peach.vercel.app");
  vi.stubEnv("VERCEL_ENV", "production");
  vi.stubEnv("DEPLOYMENT_ENV", undefined);
  // Runtime policy must remain safe even if conflicting switches reach it
  // through a misconfigured deployment that bypassed the build command.
  for (const flag of disabledFlags) vi.stubEnv(flag, "true");
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.resetModules();
});

describe("explicit contact-only production gate", () => {
  it.each(["https://origin-peach.vercel.app", "https://originrepairs.co.uk"])("permits informational publishing at %s without provider credentials", (url) => {
    const result = check({ NEXT_PUBLIC_SITE_URL: url }, ["--if-production"]);
    expect(result.status).toBe(0);
    expect(result.output).toContain("Contact-only configuration checks passed");
    expect(result.output).toContain("Full-service launch remains disabled");
    expect(result.output).not.toContain("BLOCKED:");
  });

  it.each([
    undefined, "http://origin-peach.vercel.app", "https://other.vercel.app",
    "https://origin-peach.vercel.app.evil.example", "https://origin-peach.vercel.app@evil.example",
    "https://user@origin-peach.vercel.app", "https://origin-peach.vercel.app:443",
    "https://origin-peach.vercel.app/path", "https://origin-peach.vercel.app?test=1",
    "https://origin-peach.vercel.app#section", "https://www.originrepairs.co.uk",
  ])("rejects an unapproved or non-canonical publishing URL: %s", (url) => {
    const result = check({ NEXT_PUBLIC_SITE_URL: url });
    expect(result.status).toBe(1);
    expect(result.output).toContain("Contact-only publishing requires NEXT_PUBLIC_SITE_URL=");
  });

  it.each(disabledFlags)("rejects enabling %s in contact-only production", (flag) => {
    const result = check({ [flag]: "true" });
    expect(result.status).toBe(1);
    expect(result.output).toContain(`requires ${flag}=false or unset`);
  });

  it("accepts explicitly disabled flags and rejects malformed flag values", () => {
    expect(check(Object.fromEntries(disabledFlags.map((flag) => [flag, "false"]))).status).toBe(0);
    expect(check({ NEXT_PUBLIC_BOOKING_ENABLED: "invalid" }).status).toBe(1);
  });

  it.each([undefined, "false", "TRUE"])("never skips full launch requirements without the exact opt-in: %s", (flag) => {
    const result = check({ NEXT_PUBLIC_CONTACT_ONLY: flag });
    expect(result.status).toBe(1);
    expect(result.output).toContain("Configure a real RESEND_API_KEY");
    expect(result.output).toContain("Configure DATABASE_URL");
    expect(result.output).not.toContain("Contact-only configuration checks passed");
  });

  it.each([
    { VERCEL_ENV: "preview", DEPLOYMENT_ENV: "production" },
    { VERCEL_ENV: undefined, DEPLOYMENT_ENV: undefined },
  ])("does not approve a preview or NODE_ENV alone as production: %j", (environment) => {
    const result = check(environment);
    expect(result.status).toBe(1);
    expect(result.output).toContain("Set DEPLOYMENT_ENV=production on the intended production host");
  });
});

describe("contact-only runtime isolation", () => {
  it.each(["production", "preview", undefined])("blocks operational flags and preview overrides in stage %s", async (stage) => {
    vi.stubEnv("VERCEL_ENV", stage);
    const [{ FEATURES, CONTACT_ONLY_MODE }, deployment] = await Promise.all([
      import("@/lib/business-config"), import("@/lib/deployment"),
    ]);
    expect(CONTACT_ONLY_MODE).toBe(true);
    expect(Object.values(FEATURES)).toEqual([false, false, false, false, false]);
    expect(deployment.IS_PRODUCTION_DEPLOYMENT).toBe(false);
    expect(deployment.EMAIL_DELIVERY_ENABLED).toBe(false);
    expect(deployment.INDEXING_ENABLED).toBe(false);
    expect(deployment.areRepairWritesEnabled()).toBe(false);
  });

  it("also blocks approved operations on the existing custom domain", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://originrepairs.co.uk");
    const deployment = await import("@/lib/deployment");
    expect(deployment.IS_PRODUCTION_DEPLOYMENT).toBe(false);
    expect(deployment.EMAIL_DELIVERY_ENABLED).toBe(false);
    expect(deployment.areRepairWritesEnabled()).toBe(false);
    expect(deployment.INDEXING_ENABLED).toBe(false);
  });

  it("does not contact an email provider even when a key and enable flags exist", async () => {
    vi.stubEnv("RESEND_API_KEY", "local-test-key-no-real-provider");
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    const { sendEmail } = await import("@/lib/server/email");
    expect(await sendEmail({ to: "customer@example.test", subject: "Test", html: "Test" })).toEqual({ ok: false, reason: "disabled" });
    expect(fetch).not.toHaveBeenCalled();
  });

  it("rejects direct contact submissions before reading the body or starting side effects", async () => {
    const request = new NextRequest("https://origin-peach.vercel.app/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{malformed customer payload",
    });
    const read = vi.spyOn(request.body!, "getReader");
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    const security = await import("@/lib/server/requestSecurity");
    const rateLimit = vi.spyOn(security, "checkRateLimit");
    const begin = vi.spyOn(security, "beginIdempotentRequest");
    const { POST } = await import("@/app/api/contact/route");
    const response = await POST(request);
    expect(response.status).toBe(503);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(await response.json()).toEqual({ error: expect.any(String) });
    expect(request.bodyUsed).toBe(false);
    expect(read).not.toHaveBeenCalled();
    expect(rateLimit).not.toHaveBeenCalled();
    expect(begin).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("disables a configured chat provider", async () => {
    vi.stubEnv("NEXT_PUBLIC_TAWK_PROPERTY_ID", "0123456789abcdef01234567");
    vi.stubEnv("NEXT_PUBLIC_TAWK_WIDGET_ID", "testwidget1");
    const { liveChatConfiguration } = await import("@/lib/liveChat");
    expect(liveChatConfiguration()).toEqual({ enabled: false, scriptUrl: null });
  });

  it("preserves the full operational mode without contact-only opt-in", async () => {
    vi.stubEnv("NEXT_PUBLIC_CONTACT_ONLY", "false");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://originrepairs.co.uk");
    const [{ FEATURES }, deployment] = await Promise.all([
      import("@/lib/business-config"), import("@/lib/deployment"),
    ]);
    expect(Object.values(FEATURES)).toEqual([true, true, true, true, true]);
    expect(deployment.IS_PRODUCTION_DEPLOYMENT).toBe(true);
    expect(deployment.EMAIL_DELIVERY_ENABLED).toBe(true);
    expect(deployment.INDEXING_ENABLED).toBe(true);
    expect(deployment.areRepairWritesEnabled()).toBe(true);
  });
});
