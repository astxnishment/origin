import type { NextRequest } from "next/server";
import { createHash } from "node:crypto";
import { SEO } from "@/lib/business-config";
import { isProductionEnvironment } from "@/lib/deployment";

const rateLimits = new Map<string, { count: number; resetAt: number }>();
const IDEMPOTENCY_TTL_MS = 15 * 60 * 1000;
export type IdempotentResponse = {
  status: number;
  body: { ok: true; confirmationEmailSent: boolean; message: string };
};
export type IdempotentRequestState =
  | { status: "new" | "pending" | "conflict" }
  | { status: "complete"; response: IdempotentResponse };
const idempotencyKeys = new Map<
  string,
  {
    status: "pending" | "complete" | "released";
    expiresAt: number;
    fingerprint?: string;
    response?: IdempotentResponse;
  }
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
  if (request.headers.get("sec-fetch-site") === "cross-site") {
    throw new RequestBodyError("Submit this form from the Origin Repairs website.", 403);
  }
  if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") {
    throw new RequestBodyError("Expected a JSON request.", 415);
  }
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > maxBytes) {
    throw new RequestBodyError("Request is too large.", 413);
  }

  const reader = request.body?.getReader();
  if (!reader) throw new RequestBodyError("Invalid request.", 400);
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) {
        await reader.cancel();
        throw new RequestBodyError("Request is too large.", 413);
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const body = Buffer.concat(chunks).toString("utf8");

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
  for (const [key, value] of rateLimits) {
    if (value.resetAt <= now) rateLimits.delete(key);
  }
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
  key: string,
  fingerprint?: string
): boolean {
  const now = Date.now();
  for (const [key, value] of idempotencyKeys) {
    if (value.expiresAt <= now) idempotencyKeys.delete(key);
  }
  const storageKey = `${scope}:${key}`;
  const existing = idempotencyKeys.get(storageKey);

  if (existing && existing.expiresAt > now &&
      (existing.status !== "released" || existing.fingerprint !== fingerprint)) return false;

  idempotencyKeys.set(storageKey, {
    status: "pending",
    expiresAt: now + IDEMPOTENCY_TTL_MS,
    ...(fingerprint ? { fingerprint } : {}),
  });
  return true;
}

export function completeIdempotentRequest(
  scope: string,
  key: string,
  response?: IdempotentResponse
): void {
  const storageKey = `${scope}:${key}`;
  const existing = idempotencyKeys.get(storageKey);
  idempotencyKeys.set(storageKey, {
    status: "complete",
    expiresAt: Date.now() + IDEMPOTENCY_TTL_MS,
    ...(existing?.fingerprint ? { fingerprint: existing.fingerprint } : {}),
    ...(response ? { response: { status: response.status, body: { ...response.body } } } : {}),
  });
}

export function releaseIdempotentRequest(
  scope: string,
  key: string
): void {
  const storageKey = `${scope}:${key}`;
  const existing = idempotencyKeys.get(storageKey);
  if (existing?.fingerprint) {
    idempotencyKeys.set(storageKey, { status: "released", fingerprint: existing.fingerprint, expiresAt: existing.expiresAt });
  } else {
    idempotencyKeys.delete(storageKey);
  }
}

export function requestPayloadFingerprint(payload: Record<string, string | boolean>): string {
  const entries = Object.entries(payload).sort(([left], [right]) => left.localeCompare(right));
  return createHash("sha256").update(JSON.stringify(entries)).digest("hex");
}

export function getIdempotentRequestState(scope: string, key: string, fingerprint: string): IdempotentRequestState {
  const storageKey = `${scope}:${key}`;
  const existing = idempotencyKeys.get(storageKey);
  if (!existing) return { status: "new" };
  if (existing.expiresAt <= Date.now()) {
    idempotencyKeys.delete(storageKey);
    return { status: "new" };
  }
  if (existing.fingerprint !== fingerprint) return { status: "conflict" };
  if (existing.status === "released") return { status: "new" };
  if (existing.status === "complete" && existing.response) {
    return { status: "complete", response: { status: existing.response.status, body: { ...existing.response.body } } };
  }
  return { status: "pending" };
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
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  const productionOperations = isProductionEnvironment() &&
    process.env.PRODUCTION_OPERATIONS_ENABLED === "true";
  // Both keys may be absent for local/offline previews. A half-configured
  // integration, or any approved production operation, must never bypass it.
  if (!secret || !siteKey) return !productionOperations && !secret && !siteKey;
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
    const result = (await response.json()) as { success?: boolean; hostname?: string };
    return result.success === true && (!productionOperations ||
      result.hostname?.toLowerCase() === new URL(SEO.siteUrl).hostname.toLowerCase());
  } catch {
    return false;
  }
}
