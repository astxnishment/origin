import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { POST as contactPost } from "@/app/api/contact/route";
import { POST as bookingPost } from "@/app/api/booking/route";
import { publicAuthOrigin } from "@/app/api/auth/magic-link/route";

const futureDate = new Date();
futureDate.setUTCDate(futureDate.getUTCDate() + 14);
const futureDateValue = futureDate.toISOString().slice(0, 10);

function request(path: string, body: unknown) {
  return new NextRequest(`http://localhost${path}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": "192.0.2.10",
    },
    body: JSON.stringify(body),
  });
}

describe("form APIs", () => {
  it("uses the active trusted Vercel origin for account links", () => {
    const request = new NextRequest(
      "https://origin-peach.vercel.app/api/auth/magic-link"
    );
    expect(publicAuthOrigin(request)).toBe("https://origin-peach.vercel.app");
  });

  it("returns field errors for an invalid contact request", async () => {
    const response = await contactPost(request("/api/contact", {}));
    expect(response.status).toBe(400);
    const result = await response.json();
    expect(result.error).toBe("Check the form and try again.");
    expect(result.fields).toBeDefined();
  });

  it("rejects invalid booking selections before email delivery", async () => {
    const response = await bookingPost(
      request("/api/booking", {
        name: "Test Customer",
        email: "customer@example.com",
        phone: "+44 7700 900123",
        serviceMethod: "drop-off",
        returnAddress: "",
        deviceType: "phone",
        brand: "Apple",
        model: "Imaginary Phone",
        modelId: "imaginary-phone",
        repair: "Keyboard / trackpad repair",
        partTierId: "",
        catalogueId: "",
        date: futureDateValue,
        time: "10:00am",
        issue: "",
        consentToContact: true,
        website: "",
        formStartedAt: Date.now() - 5_000,
        turnstileToken: "",
        idempotencyKey: "api_booking_test_123456",
      })
    );
    expect(response.status).toBe(400);
    const result = await response.json();
    expect(result.error).toContain("not currently available");
  });
});
