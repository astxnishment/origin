import { NextRequest, NextResponse } from "next/server";
import { bookingRequestSchema } from "@/lib/forms/schemas";
import { BUSINESS, FEATURES, SEO } from "@/lib/constants";
import { areRepairWritesEnabled } from "@/lib/deployment";
import type { StaffRepair } from "@/lib/repairTracking";
import { createRepair, RepairStoreError } from "@/lib/server/repairStore";
import { resolveBookingSelection } from "@/lib/server/bookingQuote";
import { sendEmail } from "@/lib/server/email";
import {
  RequestBodyError,
  beginIdempotentRequest,
  checkRateLimit,
  completeIdempotentRequest,
  escapeHtml,
  htmlWithLineBreaks,
  isPlausibleSubmissionTime,
  readJsonBody,
  releaseIdempotentRequest,
  verifyTurnstile,
} from "@/lib/server/requestSecurity";

export async function POST(request: NextRequest) {
  if (!FEATURES.bookingEnabled) {
    return NextResponse.json(
      { error: "Repair requests are not currently available online." },
      { status: 503 }
    );
  }

  if (FEATURES.trackingEnabled && !areRepairWritesEnabled()) {
    return NextResponse.json({ error: "Online repair requests are not open yet. Please contact us directly." }, { status: 503 });
  }

  if (!checkRateLimit(request, "booking", 5, 15 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait before trying again." },
      { status: 429 }
    );
  }

  try {
    const body = await readJsonBody(request);
    const result = bookingRequestSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          error: "Check the form and try again.",
          fields: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const input = result.data;
    if (!isPlausibleSubmissionTime(input.formStartedAt)) {
      return NextResponse.json(
        { error: "Please review the form and try again." },
        { status: 400 }
      );
    }

    if (!(await verifyTurnstile(input.turnstileToken, request))) {
      return NextResponse.json(
        { error: "Verification failed. Please try again." },
        { status: 400 }
      );
    }

    if (input.serviceMethod === "mail-in" && !FEATURES.mailInEnabled) {
      return NextResponse.json(
        { error: "Mail-in requests are not currently available." },
        { status: 400 }
      );
    }

    const resolved = resolveBookingSelection(input);
    if (!resolved) {
      return NextResponse.json(
        {
          error:
            "That device, repair or part combination is not currently available online.",
        },
        { status: 400 }
      );
    }

    let savedRepair: StaffRepair | undefined;
    if (FEATURES.trackingEnabled) {
      const saved = await createRepair({
        customerEmail: input.email,
        customerName: input.name,
        customerPhone: input.phone,
        deviceLabel: resolved.deviceLabel,
        repairLabel: resolved.repairLabel,
        partLabel: resolved.entry.partTier,
        priceLabel: resolved.priceLabel,
        warranty: resolved.entry.warranty,
        serviceMethod: input.serviceMethod,
        returnAddress: input.serviceMethod === "mail-in" ? input.returnAddress : "",
        requestedDate: input.date,
        requestedTime: input.time,
        issue: input.issue,
      }, `booking_${input.idempotencyKey}`);
      savedRepair = saved.repair;
      if (!saved.created) {
        return NextResponse.json({
          ok: true,
          reference: savedRepair.reference,
          trackingUrl: `/track?reference=${encodeURIComponent(savedRepair.reference)}`,
          message: "Your repair request is already saved. Sign in with the email used for this request to view its progress.",
        }, { headers: { "Cache-Control": "no-store" } });
      }
    } else if (!beginIdempotentRequest("booking", input.idempotencyKey)) {
      return NextResponse.json(
        { error: "This request has already been submitted." },
        { status: 409 }
      );
    }

    const date = new Date(`${input.date}T12:00:00Z`).toLocaleDateString(
      "en-GB",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }
    );
    const method =
      input.serviceMethod === "mail-in"
        ? "Mail-in request"
        : "Visit / drop-off request";

    const businessEmail = await sendEmail({
      idempotencyKey: `booking/business/${input.idempotencyKey}`,
      to: BUSINESS.email,
      subject: "New repair request - Origin Repairs",
      html: `
        <h2>New repair request</h2>
        ${savedRepair ? `<p><strong>Repair reference:</strong> ${escapeHtml(savedRepair.reference)}</p>` : ""}
        <p><strong>Customer:</strong> ${escapeHtml(input.name)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(input.phone)}</p>
        <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
        <p><strong>Service method:</strong> ${method}</p>
        <p><strong>Device:</strong> ${escapeHtml(resolved.deviceLabel)}</p>
        <p><strong>Repair:</strong> ${escapeHtml(resolved.repairLabel)}</p>
        <p><strong>Part option:</strong> ${escapeHtml(resolved.entry.partTier)}</p>
        <p><strong>Published estimate:</strong> ${escapeHtml(resolved.priceLabel)}</p>
        <p><strong>Estimated time:</strong> ${escapeHtml(resolved.entry.estimatedTime)}</p>
        <p><strong>Warranty shown:</strong> ${escapeHtml(resolved.entry.warranty)}</p>
        <p><strong>Requested date:</strong> ${escapeHtml(date)}</p>
        <p><strong>Requested time:</strong> ${escapeHtml(input.time)}</p>
        ${
          input.serviceMethod === "mail-in"
            ? `<p><strong>Return address:</strong><br>${htmlWithLineBreaks(input.returnAddress)}</p>`
            : ""
        }
        <p><strong>Issue:</strong><br>${htmlWithLineBreaks(input.issue || "Not provided")}</p>
        <p>This is a request only. Availability and the final quote still require confirmation.</p>
      `,
    });

    if (!businessEmail.ok) {
      console.error("Repair request delivery failed", {
        reason: businessEmail.reason,
        status: businessEmail.status,
      });
      if (!savedRepair) {
        releaseIdempotentRequest("booking", input.idempotencyKey);
        return NextResponse.json(
          {
            error:
              "We could not deliver your request. Please try again or contact us directly.",
          },
          { status: 503 }
        );
      }
    }

    const customerEmail = await sendEmail({
      idempotencyKey: `booking/customer/${input.idempotencyKey}`,
      to: input.email,
      subject: "Repair request received - Origin Repairs",
      html: `
        <h2>Repair request received</h2>
        <p>Hi ${escapeHtml(input.name)},</p>
        <p>We received your request for ${escapeHtml(resolved.deviceLabel)}.</p>
        ${savedRepair ? `<p><strong>Your reference:</strong> ${escapeHtml(savedRepair.reference)}</p><p><a href="${escapeHtml(`${SEO.siteUrl}/track?reference=${encodeURIComponent(savedRepair.reference)}`)}">View repair progress</a> by signing in with the email address used for this request.</p>` : ""}
        <ul>
          <li><strong>Repair:</strong> ${escapeHtml(resolved.repairLabel)}</li>
          <li><strong>Part option:</strong> ${escapeHtml(resolved.entry.partTier)}</li>
          <li><strong>Published estimate:</strong> ${escapeHtml(resolved.priceLabel)}</li>
          <li><strong>Warranty shown:</strong> ${escapeHtml(resolved.entry.warranty)}</li>
          <li><strong>Requested date and time:</strong> ${escapeHtml(date)}, ${escapeHtml(input.time)}</li>
        </ul>
        <p>This is not a confirmed appointment. The team will contact you to confirm availability and the final quote before work begins.</p>
        ${
          input.serviceMethod === "mail-in"
            ? "<p>Do not post the device until the team has confirmed the shipping instructions.</p>"
            : ""
        }
        <p>Questions? Call <a href="${BUSINESS.phoneHref}">${BUSINESS.phoneDisplay}</a>.</p>
      `,
    });

    if (!savedRepair) completeIdempotentRequest("booking", input.idempotencyKey);

    return NextResponse.json({
      ok: true,
      ...(savedRepair ? { reference: savedRepair.reference, trackingUrl: `/track?reference=${encodeURIComponent(savedRepair.reference)}` } : {}),
      confirmationEmailSent: customerEmail.ok,
      message: customerEmail.ok
        ? "Repair request received. A receipt has been emailed to you."
        : "Repair request received. The team has your request, but the email receipt could not be delivered.",
    });
  } catch (error) {
    if (error instanceof RepairStoreError) {
      if (error.code === "idempotency-conflict") {
        return NextResponse.json({ error: "This request has already been saved with different details. Contact us to change it." }, { status: 409 });
      }
      console.error("Repair request storage failed", { type: "storage" });
      return NextResponse.json({ error: "We could not save your repair request. Please try again or contact us directly." }, { status: 503 });
    }
    if (error instanceof RequestBodyError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    console.error("Repair request failed", { type: "unexpected" });
    return NextResponse.json(
      { error: "We could not process the request. Please try again." },
      { status: 500 }
    );
  }
}
