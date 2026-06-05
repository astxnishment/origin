"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getBrandsByCategory,
  getModelsByBrand,
  DEVICE_CATEGORIES,
} from "@/lib/repair-data";
import { BUSINESS } from "@/lib/constants";
import { Check } from "lucide-react";

const timeSlots = [
  "9:00am", "10:00am", "11:00am", "12:00pm",
  "1:00pm", "2:00pm", "3:00pm", "4:00pm", "5:00pm",
];

export default function BookRepairPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [modelId, setModelId] = useState("");
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", date: "", time: "", issue: "",
  });

  const availableBrands = category ? getBrandsByCategory(category as any) : [];
  const availableModels = brand && category ? getModelsByBrand(brand, category as any) : [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, category, brand, modelId }),
      });
      if (response.ok) {
        setStatus("sent");
        setFormData({ name: "", email: "", phone: "", date: "", time: "", issue: "" });
        setCategory(""); setBrand(""); setModelId("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const isFormValid = formData.name && formData.email && formData.phone && category && brand && modelId && formData.date && formData.time;

  return (
    <>
      <Navbar />

      <main className="pt-24 pb-24">
        <div className="max-w-2xl mx-auto px-5 sm:px-8">
          {status === "sent" ? (
            <div className="pt-16 flex flex-col items-center text-center gap-5">
              <div className="w-12 h-12 rounded-full bg-accent/15 flex items-center justify-center">
                <Check className="h-5 w-5 text-accent" />
              </div>
              <h1 className="text-3xl font-semibold">Booking confirmed.</h1>
              <p className="text-[15px] text-muted-foreground max-w-sm">
                Check your email for confirmation details. We&apos;ll see you at 76 Cookridge Street.
              </p>
              <div className="w-full rounded-xl border border-border bg-card p-6 text-left mt-4 space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Next steps</p>
                {[
                  `Come to ${BUSINESS.address}`,
                  "Technician diagnoses your device (free)",
                  "Final price confirmed before work starts",
                  "Repair completed with 12-month warranty",
                ].map((step, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="text-[12px] font-semibold text-primary mt-0.5">{i + 1}.</span>
                    <p className="text-[13px] text-muted-foreground">{step}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-2">
                <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-xl h-10 px-6 text-[13px]">
                  <Link href="/">Back to home</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-xl h-10 px-6 text-[13px] border-border">
                  <a href={`tel:${BUSINESS.phone}`}>{BUSINESS.phone}</a>
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="pt-10 pb-12">
                <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-primary mb-3">
                  Book a Repair
                </p>
                <h1 className="text-4xl font-semibold tracking-tight mb-4">
                  Schedule your repair.
                </h1>
                <p className="text-[15px] text-muted-foreground">
                  Fill in the details and we&apos;ll confirm your slot within the hour.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Your details */}
                <section>
                  <h2 className="text-[13px] font-semibold text-foreground mb-4 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full border border-border flex items-center justify-center text-[11px]">1</span>
                    Your details
                  </h2>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Name *</label>
                        <Input name="name" placeholder="Full name" value={formData.name} onChange={handleInputChange} required
                          className="bg-card border-border h-10 rounded-xl text-[13px] focus-visible:ring-primary" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Email *</label>
                        <Input name="email" type="email" placeholder="you@email.com" value={formData.email} onChange={handleInputChange} required
                          className="bg-card border-border h-10 rounded-xl text-[13px] focus-visible:ring-primary" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Phone *</label>
                      <Input name="phone" type="tel" placeholder="07xxx xxxxxx" value={formData.phone} onChange={handleInputChange} required
                        className="bg-card border-border h-10 rounded-xl text-[13px] focus-visible:ring-primary" />
                    </div>
                  </div>
                </section>

                <div className="h-px bg-border" />

                {/* Device */}
                <section>
                  <h2 className="text-[13px] font-semibold text-foreground mb-4 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full border border-border flex items-center justify-center text-[11px]">2</span>
                    Your device
                  </h2>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Category *</label>
                        <Select value={category} onValueChange={(v) => { setCategory(v); setBrand(""); setModelId(""); }}>
                          <SelectTrigger className="bg-card border-border h-10 rounded-xl text-[13px]">
                            <SelectValue placeholder="Select…" />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border rounded-xl">
                            {DEVICE_CATEGORIES.map((cat) => (
                              <SelectItem key={cat} value={cat} className="text-[13px]">{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Brand *</label>
                        <Select value={brand} onValueChange={(v) => { setBrand(v); setModelId(""); }} disabled={!category}>
                          <SelectTrigger className="bg-card border-border h-10 rounded-xl text-[13px] disabled:opacity-40">
                            <SelectValue placeholder="Select…" />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border rounded-xl">
                            {availableBrands.map((b) => (
                              <SelectItem key={b} value={b} className="text-[13px]">{b}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Model *</label>
                        <Select value={modelId} onValueChange={setModelId} disabled={!brand}>
                          <SelectTrigger className="bg-card border-border h-10 rounded-xl text-[13px] disabled:opacity-40">
                            <SelectValue placeholder="Select…" />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border rounded-xl">
                            {availableModels.map((m) => (
                              <SelectItem key={m.id} value={m.id} className="text-[13px]">{m.displayName}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Issue description</label>
                      <Textarea name="issue" placeholder="e.g. Cracked screen, battery drains quickly, water damage…"
                        value={formData.issue} onChange={handleInputChange} rows={3}
                        className="bg-card border-border rounded-xl text-[13px] resize-none focus-visible:ring-primary" />
                    </div>
                  </div>
                </section>

                <div className="h-px bg-border" />

                {/* Schedule */}
                <section>
                  <h2 className="text-[13px] font-semibold text-foreground mb-4 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full border border-border flex items-center justify-center text-[11px]">3</span>
                    Preferred date &amp; time
                  </h2>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Date *</label>
                      <Input name="date" type="date" value={formData.date}
                        onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                        required className="bg-card border-border h-10 rounded-xl text-[13px] focus-visible:ring-primary" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Time *</label>
                      <div className="flex flex-wrap gap-2">
                        {timeSlots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, time: slot }))}
                            className={`px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-colors ${
                              formData.time === slot
                                ? "bg-primary text-white border-primary"
                                : "bg-card border-border text-foreground hover:border-primary/60"
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {status === "error" && (
                  <p className="text-[13px] text-destructive">
                    Something went wrong. Please try again or call{" "}
                    <a href={`tel:${BUSINESS.phone}`} className="underline">{BUSINESS.phone}</a>.
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={!isFormValid || status === "sending"}
                  className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl h-11 text-[13px] font-medium disabled:opacity-40"
                >
                  {status === "sending" ? "Booking…" : "Confirm Booking"}
                </Button>

                <p className="text-[12px] text-muted-foreground text-center">
                  We&apos;ll confirm by email within the hour. Walk-ins also welcome.
                </p>
              </form>
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
