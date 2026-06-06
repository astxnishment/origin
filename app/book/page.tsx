"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
import { DeviceIcon, type DeviceType } from "@/components/DeviceIcon";
import {
  BRANDS,
  REPAIR_TYPES,
  getModelsByBrand,
  getRepairQuote,
  getDeviceById,
  slugToBrand,
  slugToRepairType,
  type Brand,
  type RepairType,
} from "@/lib/calculatorData";
import { BUSINESS } from "@/lib/constants";
import { Check, Clock, Shield, ArrowRight } from "lucide-react";

const timeSlots = [
  "9:00am", "10:00am", "11:00am", "12:00pm",
  "1:00pm", "2:00pm", "3:00pm", "4:00pm", "5:00pm",
];

const BRAND_ICON_TYPE: Record<Brand, DeviceType> = {
  Apple: "iphone",
  Samsung: "samsung",
  "Google Pixel": "pixel",
  iPad: "ipad",
  MacBook: "macbook",
  Laptop: "laptop",
  Console: "console",
};

function BookingForm() {
  const params = useSearchParams();

  // ── Prefill from calculator handoff (?brand=&model=&repair=) ──
  const prefillModel = (() => {
    const m = params.get("model");
    return m ? getDeviceById(m) : undefined;
  })();
  const prefillBrand: Brand | "" =
    prefillModel?.brand ?? slugToBrand(params.get("brand") ?? "") ?? "";
  const prefillRepair: RepairType | "" =
    slugToRepairType(params.get("repair") ?? "") ??
    (prefillModel ? "Screen replacement" : "");

  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [brand, setBrand] = useState<Brand | "">(prefillBrand);
  const [modelId, setModelId] = useState<string>(prefillModel?.id ?? "");
  const [repairType, setRepairType] = useState<RepairType | "">(prefillRepair);
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", date: "", time: "", issue: "",
  });

  const models = brand ? getModelsByBrand(brand) : [];
  const selectedModel = modelId ? getDeviceById(modelId) : undefined;
  const quote =
    selectedModel && repairType ? getRepairQuote(selectedModel, repairType) : null;

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
        body: JSON.stringify({
          ...formData,
          brand,
          model: selectedModel?.name ?? "",
          modelId,
          repair: repairType,
          estimatedPrice: quote ? `£${quote.minPrice}–£${quote.maxPrice}` : "",
          estimatedTime: quote?.estimatedTime ?? "",
          warranty: quote?.warranty ?? "",
        }),
      });
      if (response.ok) {
        setStatus("sent");
        setFormData({ name: "", email: "", phone: "", date: "", time: "", issue: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const isFormValid =
    formData.name && formData.email && formData.phone &&
    brand && modelId && repairType && formData.date && formData.time;

  if (status === "sent") {
    return (
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
    );
  }

  return (
    <>
      {/* Header */}
      <div className="pt-10 pb-10">
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

      {/* Quote summary (from calculator handoff) */}
      {quote && selectedModel && (
        <div
          className="mb-10 rounded-2xl overflow-hidden animate-fade-up"
          style={{
            background: "linear-gradient(160deg, rgba(59,130,246,0.12) 0%, rgba(59,130,246,0.04) 100%)",
            border: "1px solid rgba(59,130,246,0.22)",
          }}
        >
          <div className="flex items-center justify-between gap-4 px-5 sm:px-6 py-5">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex-shrink-0 opacity-90">
                <DeviceIcon
                  device={BRAND_ICON_TYPE[selectedModel.brand]}
                  size={brand === "MacBook" || brand === "Laptop" || brand === "Console" ? 40 : 48}
                />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-blue-300/70">Your quote</p>
                <p className="font-bold text-foreground truncate">{selectedModel.name}</p>
                <p className="text-xs text-muted-foreground">{repairType}</p>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-2xl sm:text-3xl font-bold text-foreground leading-none">
                £{quote.minPrice}<span className="text-muted-foreground font-semibold">–{quote.maxPrice}</span>
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">incl. parts &amp; labour</p>
            </div>
          </div>
          <div className="grid grid-cols-3 divide-x divide-blue-500/10 border-t border-blue-500/10">
            <div className="px-3 py-2.5 flex items-center justify-center gap-1.5 text-center">
              <Clock className="h-3.5 w-3.5 text-blue-400 flex-shrink-0" />
              <span className="text-[12px] font-medium text-foreground">{quote.estimatedTime}</span>
            </div>
            <div className="px-3 py-2.5 flex items-center justify-center gap-1.5 text-center">
              <Shield className="h-3.5 w-3.5 text-green-400 flex-shrink-0" />
              <span className="text-[12px] font-medium text-green-400">{quote.warranty}</span>
            </div>
            <div className="px-3 py-2.5 flex items-center justify-center gap-1.5 text-center">
              <Check className="h-3.5 w-3.5 text-blue-400 flex-shrink-0" />
              <span className="text-[12px] font-medium text-foreground">Same day</span>
            </div>
          </div>
        </div>
      )}

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
                <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Brand *</label>
                <Select value={brand} onValueChange={(v) => { setBrand(v as Brand); setModelId(""); setRepairType(""); }}>
                  <SelectTrigger className="bg-card border-border h-10 rounded-xl text-[13px]">
                    <SelectValue placeholder="Select…" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border rounded-xl">
                    {BRANDS.map((b) => (
                      <SelectItem key={b} value={b} className="text-[13px]">{b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Model *</label>
                <Select value={modelId} onValueChange={(v) => { setModelId(v); setRepairType((r) => r || "Screen replacement"); }} disabled={!brand}>
                  <SelectTrigger className="bg-card border-border h-10 rounded-xl text-[13px] disabled:opacity-40">
                    <SelectValue placeholder="Select…" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border rounded-xl">
                    {models.map((m) => (
                      <SelectItem key={m.id} value={m.id} className="text-[13px]">{m.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Repair *</label>
                <Select value={repairType} onValueChange={(v) => setRepairType(v as RepairType)} disabled={!modelId}>
                  <SelectTrigger className="bg-card border-border h-10 rounded-xl text-[13px] disabled:opacity-40">
                    <SelectValue placeholder="Select…" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border rounded-xl">
                    {REPAIR_TYPES.map((type) => (
                      <SelectItem key={type} value={type} className="text-[13px]">{type}</SelectItem>
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
          className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl h-11 text-[13px] font-medium disabled:opacity-40 flex items-center justify-center gap-2"
        >
          {status === "sending" ? "Booking…" : "Confirm Booking"}
          {status !== "sending" && <ArrowRight className="h-4 w-4" />}
        </Button>

        <p className="text-[12px] text-muted-foreground text-center">
          We&apos;ll confirm by email within the hour. Walk-ins also welcome.
        </p>
      </form>
    </>
  );
}

export default function BookRepairPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-24">
        <div className="max-w-2xl mx-auto px-5 sm:px-8">
          <Suspense fallback={<div className="pt-16 text-center text-muted-foreground">Loading…</div>}>
            <BookingForm />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
