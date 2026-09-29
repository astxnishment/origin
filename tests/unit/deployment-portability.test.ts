import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

beforeEach(() => {
  vi.resetModules();
  vi.stubEnv("NODE_ENV", "production");
  vi.stubEnv("VERCEL_ENV", undefined);
  vi.stubEnv("DEPLOYMENT_ENV", undefined);
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://originrepairs.com");
  vi.stubEnv("PRODUCTION_OPERATIONS_ENABLED", "true");
  vi.stubEnv("SITE_INDEXING_ENABLED", "true");
  vi.stubEnv("EMAILS_ENABLED", "true");
  vi.stubEnv("REPAIR_WRITES_ENABLED", "true");
  vi.stubEnv("ALLOW_PREVIEW_EMAILS", "false");
  vi.stubEnv("ALLOW_PREVIEW_REPAIR_WRITES", "false");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("host-independent production controls", () => {
  it("uses the confirmed .com domain when no canonical override is configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", undefined);
    const { SEO } = await import("@/lib/business-config");
    expect(SEO.siteUrl).toBe("https://originrepairs.com");
  });

  it("keeps Cloudflare production operations off until explicitly approved", async () => {
    vi.stubEnv("HOSTING_PROVIDER", "cloudflare");
    vi.stubEnv("DEPLOYMENT_ENV", "production");
    vi.stubEnv("PRODUCTION_OPERATIONS_ENABLED", "false");
    vi.stubEnv("ALLOW_PREVIEW_EMAILS", "true");
    vi.stubEnv("ALLOW_PREVIEW_REPAIR_WRITES", "true");
    const deployment = await import("@/lib/deployment");
    expect(deployment.IS_PRODUCTION_DEPLOYMENT).toBe(false);
    expect(deployment.EMAIL_DELIVERY_ENABLED).toBe(false);
    expect(deployment.areRepairWritesEnabled()).toBe(false);
    expect(deployment.INDEXING_ENABLED).toBe(false);
  });

  it.each(["https://originrepairs.co.uk", "https://originrepairs.com:8443", "https://user@originrepairs.com", "https://originrepairs.com/path", "https://originrepairs.com?test=1"])("does not approve a different production origin: %s", async (url) => {
    vi.stubEnv("DEPLOYMENT_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", url);
    const deployment = await import("@/lib/deployment");
    expect(deployment.IS_PRODUCTION_DEPLOYMENT).toBe(false);
    expect(deployment.EMAIL_DELIVERY_ENABLED).toBe(false);
    expect(deployment.areRepairWritesEnabled()).toBe(false);
  });

  it.each([
    { vercel: undefined, generic: "production", expected: "production" },
    { vercel: undefined, generic: "preview", expected: "preview" },
    { vercel: undefined, generic: "development", expected: "development" },
    { vercel: undefined, generic: undefined, expected: "unknown" },
    { vercel: undefined, generic: "prod", expected: "unknown" },
    { vercel: "preview", generic: "production", expected: "preview" },
    { vercel: "development", generic: "production", expected: "development" },
    { vercel: "production", generic: "preview", expected: "production" },
    { vercel: "unrecognised", generic: "production", expected: "unknown" },
  ])("resolves an explicit hosting stage without trusting NODE_ENV: %j", async ({ vercel, generic, expected }) => {
    vi.stubEnv("VERCEL_ENV", vercel);
    vi.stubEnv("DEPLOYMENT_ENV", generic);
    const deployment = await import("@/lib/deployment");
    expect(deployment.getDeploymentEnvironment()).toBe(expected);
    expect(deployment.isProductionEnvironment()).toBe(expected === "production");
    expect(deployment.IS_PRODUCTION_DEPLOYMENT).toBe(expected === "production");
    expect(deployment.EMAIL_DELIVERY_ENABLED).toBe(expected === "production");
    expect(deployment.INDEXING_ENABLED).toBe(expected === "production");
    expect(deployment.areRepairWritesEnabled()).toBe(expected === "production");
  });

  it("requires owner approval on a generic production host even when preview overrides are set", async () => {
    vi.stubEnv("DEPLOYMENT_ENV", "production");
    vi.stubEnv("PRODUCTION_OPERATIONS_ENABLED", "false");
    vi.stubEnv("ALLOW_PREVIEW_EMAILS", "true");
    vi.stubEnv("ALLOW_PREVIEW_REPAIR_WRITES", "true");
    const deployment = await import("@/lib/deployment");
    expect(deployment.isProductionEnvironment()).toBe(true);
    expect(deployment.IS_PRODUCTION_DEPLOYMENT).toBe(false);
    expect(deployment.EMAIL_DELIVERY_ENABLED).toBe(false);
    expect(deployment.INDEXING_ENABLED).toBe(false);
    expect(deployment.areRepairWritesEnabled()).toBe(false);
  });

  it("preserves each independent operation switch on a generic production host", async () => {
    vi.stubEnv("DEPLOYMENT_ENV", "production");
    vi.stubEnv("SITE_INDEXING_ENABLED", "false");
    vi.stubEnv("EMAILS_ENABLED", "false");
    vi.stubEnv("REPAIR_WRITES_ENABLED", "false");
    const deployment = await import("@/lib/deployment");
    expect(deployment.IS_PRODUCTION_DEPLOYMENT).toBe(true);
    expect(deployment.EMAIL_DELIVERY_ENABLED).toBe(false);
    expect(deployment.INDEXING_ENABLED).toBe(false);
    expect(deployment.areRepairWritesEnabled()).toBe(false);
  });

  it("keeps production operations disabled for a different canonical domain", async () => {
    vi.stubEnv("DEPLOYMENT_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://staging.example.com");
    const deployment = await import("@/lib/deployment");
    expect(deployment.IS_PRODUCTION_DEPLOYMENT).toBe(false);
    expect(deployment.EMAIL_DELIVERY_ENABLED).toBe(false);
    expect(deployment.INDEXING_ENABLED).toBe(false);
    expect(deployment.areRepairWritesEnabled()).toBe(false);
  });

  it("allows separately opted-in generic preview operations without enabling indexing", async () => {
    vi.stubEnv("DEPLOYMENT_ENV", "preview");
    vi.stubEnv("ALLOW_PREVIEW_EMAILS", "true");
    vi.stubEnv("ALLOW_PREVIEW_REPAIR_WRITES", "true");
    const deployment = await import("@/lib/deployment");
    expect(deployment.IS_PRODUCTION_DEPLOYMENT).toBe(false);
    expect(deployment.EMAIL_DELIVERY_ENABLED).toBe(true);
    expect(deployment.areRepairWritesEnabled()).toBe(true);
    expect(deployment.INDEXING_ENABLED).toBe(false);
  });
});
