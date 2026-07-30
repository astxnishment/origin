import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("feature flags", () => {
  it("keeps unfinished customer systems disabled by default", async () => {
    const { FEATURES } = await import("@/lib/business-config");
    expect(FEATURES.trackingEnabled).toBe(false);
    expect(FEATURES.customerAccountsEnabled).toBe(false);
    expect(FEATURES.mailInEnabled).toBe(false);
    expect(FEATURES.walkInsEnabled).toBe(false);
  });

  it("allows an owner-verified feature to be enabled explicitly", async () => {
    vi.stubEnv("NEXT_PUBLIC_MAIL_IN_ENABLED", "true");
    const { FEATURES } = await import("@/lib/business-config");
    expect(FEATURES.mailInEnabled).toBe(true);
  });
});
