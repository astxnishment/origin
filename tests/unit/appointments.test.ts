import { describe, expect, it } from "vitest";
import { londonDate, slotsForDate, isRequestDateValid } from "@/lib/appointments";
import { resolveDeviceImage } from "@/lib/deviceImages/deviceImageResolver";

describe("Leeds appointment times", () => {
  it("uses the UK date around summer midnight", () => {
    expect(londonDate(new Date("2026-07-29T23:30:00Z"))).toBe("2026-07-30");
  });
  it("rejects past and impossible dates", () => {
    const now = new Date("2026-01-01T12:00:00Z");
    expect(isRequestDateValid("2026-02-30", now)).toBe(false);
    expect(slotsForDate("2025-12-31", now)).toEqual([]);
  });
  it("offers only the remaining UK times today", () => {
    expect(slotsForDate("2026-09-22", new Date("2026-09-22T12:30:00Z"))).toEqual(["2:00pm", "3:00pm", "4:00pm", "5:00pm"]);
  });
  it("enforces Saturday opening hours and Sunday closure", () => {
    const now = new Date("2026-09-22T12:00:00Z");
    expect(slotsForDate("2026-09-26", now)).toEqual(["10:00am", "11:00am", "12:00pm", "1:00pm", "2:00pm", "3:00pm"]);
    expect(slotsForDate("2026-09-27", now)).toEqual([]);
  });
});

describe("device category imagery", () => {
  it.each([["Galaxy Book6", "laptop", "galaxy-book"], ["Galaxy Tab S11", "tablet", "galaxy-tab"], ["Galaxy Z Flip8", "phone", "galaxy-flip"]] as const)("uses the right shape for %s", (model, category, variant) => {
    expect(resolveDeviceImage({ brand: "Samsung", model, category })).toEqual({ strategy: "samsung-svg", variant });
  });
  it("does not show a slab phone photograph for a folding Pixel", () => {
    expect(resolveDeviceImage({ brand: "Google Pixel", model: "Pixel 9 Pro Fold" })).toEqual({ strategy: "pixel-svg", variant: "pixelfold" });
  });
});
