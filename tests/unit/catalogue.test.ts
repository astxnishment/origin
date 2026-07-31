import { describe, expect, it } from "vitest";
import {
  ALL_DEVICES,
  REPAIR_TYPES,
  buildRepairSlug,
  getRepairQuote,
  getRepairTiers,
  getSupportedRepairTypes,
  parseRepairSlug,
} from "@/lib/calculatorData";
import {
  PUBLIC_REPAIR_CATALOGUE,
  getSeoEligibleEntries,
} from "@/lib/repairCatalogue";
import { ALL_PUBLIC_PRICES } from "@/lib/publicPricing";

describe("canonical repair catalogue", () => {
  it("contains only customer-visible records", () => {
    expect(PUBLIC_REPAIR_CATALOGUE.length).toBeGreaterThan(0);
    expect(
      PUBLIC_REPAIR_CATALOGUE.every((entry) =>
        ["public", "quote-only"].includes(entry.visibility)
      )
    ).toBe(true);
  });

  it("powers the public price table without changing price, time or warranty", () => {
    for (const row of ALL_PUBLIC_PRICES) {
      const source = PUBLIC_REPAIR_CATALOGUE.find(
        (entry) => entry.id === row.id
      );
      expect(source, row.id).toBeDefined();
      expect(row.minPrice).toBe(source?.minPrice);
      expect(row.maxPrice).toBe(source?.maxPrice);
      expect(row.time).toBe(source?.estimatedTime);
      expect(row.warranty).toBe(source?.warranty);
    }
  });

  it("only creates valid generated repair routes", () => {
    for (const device of ALL_DEVICES) {
      for (const repairType of getSupportedRepairTypes(device)) {
        const tiers = getRepairTiers(device, repairType);
        if (!tiers.some((tier) => tier.seoEligible)) continue;
        const slug = buildRepairSlug(device, repairType);
        const parsed = parseRepairSlug(slug);
        expect(parsed?.device.id, slug).toBe(device.id);
        expect(parsed?.repairType, slug).toBe(repairType);
      }
    }
  });

  it("does not accept an impossible repair slug", () => {
    const phone = ALL_DEVICES.find((device) => device.category === "phone");
    expect(phone).toBeDefined();
    expect(
      parseRepairSlug(
        `${phone?.id}-keyboard-trackpad-repair-leeds`
      )
    ).toBeNull();
  });

  it("keeps part tiers distinct instead of silently taking the cheapest", () => {
    const candidate = ALL_DEVICES.find((device) =>
      REPAIR_TYPES.some(
        (repair) => getRepairTiers(device, repair).length > 1
      )
    );
    expect(candidate).toBeDefined();
    const repair = REPAIR_TYPES.find(
      (item) => candidate && getRepairTiers(candidate, item).length > 1
    );
    expect(repair).toBeDefined();
    const tiers = getRepairTiers(candidate!, repair!);
    const quotes = tiers.map((tier) =>
      getRepairQuote(candidate!, repair!, tier.partTierId)
    );
    expect(new Set(quotes.map((quote) => quote.partTierId)).size).toBe(
      tiers.length
    );
  });

  it("marks every SEO entry as visible and useful", () => {
    for (const entry of getSeoEligibleEntries()) {
      expect(entry.visibility).toBe("public");
      expect(
        entry.minPrice !== null || entry.inspectionRequired
      ).toBe(true);
    }
  });

  it("does not expose conditional no-fee promises from source imports", () => {
    expect(
      PUBLIC_REPAIR_CATALOGUE.some((entry) =>
        /no recovery,\s*no fee|no fix,\s*no fee/i.test(entry.customerNote)
      )
    ).toBe(false);
  });

  it("includes liquid damage pricing for desktop and custom PC repairs", () => {
    expect(
      PUBLIC_REPAIR_CATALOGUE.some(
        (entry) =>
          entry.category === "desktop" &&
          entry.repairType === "Liquid damage repair"
      )
    ).toBe(true);
  });
});
