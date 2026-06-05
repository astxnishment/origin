"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    device: "",
    issue: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        setTimeout(() => setStatus("idle"), 6000);
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
          <div className="pt-10 pb-16 border-b border-border">
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-primary mb-3">
              Contact
            </p>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-5 max-w-lg">
              Get in touch.
            </h1>
            <p className="text-[15px] text-muted-foreground max-w-md leading-relaxed">
              Questions, quotes, or complex repairs — we respond within the hour during business hours.
            </p>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 py-16">
            {/* Contact info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">Phone</p>
                <a href={`tel:${BUSINESS.phone}`} className="text-[15px] font-medium text-foreground hover:text-primary transition-colors">
                  {BUSINESS.phone}
                </a>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">Email</p>
                <a href={`mailto:${BUSINESS.email}`} className="text-[15px] font-medium text-foreground hover:text-primary transition-colors">
                  {BUSINESS.email}
                </a>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">Location</p>
                <address className="not-italic text-[15px] text-foreground">
                  76 Cookridge Street<br />
                  Leeds, LS2 8GL
                </address>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">Hours</p>
                <div className="text-[15px] text-foreground space-y-0.5">
                  <p>Mon–Fri: 9am–6pm</p>
                  <p>Sat: 10am–4pm</p>
                  <p className="text-muted-foreground">Sun: Closed</p>
                </div>
              </div>
              <div className="pt-2 p-5 rounded-xl border border-border bg-card">
                <p className="text-[13px] text-muted-foreground">
                  Walk-ins welcome for most repairs. For MacBook and data recovery, calling ahead ensures a technician is available.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              {status === "sent" ? (
                <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                  <div className="w-12 h-12 rounded-full bg-accent/15 flex items-center justify-center">
                    <Check className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold">Message sent</h3>
                  <p className="text-[14px] text-muted-foreground max-w-xs">
                    We&apos;ll get back to you within the hour. Check your email for a confirmation.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                        Name *
                      </label>
                      <Input
                        name="name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="bg-card border-border h-10 rounded-xl text-[13px] focus-visible:ring-primary"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                        Email *
                      </label>
                      <Input
                        name="email"
                        type="email"
                        placeholder="you@email.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="bg-card border-border h-10 rounded-xl text-[13px] focus-visible:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                        Phone
                      </label>
                      <Input
                        name="phone"
                        type="tel"
                        placeholder="07xxx xxxxxx"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="bg-card border-border h-10 rounded-xl text-[13px] focus-visible:ring-primary"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                        Device
                      </label>
                      <Input
                        name="device"
                        placeholder="e.g. iPhone 15 Pro"
                        value={formData.device}
                        onChange={handleInputChange}
                        className="bg-card border-border h-10 rounded-xl text-[13px] focus-visible:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                      Issue *
                    </label>
                    <Textarea
                      name="issue"
                      placeholder="Describe the problem…"
                      value={formData.issue}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="bg-card border-border rounded-xl text-[13px] resize-none focus-visible:ring-primary"
                    />
                  </div>

                  {status === "error" && (
                    <p className="text-[13px] text-destructive">
                      Something went wrong. Please try again or call{" "}
                      <a href={`tel:${BUSINESS.phone}`} className="underline">{BUSINESS.phone}</a>.
                    </p>
                  )}

                  <Button
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full bg-primary hover:bg-primary/90 text-white h-10 rounded-xl text-[13px] font-medium"
                  >
                    {status === "sending" ? "Sending…" : "Send Message"}
                  </Button>

                  <p className="text-[12px] text-muted-foreground text-center">
                    We respond within 1 hour during business hours.
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
