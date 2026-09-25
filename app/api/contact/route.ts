import { NextRequest, NextResponse } from "next/server";
import { contactRequestSchema } from "@/lib/forms/schemas";
import { BUSINESS } from "@/lib/constants";
import { sendEmail } from "@/lib/server/email";
import {
  RequestBodyError,
  beginIdempotentRequest,
  checkRateLimit,
  completeIdempotentRequest,
  escapeHtml,
  getIdempotentRequestState,
  htmlWithLineBreaks,
  isPlausibleSubmissionTime,
  readJsonBody,
  releaseIdempotentRequest,
  requestPayloadFingerprint,
  verifyTurnstile,
} from "@/lib/server/requestSecurity";

export async function POST(request: NextRequest) {
  if (!checkRateLimit(request, "contact", 5, 15 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait before trying again." },
      { status: 429 }
    );
  }

  let activeRequestKey: string | undefined;
  try {
    const body = await readJsonBody(request, 16_000);
    const result = contactRequestSchema.safeParse(body);
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
    const fingerprint = requestPayloadFingerprint({
      name: input.name,
      email: input.email,
      phone: input.phone,
      device: input.device,
      issue: input.issue.replace(/\r\n?/g, "\n"),
      consentToContact: input.consentToContact,
    });
    function previousResponse() {
      const previous = getIdempotentRequestState("contact", input.idempotencyKey, fingerprint);
      if (previous.status === "new") return null;
      if (previous.status === "complete") {
        return NextResponse.json(previous.response.body, { status: previous.response.status, headers: { "Cache-Control": "no-store" } });
      }
      return NextResponse.json({ error: previous.status === "conflict"
        ? "This request key belongs to a message with different details. Start a new message or contact us directly."
        : "This message is still being processed. Please wait a moment before retrying." }, { status: 409 });
    }
    // Replaying a known result has no side effect and must work even when the
    // original challenge token has already been consumed.
    const previous = previousResponse();
    if (previous) return previous;
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

    if (!beginIdempotentRequest("contact", input.idempotencyKey, fingerprint)) {
      return previousResponse() ?? NextResponse.json({ error: "Please retry this message." }, { status: 409 });
    }
    activeRequestKey = input.idempotencyKey;

    const businessEmail = await sendEmail({
      idempotencyKey: `contact/business/${input.idempotencyKey}`,
      to: BUSINESS.email,
      subject: "New website enquiry - Origin Repairs",
      html: `
        <h2>New website enquiry</h2>
        <p><strong>Name:</strong> ${escapeHtml(input.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
        ${input.phone ? `<p><strong>Phone:</strong> ${escapeHtml(input.phone)}</p>` : ""}
        ${input.device ? `<p><strong>Device:</strong> ${escapeHtml(input.device)}</p>` : ""}
        <p><strong>Message:</strong><br>${htmlWithLineBreaks(input.issue)}</p>
      `,
    });

    if (!businessEmail.ok) {
      releaseIdempotentRequest("contact", input.idempotencyKey);
      console.error("Contact enquiry delivery failed", {
        reason: businessEmail.reason,
        status: businessEmail.status,
      });
      return NextResponse.json(
        {
          error:
            "We could not deliver your message. Please try again or contact us directly.",
        },
        { status: 503 }
      );
    }

    const customerEmail = await sendEmail({
      idempotencyKey: `contact/customer/${input.idempotencyKey}`,
      to: input.email,
      subject: "Message received - Origin Repairs",
      html: `
        <h2>Message received</h2>
        <p>Hi ${escapeHtml(input.name)},</p>
        <p>Origin Repairs received your message. We aim to respond during business hours.</p>
        <p>If the matter is urgent, call <a href="${BUSINESS.phoneHref}">${BUSINESS.phoneDisplay}</a>.</p>
      `,
    });

    const responseBody = {
      ok: true as const,
      confirmationEmailSent: customerEmail.ok,
      message: customerEmail.ok
        ? "Message received. A receipt has been emailed to you."
        : "Message received. The team has your message, but the email receipt could not be delivered.",
    };
    completeIdempotentRequest("contact", input.idempotencyKey, { status: 200, body: responseBody });
    activeRequestKey = undefined;
    return NextResponse.json(responseBody, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (activeRequestKey) releaseIdempotentRequest("contact", activeRequestKey);
    if (error instanceof RequestBodyError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    console.error("Contact enquiry failed", { type: "unexpected" });
    return NextResponse.json(
      { error: "We could not process the message. Please try again." },
      { status: 500 }
    );
  }
}
