"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BUSINESS } from "@/lib/constants";
import TurnstileField, {
  TURNSTILE_ENABLED,
} from "@/components/TurnstileField";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const startedAt = useRef(0);
  const idempotencyKey = useRef("");
  const [status, setStatus] = useState<Status>("idle");
  const [responseMessage, setResponseMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [consentToContact, setConsentToContact] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    device: "",
    issue: "",
    website: "",
  });

  useEffect(() => {
    startedAt.current = Date.now();
    idempotencyKey.current = crypto.randomUUID();
  }, []);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: "" }));
  }

  function validate(): Record<string, string> {
    const next: Record<string, string> = {};
    if (!formData.name.trim()) next.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      next.email = "Please enter a valid email address.";
    }
    if (!formData.issue.trim()) next.issue = "Please enter your message.";
    if (!consentToContact) {
      next.consentToContact = "Consent is required so we can reply.";
    }
    if (TURNSTILE_ENABLED && !turnstileToken) {
      next.turnstileToken = "Complete the spam check.";
    }
    return next;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      document.getElementById(Object.keys(nextErrors)[0])?.focus();
      return;
    }

    setStatus("sending");
    setErrors({});
    setResponseMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          consentToContact,
          formStartedAt: startedAt.current,
          idempotencyKey: idempotencyKey.current,
          turnstileToken,
        }),
      });
      const result = (await response.json()) as {
        error?: string;
        message?: string;
        fields?: Record<string, string[]>;
      };

      if (!response.ok) {
        const serverErrors = Object.fromEntries(
          Object.entries(result.fields ?? {}).map(([key, messages]) => [
            key,
            messages[0] ?? "",
          ])
        );
        setErrors(serverErrors);
        setResponseMessage(
          result.error ?? "We could not send the message. Please try again."
        );
        setStatus("error");
        return;
      }

      setResponseMessage(
        result.message ?? "Message received. The team has your message."
      );
      setStatus("sent");
      setFormData({
        name: "",
        email: "",
        phone: "",
        device: "",
        issue: "",
        website: "",
      });
      setConsentToContact(false);
      setTurnstileToken("");
    } catch {
      setResponseMessage(
        "We could not send the message. Please try again or contact us directly."
      );
      setStatus("error");
    }
  }

  function resetForm() {
    startedAt.current = Date.now();
    idempotencyKey.current = crypto.randomUUID();
    setStatus("idle");
    setResponseMessage("");
    setErrors({});
    setTurnstileToken("");
  }

  if (status === "sent") {
    return (
      <div
        className="flex flex-col items-center gap-4 py-12 text-center"
        aria-live="polite"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/15">
          <Check className="h-5 w-5 text-green-500" />
        </div>
        <h2 className="text-xl font-semibold">Message received</h2>
        <p className="max-w-sm text-[14px] text-muted-foreground">
          {responseMessage}
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-2 h-10 rounded-xl border-border px-6 text-[13px]"
          onClick={resetForm}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Name" id="name" required error={errors.name}>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            maxLength={100}
            autoComplete="name"
            className="h-10 rounded-xl border-border bg-card text-[13px]"
          />
        </FormField>
        <FormField label="Email" id="email" required error={errors.email}>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            maxLength={254}
            autoComplete="email"
            className="h-10 rounded-xl border-border bg-card text-[13px]"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Phone" id="phone" error={errors.phone}>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            maxLength={25}
            autoComplete="tel"
            className="h-10 rounded-xl border-border bg-card text-[13px]"
          />
        </FormField>
        <FormField label="Device" id="device" error={errors.device}>
          <Input
            id="device"
            name="device"
            value={formData.device}
            onChange={handleChange}
            maxLength={120}
            placeholder="e.g. iPhone 15 Pro"
            className="h-10 rounded-xl border-border bg-card text-[13px]"
          />
        </FormField>
      </div>

      <FormField
        label="How can we help?"
        id="issue"
        required
        error={errors.issue}
      >
        <Textarea
          id="issue"
          name="issue"
          value={formData.issue}
          onChange={handleChange}
          maxLength={3000}
          rows={5}
          className="resize-none rounded-xl border-border bg-card text-[13px]"
        />
      </FormField>

      <div
        className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
        aria-hidden="true"
      >
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          value={formData.website}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div>
        <label className="flex items-start gap-3 text-[12px] leading-relaxed text-muted-foreground">
          <input
            id="consentToContact"
            type="checkbox"
            checked={consentToContact}
            onChange={(event) => {
              setConsentToContact(event.target.checked);
              setErrors((previous) => ({
                ...previous,
                consentToContact: "",
              }));
            }}
            className="mt-0.5 h-4 w-4"
          />
          <span>
            I agree that Origin Repairs may use these details to reply to this
            enquiry. See the{" "}
            <Link href="/privacy" className="text-foreground underline">
              privacy policy
            </Link>
            .
          </span>
        </label>
        {errors.consentToContact && (
          <p
            id="consentToContact-error"
            role="alert"
            className="mt-1 text-[12px] text-destructive"
          >
            {errors.consentToContact}
          </p>
        )}
      </div>

      <TurnstileField onToken={setTurnstileToken} />
      {errors.turnstileToken && (
        <p role="alert" className="text-[12px] text-destructive">
          {errors.turnstileToken}
        </p>
      )}

      {status === "error" && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-destructive" />
          <p className="text-[13px] text-destructive">
            {responseMessage} Call{" "}
            <a href={BUSINESS.phoneHref} className="font-medium underline">
              {BUSINESS.phoneDisplay}
            </a>{" "}
            if the problem continues.
          </p>
        </div>
      )}

      <Button
        type="submit"
        disabled={status === "sending"}
        className="btn-primary h-11 w-full rounded-lg text-[13px] font-semibold disabled:opacity-50"
      >
        {status === "sending" ? "Sending..." : "Send Message"}
      </Button>
      <p className="text-center text-[12px] text-muted-foreground">
        We aim to respond during published business hours.
      </p>
    </form>
  );
}

function FormField({
  label,
  id,
  required,
  error,
  children,
}: {
  label: string;
  id: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground"
      >
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </label>
      {children}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="flex items-center gap-1 text-[12px] text-destructive"
        >
          <AlertCircle className="h-3 w-3 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
