import { NextRequest, NextResponse } from "next/server";
import { FEATURES } from "@/lib/constants";
import {
  createSessionToken,
  SESSION_COOKIE,
  sessionCookieOptions,
  verifyLoginToken,
} from "@/lib/server/auth";

function loginRedirect(request: NextRequest, reason: string) {
  const url = new URL("/login", request.url);
  url.searchParams.set("error", reason);
  return NextResponse.redirect(url);
}

export async function GET(request: NextRequest) {
  if (!FEATURES.customerAccountsEnabled) {
    return loginRedirect(request, "unavailable");
  }

  const token = request.nextUrl.searchParams.get("token") ?? "";
  const login = verifyLoginToken(token);
  if (!login) return loginRedirect(request, "expired");

  const response = NextResponse.redirect(new URL(login.next, request.url));
  response.cookies.set(
    SESSION_COOKIE,
    createSessionToken(login.email),
    sessionCookieOptions()
  );
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}
