import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("feature flags", () => {
  it("defaults to the owner-requested mail-in and tracking launch services", async () => {
    for (const name of ["NEXT_PUBLIC_CUSTOMER_ACCOUNTS_ENABLED", "NEXT_PUBLIC_TRACKING_ENABLED", "NEXT_PUBLIC_MAIL_IN_ENABLED", "NEXT_PUBLIC_WALK_INS_ENABLED"]) vi.stubEnv(name, undefined);
    const { FEATURES } = await import("@/lib/business-config");
    expect(FEATURES.trackingEnabled).toBe(true);
    expect(FEATURES.customerAccountsEnabled).toBe(true);
    expect(FEATURES.mailInEnabled).toBe(true);
    expect(FEATURES.walkInsEnabled).toBe(false);
  });

  it("allows an owner-verified feature to be enabled explicitly", async () => {
    vi.stubEnv("NEXT_PUBLIC_MAIL_IN_ENABLED", "true");
    const { FEATURES } = await import("@/lib/business-config");
    expect(FEATURES.mailInEnabled).toBe(true);
  });

  it("keeps data recovery and liquid damage as separate services", async () => {
    const { SERVICES } = await import("@/lib/business-config");
    const serviceNames = SERVICES.map((service) => service.name);

    expect(serviceNames).toContain("Data Recovery");
    expect(serviceNames).toContain("Liquid Damage Repair");
    expect(serviceNames).not.toContain("Data Recovery & Liquid Damage");
  });
});
