"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Mail, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TurnstileField from "@/components/TurnstileField";

type FormStatus = "idle" | "sending" | "sent" | "error";

export default function LoginForm({
  nextPath,
  initialError,
}: {
  nextPath: string;
  initialError?: string;
}) {
  const startedAt = useRef(0);
  const [email, setEmail] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [status, setStatus] = useState<FormStatus>(
    initialError ? "error" : "idle"
  );
  const [message, setMessage] = useState(initialError ?? "");
  const [developmentUrl, setDevelopmentUrl] = useState("");
  const onTurnstileToken = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          next: nextPath,
          website: "",
          formStartedAt: startedAt.current,
          turnstileToken,
        }),
      });
      const result = (await response.json()) as {
        error?: string;
        message?: string;
        developmentVerificationUrl?: string;
      };

      if (!response.ok) {
        setStatus("error");
        setMessage(
          result.error ?? "We could not send the sign-in email. Try again."
        );
        return;
      }

      setSubmittedEmail(email);
      setDevelopmentUrl(result.developmentVerificationUrl ?? "");
      setStatus("sent");
      setMessage(result.message ?? "Check your email for a secure sign-in link.");
    } catch {
      setStatus("error");
      setMessage("We could not send the sign-in email. Try again.");
    }
  }

  if (status === "sent") {
    return (
      <div className="py-2 text-center" role="status">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-surface">
          <CheckCircle2 className="h-5 w-5 text-[color:var(--success)]" />
        </div>
        <h2 className="mt-5 text-xl font-semibold">Check your email</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
          {message} We sent it to{" "}
          <span className="font-medium text-foreground">{submittedEmail}</span>.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          The link expires in 15 minutes.
        </p>
        {developmentUrl && (
          <Button asChild className="btn-primary mt-6 h-11 w-full">
            <a href={developmentUrl}>
              Open local sign-in link
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        )}
        <button
          type="button"
          onClick={() => {
            startedAt.current = Date.now();
            setStatus("idle");
            setMessage("");
          }}
          className="mt-5 text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Sign in to your account</h2>
        <p className="mt-1.5 text-[13px] leading-5 text-muted-foreground">
          New here? Enter your email and your account access will be created
          securely.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <label
          htmlFor="account-email"
          className="text-xs font-semibold text-foreground"
        >
          Email address
        </label>
        <div className="relative mt-2">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="account-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-11 bg-background pl-10"
            aria-describedby={status === "error" ? "account-error" : undefined}
            aria-invalid={status === "error"}
          />
        </div>

        {status === "error" && (
          <p
            id="account-error"
            role="alert"
            className="mt-3 flex gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs leading-5 text-destructive"
          >
            <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {message}
          </p>
        )}

        <div className="mt-4">
          <TurnstileField onToken={onTurnstileToken} />
        </div>

        <Button
          type="submit"
          disabled={status === "sending" || !email.trim()}
          className="btn-primary mt-5 h-11 w-full"
        >
          {status === "sending"
            ? "Sending secure link..."
            : "Email me a sign-in link"}
          {status !== "sending" && <ArrowRight className="h-4 w-4" />}
        </Button>
      </form>

      <p className="mt-5 text-center text-xs text-muted-foreground">
        Need help with an existing repair?{" "}
        <Link
          href="/contact"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Contact the team
        </Link>
      </p>
    </>
  );
}
