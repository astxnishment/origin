import { describe, expect, it } from "vitest";
import { CURRENT_DEVICE_ADDITIONS } from "@/lib/currentDevices";
import {
  ALL_DEVICES,
  getRepairQuote,
  getRepairTiers,
  getSupportedRepairTypes,
  isRepairSupported,
} from "@/lib/calculatorData";
import { PUBLIC_REPAIR_CATALOGUE, getSeoEligibleEntries } from "@/lib/repairCatalogue";
import { ALL_PUBLIC_PRICES } from "@/lib/publicPricing";
import { getVisibleModels } from "@/lib/serviceCatalogue";

describe("current model enquiries", () => {
  it("makes verified current families selectable in the right category", () => {
    for (const expected of CURRENT_DEVICE_ADDITIONS) {
      const device = ALL_DEVICES.find((candidate) => candidate.name === expected.model);
      expect(device, expected.model).toMatchObject({ brand: expected.brand, category: expected.category });
      expect(getVisibleModels(expected.brand, expected.category)).toContain(expected.model);
    }
    const names = ALL_DEVICES.map((device) => device.name);
    expect(names).toEqual(expect.arrayContaining([
      "Pixel 11 Pro XL", "Pixel 10a", "Galaxy S26 Plus", "Galaxy Z Fold8 Ultra",
      "Galaxy A57 5G", "iPad Pro 11-inch M5", "MacBook Air 13-inch M5", "MacBook Neo A18 Pro",
      "Galaxy Tab S11", "Galaxy Book6 Pro",
    ]));
  });

  it("never borrows a price or warranty from generic specialist work for new models", () => {
    for (const { model } of CURRENT_DEVICE_ADDITIONS) {
      const device = ALL_DEVICES.find((candidate) => candidate.name === model)!;
      const repairs = getSupportedRepairTypes(device);
      expect(repairs, model).toContain("Screen replacement");
      expect(repairs, model).toContain("Other repair");
      for (const repair of repairs) {
        const quote = getRepairQuote(device, repair);
        expect(quote, `${model}: ${repair}`).toMatchObject({
          inspectionRequired: true,
          warranty: "Confirmed after inspection",
          estimatedTime: "Confirmed after assessment",
        });
        const entries = getRepairTiers(device, repair);
        expect(entries.length).toBeGreaterThan(0);
        for (const entry of entries) {
          expect(entry.minPrice).toBeNull();
          expect(entry.maxPrice).toBeNull();
          expect(entry.visibility).toBe("quote-only");
        }
      }
    }
  });

  it("does not offer generic RAM upgrades or fan service on current fanless MacBooks", () => {
    for (const name of ["MacBook Air 13-inch M5", "MacBook Neo A18 Pro"]) {
      const device = ALL_DEVICES.find((candidate) => candidate.name === name)!;
      expect(getSupportedRepairTypes(device)).not.toContain("SSD / RAM upgrade");
      expect(getSupportedRepairTypes(device)).not.toContain("Overheating / fan service");
      expect(isRepairSupported(device.id, "ssd-ram-upgrade")).toBe(false);
      expect(getRepairQuote(device, "SSD / RAM upgrade").supported).toBe(false);
    }
  });

  it("keeps new enquiries out of generated repair pages and links pricing directly to booking", () => {
    const names = new Set(CURRENT_DEVICE_ADDITIONS.map((device) => device.model));
    expect(getSeoEligibleEntries().some((entry) => names.has(entry.model))).toBe(false);
    const rows = ALL_PUBLIC_PRICES.filter((row) => names.has(row.model));
    expect(rows.length).toBeGreaterThan(CURRENT_DEVICE_ADDITIONS.length);
    for (const row of rows) {
      expect(row.href).toMatch(/^\/book\?/);
      expect(row.minPrice).toBeNull();
      expect(row.maxPrice).toBeNull();
    }
  });

  it("keeps S26 and S26 Plus identifiers and prices separate", () => {
    const base = ALL_DEVICES.find((device) => device.name === "Galaxy S26")!;
    const plus = ALL_DEVICES.find((device) => device.name === "Galaxy S26 Plus")!;
    expect(base.id).not.toBe(plus.id);
    expect(getRepairTiers(base, "Screen replacement").every((entry) => entry.source === "pricing-workbook")).toBe(true);
    expect(getRepairTiers(plus, "Screen replacement").every((entry) => entry.minPrice === null)).toBe(true);
    expect(new Set(ALL_DEVICES.map((device) => device.id)).size).toBe(ALL_DEVICES.length);
    expect(new Set(PUBLIC_REPAIR_CATALOGUE.map((entry) => entry.id)).size).toBe(PUBLIC_REPAIR_CATALOGUE.length);
  });

  it("retains the generic battery price without presenting a service as a MacBook model", () => {
    expect(PUBLIC_REPAIR_CATALOGUE.some((entry) => entry.model === "MacBook Battery Replacement")).toBe(true);
    expect(ALL_DEVICES.some((device) => device.name === "MacBook Battery Replacement")).toBe(false);
    expect(getVisibleModels("Apple", "laptop")).not.toContain("MacBook Battery Replacement");
  });

  it("allows an existing iPad digitizer price to be selected as a screen repair", () => {
    const device = ALL_DEVICES.find((candidate) => candidate.name === "iPad 9th Gen")!;
    expect(getSupportedRepairTypes(device)).toContain("Screen replacement");
    expect(getRepairTiers(device, "Screen replacement")[0].repairTypeId).toBe("screen-digitizer-replacement");
  });
});
