import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("sitemap", () => {
  it("is empty until canonical production indexing is explicitly approved", async () => {
    const { default: sitemap } = await import("@/app/sitemap");
    expect(sitemap()).toEqual([]);
  });

  it("contains no disabled prototype routes when production indexing is enabled", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("PRODUCTION_OPERATIONS_ENABLED", "true");
    vi.stubEnv("SITE_INDEXING_ENABLED", "true");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://originrepairs.co.uk");

    const { default: sitemap } = await import("@/app/sitemap");
    const urls = sitemap().map((entry) => entry.url);

    expect(urls.length).toBeGreaterThan(20);
    expect(urls.some((url) => /\/(track|login|signup|account)(\/|$)/.test(url))).toBe(
      false
    );
    expect(urls.every((url) => url.startsWith("https://originrepairs.co.uk"))).toBe(
      true
    );
  });
});
