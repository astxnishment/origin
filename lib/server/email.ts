import { EMAIL_DELIVERY_ENABLED } from "@/lib/deployment";

type EmailInput = {
  to: string;
  subject: string;
  html: string;
};

export type EmailResult = {
  ok: boolean;
  status?: number;
  reason?: "disabled" | "configuration" | "provider" | "network";
};

export async function sendEmail(input: EmailInput): Promise<EmailResult> {
  if (!EMAIL_DELIVERY_ENABLED) {
    return { ok: false, reason: "disabled" };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, reason: "configuration" };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from:
          process.env.RESEND_FROM_EMAIL ??
          "Origin Repairs <noreply@originrepairs.co.uk>",
        to: input.to,
        subject: input.subject,
        html: input.html,
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        reason: "provider",
      };
    }

    return { ok: true, status: response.status };
  } catch {
    return { ok: false, reason: "network" };
  }
}
