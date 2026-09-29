import { randomUUID } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { sendEmail } from "@/lib/server/email";
import { POST as contact } from "@/app/api/contact/route";
import { POST as booking } from "@/app/api/booking/route";

vi.mock("@/lib/server/email", () => ({ sendEmail: vi.fn() }));
const mockedEmail = vi.mocked(sendEmail);
beforeEach(() => { mockedEmail.mockReset(); vi.spyOn(console, "error").mockImplementation(() => {}); });
afterEach(() => vi.restoreAllMocks());

function request(path: string, extra: Record<string, unknown> = {}) {
  return new NextRequest(`https://originrepairs.co.uk/api/${path}`, {
    method: "POST", headers: { "content-type": "application/json", "x-forwarded-for": randomUUID() },
    body: JSON.stringify({ name: "Test Customer", email: "test@example.com", phone: "+44 7700 900123", issue: "First line.\nSecond line.", consentToContact: true, formStartedAt: Date.now() - 5000, idempotencyKey: randomUUID(), ...extra }),
  });
}

describe("email-backed form outcomes", () => {
  it("does not report success when the business email fails", async () => {
    mockedEmail.mockResolvedValue({ ok: false, reason: "provider", status: 503 });
    const response = await contact(request("contact"));
    expect(response.status).toBe(503);
    expect(await response.json()).not.toHaveProperty("ok", true);
    expect(mockedEmail).toHaveBeenCalledTimes(1);
  });
  it("records business delivery while honestly reporting a failed customer receipt", async () => {
    mockedEmail.mockResolvedValueOnce({ ok: true }).mockResolvedValueOnce({ ok: false, reason: "network" });
    const response = await contact(request("contact"));
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ ok: true, confirmationEmailSent: false });
  });
  it("retries a failed request and replays a completed duplicate", async () => {
    const idempotencyKey = randomUUID();
    mockedEmail.mockResolvedValueOnce({ ok: false, reason: "network" });
    expect((await contact(request("contact", { idempotencyKey }))).status).toBe(503);
    mockedEmail.mockResolvedValue({ ok: true });
    expect((await contact(request("contact", { idempotencyKey }))).status).toBe(200);
    expect((await contact(request("contact", { idempotencyKey }))).status).toBe(200);
    expect(mockedEmail).toHaveBeenCalledTimes(3);
  });
  it("delivers a current iPhone repair request as assessment-only", async () => {
    mockedEmail.mockResolvedValue({ ok: true });
    const date = new Date();
    date.setUTCDate(date.getUTCDate() + 7);
    if (date.getUTCDay() === 0) date.setUTCDate(date.getUTCDate() + 1);
    const response = await booking(request("booking", { deviceType: "phone", brand: "Apple", model: "iPhone 18 Pro", modelId: "iphone-18-pro", repair: "Screen replacement", serviceMethod: "drop-off", date: date.toISOString().slice(0, 10), time: "10:00am" }));
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ ok: true, confirmationEmailSent: true });
    expect(mockedEmail.mock.calls[0][0].html).toContain("Assessment required");
    expect(mockedEmail.mock.calls[0][0].html).toContain("iPhone 18 Pro");
    expect(mockedEmail.mock.calls[0][0].idempotencyKey).toMatch(/^booking\/business\//);
    expect(mockedEmail.mock.calls[1][0].idempotencyKey).toMatch(/^booking\/customer\//);
  });
});
