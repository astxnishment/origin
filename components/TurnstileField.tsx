"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render(
        element: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback": () => void;
          "error-callback": () => void;
          theme: "auto";
        }
      ): string;
      remove(widgetId: string): void;
    };
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT_ID = "origin-turnstile-script";

export const TURNSTILE_ENABLED = Boolean(SITE_KEY);

export default function TurnstileField({
  onToken,
  resetKey = 0,
}: {
  onToken: (token: string) => void;
  resetKey?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const siteKey = SITE_KEY ?? "";
    if (!siteKey) return;
    let widgetId = "";
    let cancelled = false;

    function renderWidget() {
      if (
        cancelled ||
        !window.turnstile ||
        !containerRef.current ||
        containerRef.current.childElementCount > 0
      ) {
        return;
      }
      widgetId = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: (token) => { if (!cancelled) onToken(token); },
        "expired-callback": () => { if (!cancelled) onToken(""); },
        "error-callback": () => { if (!cancelled) onToken(""); },
        theme: "auto",
      });
    }

    const existing = document.getElementById(
      SCRIPT_ID
    ) as HTMLScriptElement | null;
    if (existing) {
      if (window.turnstile) renderWidget();
      else existing.addEventListener("load", renderWidget, { once: true });
    } else {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.addEventListener("load", renderWidget, { once: true });
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
      document.getElementById(SCRIPT_ID)?.removeEventListener("load", renderWidget);
      if (widgetId && window.turnstile) {
        window.turnstile.remove(widgetId);
      }
    };
  }, [onToken, resetKey]);

  if (!SITE_KEY) return null;

  return (
    <div>
      <div ref={containerRef} />
      <p className="mt-2 text-[11px] text-muted-foreground">
        Spam protection is provided by Cloudflare Turnstile.
      </p>
    </div>
  );
}
