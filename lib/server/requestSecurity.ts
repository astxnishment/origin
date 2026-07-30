import type { NextRequest } from "next/server";

const rateLimits = new Map<string, { count: number; resetAt: number }>();
const idempotencyKeys = new Map<
  string,
  { status: "pending" | "complete"; expiresAt: number }
>();

export class RequestBodyError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
  }
}

export async function readJsonBody(
  request: NextRequest,
  maxBytes = 20_000
): Promise<unknown> {
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > maxBytes) {
    throw new RequestBodyError("Request is too large.", 413);
  }

  const body = await request.text();
  if (new TextEncoder().encode(body).byteLength > maxBytes) {
    throw new RequestBodyError("Request is too large.", 413);
  }

  try {
    return JSON.parse(body);
  } catch {
    throw new RequestBodyError("Invalid request.", 400);
  }
}

function clientAddress(request: NextRequest): string {
  return (
    request.headers.get("x-vercel-forwarded-for") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

export function checkRateLimit(
  request: NextRequest,
  scope: string,
  limit: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const key = `${scope}:${clientAddress(request)}`;
  const current = rateLimits.get(key);

  if (!current || current.resetAt <= now) {
    rateLimits.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (current.count >= limit) return false;
  current.count += 1;
  return true;
}

export function isPlausibleSubmissionTime(startedAt: number): boolean {
  const elapsed = Date.now() - startedAt;
  return elapsed >= 2_000 && elapsed <= 2 * 60 * 60 * 1000;
}

export function beginIdempotentRequest(
  scope: string,
  key: string
): boolean {
  const now = Date.now();
  const storageKey = `${scope}:${key}`;
  const existing = idempotencyKeys.get(storageKey);

  if (existing && existing.expiresAt > now) return false;

  idempotencyKeys.set(storageKey, {
    status: "pending",
    expiresAt: now + 15 * 60 * 1000,
  });
  return true;
}

export function completeIdempotentRequest(
  scope: string,
  key: string
): void {
  idempotencyKeys.set(`${scope}:${key}`, {
    status: "complete",
    expiresAt: Date.now() + 15 * 60 * 1000,
  });
}

export function releaseIdempotentRequest(
  scope: string,
  key: string
): void {
  idempotencyKeys.delete(`${scope}:${key}`);
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return entities[character];
  });
}

export function htmlWithLineBreaks(value: string): string {
  return escapeHtml(value).replace(/\r?\n/g, "<br>");
}

export async function verifyTurnstile(
  token: string,
  request: NextRequest
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  const form = new URLSearchParams({
    secret,
    response: token,
    remoteip: clientAddress(request),
  });

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: form,
        signal: AbortSignal.timeout(8_000),
      }
    );
    if (!response.ok) return false;
    const result = (await response.json()) as { success?: boolean };
    return result.success === true;
  } catch {
    return false;
  }
}
