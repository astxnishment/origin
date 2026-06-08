"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, AlertCircle, MapPin, Clock, ExternalLink } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    device: "",
    issue: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  function validate() {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = "Please enter your name.";
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = "Please enter a valid email address.";
    if (!formData.issue.trim()) errs.issue = "Please describe your issue.";
    return errs;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      document.getElementById(Object.keys(errs)[0])?.focus();
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus("sent");
        setFormData({ name: "", email: "", phone: "", device: "", issue: "" });
        setTimeout(() => setStatus("idle"), 8000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <Navbar />

      <main className="pt-24 pb-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          {/* Header */}
          <div className="pt-10 pb-14 border-b border-border">
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-primary mb-3">
              Contact
            </p>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-5 max-w-lg">
              Get in touch.
            </h1>
            <p className="text-[15px] text-muted-foreground max-w-md leading-relaxed">
              Questions, quotes, or complex repairs — we respond within the hour during business
              hours.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 py-14">
            {/* ── Contact info ─────────────────────────────────────── */}
            <aside className="lg:col-span-2 space-y-8">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                  Phone
                </p>
                <a
                  href={`tel:${BUSINESS.phone}`}
                  className="text-[15px] font-medium text-foreground hover:text-primary transition-colors"
                >
                  {BUSINESS.phoneDisplay}
                </a>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                  Email
                </p>
                <a
                  href={`mailto:${BUSINESS.email}`}
                  className="text-[15px] font-medium text-foreground hover:text-primary transition-colors"
                >
                  {BUSINESS.email}
                </a>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                  Address
                </p>
                <address className="not-italic text-[15px] text-foreground">
                  76 Cookridge Street
                  <br />
                  Leeds, LS2 8GL
                </address>
                <a
                  href="https://maps.google.com/?q=76+Cookridge+Street+Leeds+LS2+8GL"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[13px] text-primary hover:underline mt-2"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  View on Google Maps
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                  Hours
                </p>
                <div className="text-[15px] text-foreground space-y-0.5">
                  <p>Mon–Fri: 9am–6pm</p>
                  <p>Sat: 10am–4pm</p>
                  <p className="text-muted-foreground">Sun: Closed</p>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-start gap-2 mb-2">
                  <Clock className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-[13px] font-semibold text-foreground">Walk-ins welcome</p>
                </div>
                <p className="text-[13px] text-muted-foreground leading-relaxed">
                  Walk-ins welcome for most repairs. For MacBook and data recovery work, calling
                  ahead ensures a technician is available and has parts ready.
                </p>
              </div>
            </aside>

            {/* ── Form ─────────────────────────────────────────────── */}
            <div className="lg:col-span-3">
              {status === "sent" ? (
                <div className="flex flex-col gap-4 py-12 text-center items-center">
                  <div className="w-12 h-12 rounded-full bg-green-500/15 flex items-center justify-center">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold">Message sent</h3>
                  <p className="text-[14px] text-muted-foreground max-w-xs">
                    We&apos;ll get back to you within the hour during business hours. Check your
                    email for a confirmation.
                  </p>
                  <Button
                    variant="outline"
                    className="rounded-xl h-10 px-6 text-[13px] border-border mt-2"
                    onClick={() => setStatus("idle")}
                  >
                    Send another message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Name" id="name" required error={errors.name}>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        autoComplete="name"
                        className="bg-card border-border h-10 rounded-xl text-[13px]"
                        aria-describedby={errors.name ? "name-error" : undefined}
                      />
                    </FormField>

                    <FormField label="Email" id="email" required error={errors.email}>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@email.com"
                        autoComplete="email"
                        className="bg-card border-border h-10 rounded-xl text-[13px]"
                        aria-describedby={errors.email ? "email-error" : undefined}
                      />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Phone" id="phone" error={errors.phone}>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="07xxx xxxxxx"
                        autoComplete="tel"
                        className="bg-card border-border h-10 rounded-xl text-[13px]"
                      />
                    </FormField>

                    <FormField label="Device" id="device" error={errors.device}>
                      <Input
                        id="device"
                        name="device"
                        value={formData.device}
                        onChange={handleChange}
                        placeholder="e.g. iPhone 15 Pro"
                        className="bg-card border-border h-10 rounded-xl text-[13px]"
                      />
                    </FormField>
                  </div>

                  <FormField label="How can we help?" id="issue" required error={errors.issue}>
                    <Textarea
                      id="issue"
                      name="issue"
                      value={formData.issue}
                      onChange={handleChange}
                      placeholder="Describe the problem — screen cracked, won't turn on, water damage…"
                      rows={5}
                      className="bg-card border-border rounded-xl text-[13px] resize-none"
                      aria-describedby={errors.issue ? "issue-error" : undefined}
                    />
                  </FormField>

                  {status === "error" && (
                    <div
                      role="alert"
                      className="flex items-start gap-3 p-4 rounded-xl border border-destructive/30 bg-destructive/10"
                    >
                      <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                      <p className="text-[13px] text-destructive">
                        Something went wrong. Please try again, or call us on{" "}
                        <a href={`tel:${BUSINESS.phone}`} className="underline font-medium">
                          {BUSINESS.phoneDisplay}
                        </a>
                        .
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full bg-primary hover:bg-primary/90 text-white h-11 rounded-xl text-[13px] font-semibold disabled:opacity-50"
                  >
                    {status === "sending" ? "Sending…" : "Send Message"}
                  </Button>

                  <p className="text-[12px] text-muted-foreground text-center">
                    We respond within 1 hour during business hours (Mon–Fri 9am–6pm, Sat 10am–4pm).
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

function FormField({
  label, id, required, error, children,
}: {
  label: string; id: string; required?: boolean; error?: string; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground"
      >
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-[12px] text-destructive flex items-center gap-1">
          <AlertCircle className="h-3 w-3 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
