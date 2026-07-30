import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "origin_customer_session";

const TOKEN_VERSION = 1;
const LOGIN_LINK_LIFETIME_MS = 15 * 60 * 1000;
const SESSION_LIFETIME_MS = 30 * 24 * 60 * 60 * 1000;
const LOCAL_DEVELOPMENT_SECRET =
  "origin-repairs-local-development-auth-secret-only";

type TokenKind = "login" | "session";

type AuthToken = {
  version: typeof TOKEN_VERSION;
  kind: TokenKind;
  email: string;
  expiresAt: number;
  next?: string;
};

export type CustomerSession = {
  email: string;
  expiresAt: number;
};

function authSecret(): string | null {
  const configured =
    process.env.AUTH_SECRET?.trim() || process.env.RESEND_API_KEY?.trim();
  if (configured && configured.length >= 32) return configured;
  if (process.env.NODE_ENV === "development") {
    return LOCAL_DEVELOPMENT_SECRET;
  }
  return null;
}

function encryptionKey(secret: string): Buffer {
  return createHash("sha256").update(secret).digest();
}

function normaliseNextPath(value: string | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/account";
  }
  return value;
}

function encryptToken(payload: AuthToken): string {
  const secret = authSecret();
  if (!secret) throw new Error("Customer authentication is not configured.");

  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(secret), iv);
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(payload), "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return Buffer.concat([iv, authTag, encrypted]).toString("base64url");
}

function decryptToken(
  token: string,
  expectedKind: TokenKind,
  now = Date.now()
): AuthToken | null {
  const secret = authSecret();
  if (!secret || !token || token.length > 4096) return null;

  try {
    const value = Buffer.from(token, "base64url");
    if (value.length <= 28) return null;

    const iv = value.subarray(0, 12);
    const authTag = value.subarray(12, 28);
    const encrypted = value.subarray(28);
    const decipher = createDecipheriv(
      "aes-256-gcm",
      encryptionKey(secret),
      iv
    );
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]).toString("utf8");
    const payload = JSON.parse(decrypted) as Partial<AuthToken>;

    if (
      payload.version !== TOKEN_VERSION ||
      payload.kind !== expectedKind ||
      typeof payload.email !== "string" ||
      !payload.email.includes("@") ||
      typeof payload.expiresAt !== "number" ||
      payload.expiresAt <= now
    ) {
      return null;
    }

    return payload as AuthToken;
  } catch {
    return null;
  }
}

export function isCustomerAuthConfigured(): boolean {
  return authSecret() !== null;
}

export function createLoginToken(
  email: string,
  nextPath = "/account",
  now = Date.now()
): string {
  return encryptToken({
    version: TOKEN_VERSION,
    kind: "login",
    email: email.trim().toLowerCase(),
    expiresAt: now + LOGIN_LINK_LIFETIME_MS,
    next: normaliseNextPath(nextPath),
  });
}

export function verifyLoginToken(
  token: string,
  now = Date.now()
): (CustomerSession & { next: string }) | null {
  const payload = decryptToken(token, "login", now);
  if (!payload) return null;

  return {
    email: payload.email,
    expiresAt: payload.expiresAt,
    next: normaliseNextPath(payload.next),
  };
}

export function createSessionToken(
  email: string,
  now = Date.now()
): string {
  return encryptToken({
    version: TOKEN_VERSION,
    kind: "session",
    email: email.trim().toLowerCase(),
    expiresAt: now + SESSION_LIFETIME_MS,
  });
}

export function verifySessionToken(
  token: string,
  now = Date.now()
): CustomerSession | null {
  const payload = decryptToken(token, "session", now);
  if (!payload) return null;

  return {
    email: payload.email,
    expiresAt: payload.expiresAt,
  };
}

export async function getCustomerSession(): Promise<CustomerSession | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return token ? verifySessionToken(token) : null;
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: Math.floor(SESSION_LIFETIME_MS / 1000),
  };
}
