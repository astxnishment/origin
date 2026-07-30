import { NextRequest, NextResponse } from "next/server";
import { accountAccessSchema } from "@/lib/forms/schemas";
import { FEATURES, SEO } from "@/lib/constants";
import {
  createLoginToken,
  isCustomerAuthConfigured,
} from "@/lib/server/auth";
import { sendEmail } from "@/lib/server/email";
import {
  RequestBodyError,
  checkRateLimit,
  escapeHtml,
  isPlausibleSubmissionTime,
  readJsonBody,
  verifyTurnstile,
} from "@/lib/server/requestSecurity";

function verificationUrl(request: NextRequest, token: string): string {
  const publicOrigin =
    process.env.NODE_ENV === "development"
      ? request.nextUrl.origin
      : process.env.AUTH_BASE_URL ?? SEO.siteUrl;
  const url = new URL("/api/auth/verify", publicOrigin);
  url.searchParams.set("token", token);
  return url.toString();
}

export async function POST(request: NextRequest) {
  if (!FEATURES.customerAccountsEnabled) {
    return NextResponse.json(
      { error: "Customer accounts are not currently available." },
      { status: 503 }
    );
  }

  if (!checkRateLimit(request, "account-access", 5, 15 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait before trying again." },
      { status: 429 }
    );
  }

  try {
    const body = await readJsonBody(request, 8_000);
    const result = accountAccessSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          error: "Check your email address and try again.",
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

    if (!isCustomerAuthConfigured()) {
      return NextResponse.json(
        { error: "Account access is temporarily unavailable." },
        { status: 503 }
      );
    }

    const token = createLoginToken(input.email, input.next);
    const url = verificationUrl(request, token);
    const email = await sendEmail({
      to: input.email,
      subject: "Your secure Origin Repairs sign-in link",
      html: `
        <h2>Sign in to Origin Repairs</h2>
        <p>Use the secure link below to access your customer account.</p>
        <p><a href="${escapeHtml(url)}">Sign in to your account</a></p>
        <p>This link expires in 15 minutes and can only be used to access the email address it was sent to.</p>
        <p>If you did not request this link, you can ignore this email.</p>
      `,
    });

    if (!email.ok && process.env.NODE_ENV !== "development") {
      console.error("Account access email delivery failed", {
        reason: email.reason,
        status: email.status,
      });
      return NextResponse.json(
        {
          error:
            "We could not send the sign-in email. Please try again shortly.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        message: "Check your email for a secure sign-in link.",
        ...(process.env.NODE_ENV === "development"
          ? { developmentVerificationUrl: url }
          : {}),
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    if (error instanceof RequestBodyError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    console.error("Account access request failed", { type: "unexpected" });
    return NextResponse.json(
      { error: "We could not send the sign-in email. Please try again." },
      { status: 500 }
    );
  }
}
