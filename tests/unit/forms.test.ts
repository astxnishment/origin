import { describe, expect, it } from "vitest";
import {
  bookingRequestSchema,
  contactRequestSchema,
} from "@/lib/forms/schemas";
import {
  ALL_DEVICES,
  getSupportedRepairTypes,
} from "@/lib/calculatorData";

const device = ALL_DEVICES[0];
const repair = getSupportedRepairTypes(device)[0];
const futureDate = new Date();
futureDate.setUTCDate(futureDate.getUTCDate() + 14);
const futureDateValue = futureDate.toISOString().slice(0, 10);

const validBooking = {
  name: "Test Customer",
  email: "customer@example.com",
  phone: "+44 7700 900123",
  serviceMethod: "drop-off",
  returnAddress: "",
  deviceType: device.category,
  brand: device.brand,
  model: device.name,
  modelId: device.id,
  repair,
  partTierId: "",
  catalogueId: "",
  date: futureDateValue,
  time: "10:00am",
  issue: "Intermittent fault",
  consentToContact: true,
  website: "",
  formStartedAt: Date.now() - 5_000,
  turnstileToken: "",
  idempotencyKey: "test_booking_key_123456",
};

describe("form schemas", () => {
  it("accepts a well-formed repair request", () => {
    expect(bookingRequestSchema.safeParse(validBooking).success).toBe(true);
  });

  it("rejects invalid phone, date and consent", () => {
    const result = bookingRequestSchema.safeParse({
      ...validBooking,
      phone: "abc",
      date: "yesterday",
      consentToContact: false,
    });
    expect(result.success).toBe(false);
  });

  it("requires a return address only for mail-in requests", () => {
    const result = bookingRequestSchema.safeParse({
      ...validBooking,
      serviceMethod: "mail-in",
      returnAddress: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects contact payloads with HTML-sized or malformed fields", () => {
    const result = contactRequestSchema.safeParse({
      name: "A",
      email: "not-an-email",
      phone: "",
      device: "",
      issue: "x".repeat(3001),
      consentToContact: true,
      website: "",
      formStartedAt: Date.now() - 5_000,
      turnstileToken: "",
      idempotencyKey: "test_contact_key_123456",
    });
    expect(result.success).toBe(false);
  });
});
