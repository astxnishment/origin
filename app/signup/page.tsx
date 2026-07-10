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

export default function SignupPage() {
  const { signUp, signInWithGoogle } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "google" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Please enter your name.";
    if (!EMAIL_RE.test(email)) errs.email = "Please enter a valid email address.";
    if (password.length < 8) errs.password = "Password must be at least 8 characters.";
    if (!agreed) errs.terms = "Please agree to the Terms of Service and Privacy Policy.";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus("submitting");
    try {
      await signUp(name.trim(), email, password);
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
    <AuthShell
      title="Create your account."
      subtitle="Track repairs, view your history and book faster."
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Full name
          </label>
          <Input
            id="name"
            name="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors((p) => ({ ...p, name: "" }));
            }}
            placeholder="Jane Smith"
            autoComplete="name"
            className="h-10 rounded-xl border-border bg-background text-[13px]"
            aria-describedby={errors.name ? "name-error" : undefined}
            aria-invalid={errors.name ? true : undefined}
          />
          <FieldError id="name-error" message={errors.name} />
        </div>

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
          <label htmlFor="password" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Password
          </label>
          <PasswordInput
            id="password"
            value={password}
            onChange={(v) => {
              setPassword(v);
              setErrors((p) => ({ ...p, password: "" }));
            }}
            autoComplete="new-password"
            error={errors.password}
            placeholder="At least 8 characters"
          />
          <FieldError id="password-error" message={errors.password} />
        </div>

        <div className="space-y-1.5">
          <label className="flex items-start gap-2.5 text-[12px] leading-relaxed text-muted-foreground">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => {
                setAgreed(e.target.checked);
                setErrors((p) => ({ ...p, terms: "" }));
              }}
              className="mt-0.5 h-4 w-4 rounded border-border accent-[color:var(--accent)]"
              aria-describedby={errors.terms ? "terms-error" : undefined}
            />
            <span>
              I agree to the{" "}
              <Link href="/terms" className="text-foreground underline-offset-4 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-foreground underline-offset-4 hover:underline">
                Privacy Policy
              </Link>
              .
            </span>
          </label>
          <FieldError id="terms-error" message={errors.terms} />
        </div>

        {status === "error" && (
          <p role="alert" className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-[12px] text-destructive">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
            Something went wrong creating your account. Please try again.
          </p>
        )}

        <Button type="submit" disabled={busy} className="btn-primary h-11 w-full text-[14px] font-semibold">
          {status === "submitting" ? "Creating account…" : "Create Account"}
        </Button>

        <OrDivider />

        <GoogleButton
          label={status === "google" ? "Connecting…" : "Sign up with Google"}
          onClick={handleGoogle}
          disabled={busy}
        />
      </form>

      <AuthSwitchLink prompt="Already have an account?" href="/login" linkLabel="Log in" />
    </AuthShell>
  );
}
