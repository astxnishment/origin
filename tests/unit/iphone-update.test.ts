import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { ALL_DEVICES, getRepairQuote, getSupportedRepairTypes, getRepairTiers } from "@/lib/calculatorData";
import { NEW_IPHONE_MODELS, applePhoneImages } from "@/lib/deviceImages/appleDeviceImages";
import { resolveDeviceImage } from "@/lib/deviceImages/deviceImageResolver";
import { ALL_PUBLIC_PRICES } from "@/lib/publicPricing";
import { getSeoEligibleEntries } from "@/lib/repairCatalogue";
import { getVisibleModels } from "@/lib/serviceCatalogue";

describe("latest released iPhones", () => {
  it("lists recent iPhones consistently before older models", () => {
    const devices = ALL_DEVICES.filter((device) => device.name.startsWith("iPhone")).map((device) => device.name);
    expect(devices.slice(0, 3)).toEqual(["iPhone 18 Pro Max", "iPhone 18 Pro", "iPhone 17e"]);
    expect(devices.indexOf("iPhone 16")).toBeLessThan(devices.indexOf("iPhone 8"));
    expect(getVisibleModels("Apple", "phone")).toEqual(devices);
  });
  it("keeps iPhone models in booking rather than separate repair pages", () => {
    expect(getSeoEligibleEntries().some((entry) => entry.model.startsWith("iPhone"))).toBe(false);
    const rows = ALL_PUBLIC_PRICES.filter((row) => row.model.startsWith("iPhone"));
    expect(rows.length).toBeGreaterThan(0);
    for (const row of rows) expect(row.href).toMatch(/^\/book\?/);
  });
  it.each(NEW_IPHONE_MODELS)("keeps every %s repair assessment-only, including specialist work", (model) => {
    const device = ALL_DEVICES.find((item) => item.name === model)!;
    expect(device).toBeDefined();
    const repairs = getSupportedRepairTypes(device);
    expect(repairs).toContain("Screen replacement");
    expect(repairs).toContain("Motherboard / logic board");
    for (const repair of repairs) {
      const quote = getRepairQuote(device, repair);
      expect(quote.inspectionRequired, repair).toBe(true);
      expect(quote.warranty, repair).toBe("Confirmed after inspection");
      const entries = getRepairTiers(device, repair);
      expect(entries.length, repair).toBeGreaterThan(0);
      for (const entry of entries) {
        expect(entry.minPrice).toBeNull();
        expect(entry.maxPrice).toBeNull();
        expect(entry.seoEligible).toBe(false);
      }
    }
  });

  it("uses existing model-specific local images for recent iPhones", () => {
    for (const [model, image] of Object.entries(applePhoneImages)) {
      expect(resolveDeviceImage({ brand: "Apple", model })).toEqual({ strategy: "apple-local", ...image });
      expect(existsSync(`public${image.src}`), model).toBe(true);
    }
  });

  it("does not offer unreleased iPhone Duo repairs", () => {
    expect(ALL_DEVICES.some((device) => device.name === "iPhone Duo")).toBe(false);
  });
});
