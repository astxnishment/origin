"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AuthShell,
  AuthSwitchLink,
  FieldError,
  GoogleButton,
  OrDivider,
  PasswordInput,
} from "@/components/AuthShell";
import { useAuth } from "@/lib/auth";
import { AlertCircle } from "lucide-react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const { signIn, signInWithGoogle } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "google" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!EMAIL_RE.test(email)) errs.email = "Please enter a valid email address.";
    if (!password) errs.password = "Please enter your password.";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus("submitting");
    try {
      await signIn(email, password);
      router.push("/account/repairs");
    } catch {
      setStatus("error");
    }
  }

  async function handleGoogle() {
    setStatus("google");
    try {
      await signInWithGoogle();
      router.push("/account/repairs");
    } catch {
      setStatus("error");
    }
  }

  const busy = status === "submitting" || status === "google";

  return (
    <AuthShell title="Welcome back." subtitle="Log in to track and manage your repairs.">
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
              setErrors((p) => ({ ...p, email: "" }));
            }}
            placeholder="jane@example.com"
            autoComplete="email"
            className="h-10 rounded-xl border-border bg-background text-[13px]"
            aria-describedby={errors.email ? "email-error" : undefined}
            aria-invalid={errors.email ? true : undefined}
          />
          <FieldError id="email-error" message={errors.email} />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-[12px] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            id="password"
            value={password}
            onChange={(v) => {
              setPassword(v);
              setErrors((p) => ({ ...p, password: "" }));
            }}
            autoComplete="current-password"
            error={errors.password}
          />
          <FieldError id="password-error" message={errors.password} />
        </div>

        {status === "error" && (
          <p role="alert" className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-[12px] text-destructive">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
            Something went wrong logging you in. Please try again.
          </p>
        )}

        <Button type="submit" disabled={busy} className="btn-primary h-11 w-full text-[14px] font-semibold">
          {status === "submitting" ? "Logging in…" : "Log In"}
        </Button>

        <OrDivider />

        <GoogleButton
          label={status === "google" ? "Connecting…" : "Continue with Google"}
          onClick={handleGoogle}
          disabled={busy}
        />
      </form>

      <AuthSwitchLink prompt="Don't have an account?" href="/signup" linkLabel="Sign up" />
    </AuthShell>
  );
}
