import { describe, expect, it } from "vitest";
import { normaliseWarranty } from "@/lib/warranty";

describe("warranty formatting", () => {
  it.each([
    [0, "Diagnostic only"],
    [1, "1 month"],
    [3, "3 months"],
    ["N/A", "Not applicable"],
    ["12 months on supplied parts", "12 months on supplied parts"],
    [undefined, "Confirmed after inspection"],
  ])("normalises %s without a blanket fallback", (input, label) => {
    expect(normaliseWarranty(input).label).toBe(label);
  });
});
