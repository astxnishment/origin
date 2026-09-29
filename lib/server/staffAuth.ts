import type { NextRequest } from "next/server";
import { SEO } from "@/lib/business-config";
import { isProductionEnvironment } from "@/lib/deployment";
import { getCustomerSession, type CustomerSession } from "@/lib/server/auth";
import { readJsonBody, RequestBodyError } from "@/lib/server/requestSecurity";

export class StaffAuthorizationError extends Error {
  constructor(public readonly status: 401 | 403) {
    super(status === 401 ? "Sign in to continue." : "Staff access is required.");
  }
}

export function isStaffEmail(email: string): boolean {
  const allowed = (process.env.STAFF_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  return allowed.includes(email.trim().toLowerCase());
}

export async function getStaffSession(): Promise<CustomerSession | null> {
  const session = await getCustomerSession();
  return session && isStaffEmail(session.email) ? session : null;
}

export async function requireStaffSession(): Promise<CustomerSession> {
  const session = await getCustomerSession();
  if (!session) throw new StaffAuthorizationError(401);
  if (!isStaffEmail(session.email)) throw new StaffAuthorizationError(403);
  return session;
}

function expectedStaffOrigin(request: NextRequest): string | null {
  if (isProductionEnvironment()) {
    const canonical = new URL(SEO.siteUrl);
    return canonical.protocol === "https:" ? canonical.origin : null;
  }
  // NextURL deliberately normalizes loopback IPs to "localhost". The actual
  // Host header preserves the browser's authority; accept it only for a
  // loopback request on the same port, never as a general proxy override.
  if (request.nextUrl.hostname === "localhost") {
    const host = request.headers.get("host");
    if (!host) return request.nextUrl.origin;
    try {
      const actual = new URL(`${request.nextUrl.protocol}//${host}`);
      const isLoopback = actual.hostname === "localhost" || actual.hostname === "[::1]" || /^127(?:\.\d{1,3}){3}$/.test(actual.hostname);
      if (!isLoopback || actual.port !== request.nextUrl.port || actual.username || actual.password || actual.pathname !== "/" || actual.search || actual.hash) return null;
      return actual.origin;
    } catch { return null; }
  }
  return request.nextUrl.origin;
}

export async function readStaffJsonBody(request: NextRequest): Promise<unknown> {
  const origin = request.headers.get("origin");
  const fetchSite = request.headers.get("sec-fetch-site");
  if (!origin || origin !== expectedStaffOrigin(request) || (fetchSite && fetchSite !== "same-origin")) {
    throw new RequestBodyError("Submit this change from the staff dashboard.", 403);
  }
  return readJsonBody(request, 16_000);
}
