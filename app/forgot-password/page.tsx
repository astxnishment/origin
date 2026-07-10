"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthShell, AuthSwitchLink, FieldError } from "@/components/AuthShell";
import { Check } from "lucide-react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "sent">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setStatus("submitting");
    // TODO(backend): POST /api/auth/forgot-password
    await new Promise((r) => setTimeout(r, 800));
    setStatus("sent");
  }

  return (
    <AuthShell
      title="Reset your password."
      subtitle="Enter your email and we'll send you a reset link."
    >
      {status === "sent" ? (
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/15">
            <Check className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Check your inbox.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              If an account exists for <span className="text-foreground">{email}</span>, a reset
              link is on its way.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="jane@example.com"
              autoComplete="email"
              className="h-10 rounded-xl border-border bg-background text-[13px]"
              aria-describedby={error ? "email-error" : undefined}
              aria-invalid={error ? true : undefined}
            />
            <FieldError id="email-error" message={error} />
          </div>

          <Button
            type="submit"
            disabled={status === "submitting"}
            className="btn-primary h-11 w-full text-[14px] font-semibold"
          >
            {status === "submitting" ? "Sending…" : "Send Reset Link"}
          </Button>
        </form>
      )}

      <AuthSwitchLink prompt="Remembered it?" href="/login" linkLabel="Back to log in" />
    </AuthShell>
  );
}
