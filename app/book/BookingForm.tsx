"use client";

import { useState } from "react";
import Link from "next/link";
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
  type Brand,
  type RepairType,
} from "@/lib/calculatorData";
import { BUSINESS } from "@/lib/constants";
import { Check, Clock, Shield, ArrowRight, AlertCircle } from "lucide-react";

// ── Time slots available for booking ─────────────────────────────
const TIME_SLOTS = [
  "9:00am", "10:00am", "11:00am", "12:00pm",
  "1:00pm", "2:00pm", "3:00pm", "4:00pm", "5:00pm",
];

const BRAND_ICON_TYPE: Record<Brand, DeviceType> = {
  Apple: "iphone",
  Samsung: "samsung",
};

interface Props {
  prefillBrand?: Brand;
  prefillModelId?: string;
  prefillRepair?: RepairType;
}

// ── Validation ────────────────────────────────────────────────────
function validateForm(data: {
  name: string; email: string; phone: string;
  brand: Brand | ""; modelId: string; repairType: RepairType | "";
  date: string; time: string;
}): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!data.name.trim()) errors.name = "Please enter your name.";
  if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = "Please enter a valid email address.";
  if (!data.phone.trim()) errors.phone = "Please enter your phone number.";
  if (!data.brand) errors.brand = "Please select a brand.";
  if (!data.modelId) errors.model = "Please select a model.";
  if (!data.repairType) errors.repair = "Please select a repair type.";
  if (!data.date) errors.date = "Please select a preferred date.";
  if (!data.time) errors.time = "Please select a preferred time.";
  return errors;
}

export default function BookingForm({ prefillBrand, prefillModelId, prefillRepair }: Props) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Device selection
  const [brand, setBrand] = useState<Brand | "">(prefillBrand ?? "");
  const [modelId, setModelId] = useState<string>(prefillModelId ?? "");
  const [repairType, setRepairType] = useState<RepairType | "">(prefillRepair ?? "");

  // Customer details
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [issue, setIssue] = useState("");

  const models = brand ? getModelsByBrand(brand) : [];
  const selectedModel = modelId ? getDeviceById(modelId) : undefined;
  const quote =
    selectedModel && repairType
      ? getRepairQuote(selectedModel, repairType as RepairType)
      : null;

  const today = new Date().toISOString().split("T")[0];

  // ── Submit handler ──────────────────────────────────────────────
  // TO CONNECT EMAIL:
  //   1. Add RESEND_API_KEY to .env.local  (get a free key at resend.com)
  //   2. The API route at /api/booking already sends emails via Resend
  //   3. Alternatively replace the fetch() below with Formspree/EmailJS
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm({ name, email, phone, brand, modelId, repairType, date, time });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Scroll to first error
      const firstErrorId = Object.keys(validationErrors)[0];
      document.getElementById(firstErrorId)?.focus();
      return;
    }

    setErrors({});
    setStatus("sending");

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, email, phone, issue, date, time,
          brand,
          model: selectedModel?.name ?? "",
          modelId,
          repair: repairType,
          estimatedPrice: quote && !quote.inspectionRequired ? `£${quote.minPrice}–£${quote.maxPrice}` : "TBC after assessment",
          estimatedTime: quote?.estimatedTime ?? "",
          warranty: quote?.warranty ?? "12 months on eligible repairs",
        }),
      });

      if (response.ok) {
        setStatus("sent");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  // ── Success state ───────────────────────────────────────────────
  if (status === "sent") {
    return (
      <div className="flex flex-col gap-5 py-12">
        <div className="w-12 h-12 rounded-full bg-green-500/15 flex items-center justify-center">
          <Check className="h-5 w-5 text-green-500" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-2">Booking received.</h2>
          <p className="text-[15px] text-muted-foreground">
            Check your email for confirmation. We&apos;ll be in touch within the hour to confirm
            your slot.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            What happens next
          </p>
          {[
            `Come to ${BUSINESS.address}`,
            "Free assessment to confirm the fault and exact price",
            "Price agreed before any work begins",
            "Repair carried out — 12-month warranty on eligible repairs",
          ].map((step, i) => (
            <div key={i} className="flex gap-3">
              <span className="text-[12px] font-semibold text-primary mt-0.5 flex-shrink-0">
                {i + 1}.
              </span>
              <p className="text-[13px] text-muted-foreground">{step}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-xl h-10 px-6 text-[13px]">
            <Link href="/">Back to home</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl h-10 px-6 text-[13px] border-border">
            <a href={`tel:${BUSINESS.phone}`}>Call {BUSINESS.phoneDisplay}</a>
          </Button>
        </div>
      </div>
    );
  }

  // ── Form ────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-10">

      {/* ── Quote summary banner (when prefilled from calculator) ── */}
      {quote && selectedModel && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(160deg, rgba(59,130,246,0.12) 0%, rgba(59,130,246,0.04) 100%)",
            border: "1px solid rgba(59,130,246,0.22)",
          }}
        >
          <div className="flex items-center justify-between gap-4 px-5 py-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex-shrink-0 opacity-90">
                <DeviceIcon device={BRAND_ICON_TYPE[selectedModel.brand]} size={44} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-blue-300/70">
                  Your quote
                </p>
                <p className="font-semibold text-foreground truncate text-[14px]">
                  {selectedModel.name}
                </p>
                <p className="text-[12px] text-muted-foreground">{repairType}</p>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              {quote.inspectionRequired ? (
                <p className="text-base font-bold text-foreground leading-none">Inspection required</p>
              ) : (
                <p className="text-2xl font-bold text-foreground leading-none">
                  £{quote.minPrice}
                  <span className="text-muted-foreground font-semibold">–£{quote.maxPrice}</span>
                </p>
              )}
              <p className="text-[11px] text-muted-foreground mt-1">est. incl. parts &amp; labour</p>
            </div>
          </div>
          <div className="grid grid-cols-3 divide-x divide-blue-500/10 border-t border-blue-500/10 text-[12px]">
            <div className="px-3 py-2 flex items-center justify-center gap-1.5">
              <Clock className="h-3 w-3 text-blue-400 flex-shrink-0" />
              <span className="font-medium text-foreground">{quote.estimatedTime}</span>
            </div>
            <div className="px-3 py-2 flex items-center justify-center gap-1.5">
              <Shield className="h-3 w-3 text-green-400 flex-shrink-0" />
              <span className="font-medium text-green-400">12-month warranty</span>
            </div>
            <div className="px-3 py-2 flex items-center justify-center gap-1.5">
              <Check className="h-3 w-3 text-blue-400 flex-shrink-0" />
              <span className="font-medium text-foreground">Free assess.</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Section 1: Your details ─────────────────────────────── */}
      <section aria-labelledby="details-heading">
        <h2
          id="details-heading"
          className="text-[13px] font-semibold text-foreground mb-5 flex items-center gap-2"
        >
          <span
            className="w-5 h-5 rounded-full border border-border flex items-center justify-center text-[11px]"
            aria-hidden="true"
          >
            1
          </span>
          Your details
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full name" id="name" required error={errors.name}>
              <Input
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                autoComplete="name"
                className="bg-card border-border h-10 rounded-xl text-[13px]"
                aria-describedby={errors.name ? "name-error" : undefined}
              />
            </Field>

            <Field label="Email" id="email" required error={errors.email}>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                autoComplete="email"
                className="bg-card border-border h-10 rounded-xl text-[13px]"
                aria-describedby={errors.email ? "email-error" : undefined}
              />
            </Field>
          </div>

          <Field label="Phone number" id="phone" required error={errors.phone}>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="07xxx xxxxxx"
              autoComplete="tel"
              className="bg-card border-border h-10 rounded-xl text-[13px] max-w-xs"
              aria-describedby={errors.phone ? "phone-error" : undefined}
            />
          </Field>
        </div>
      </section>

      <div className="h-px bg-border" />

      {/* ── Section 2: Device ───────────────────────────────────── */}
      <section aria-labelledby="device-heading">
        <h2
          id="device-heading"
          className="text-[13px] font-semibold text-foreground mb-5 flex items-center gap-2"
        >
          <span
            className="w-5 h-5 rounded-full border border-border flex items-center justify-center text-[11px]"
            aria-hidden="true"
          >
            2
          </span>
          Your device
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Brand */}
            <Field label="Brand" id="brand" required error={errors.brand}>
              <Select
                value={brand}
                onValueChange={(v) => {
                  setBrand(v as Brand);
                  setModelId("");
                  setRepairType("");
                  setErrors((prev) => ({ ...prev, brand: "", model: "", repair: "" }));
                }}
              >
                <SelectTrigger
                  id="brand"
                  className="bg-card border-border h-10 rounded-xl text-[13px]"
                  aria-describedby={errors.brand ? "brand-error" : undefined}
                >
                  <SelectValue placeholder="Select a brand" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border rounded-xl">
                  {BRANDS.map((b) => (
                    <SelectItem key={b} value={b} className="text-[13px]">
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* Model */}
            <Field label="Model" id="model" required error={errors.model}>
              <Select
                value={modelId}
                onValueChange={(v) => {
                  setModelId(v);
                  setErrors((prev) => ({ ...prev, model: "" }));
                }}
                disabled={!brand}
              >
                <SelectTrigger
                  id="model"
                  className="bg-card border-border h-10 rounded-xl text-[13px] disabled:opacity-50"
                  aria-describedby={errors.model ? "model-error" : undefined}
                >
                  <SelectValue
                    placeholder={brand ? "Select a model" : "Select a brand first"}
                  />
                </SelectTrigger>
                <SelectContent className="bg-card border-border rounded-xl">
                  {models.map((m) => (
                    <SelectItem key={m.id} value={m.id} className="text-[13px]">
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* Repair type */}
            <Field label="Repair type" id="repair" required error={errors.repair}>
              <Select
                value={repairType}
                onValueChange={(v) => {
                  setRepairType(v as RepairType);
                  setErrors((prev) => ({ ...prev, repair: "" }));
                }}
                disabled={!modelId}
              >
                <SelectTrigger
                  id="repair"
                  className="bg-card border-border h-10 rounded-xl text-[13px] disabled:opacity-50"
                  aria-describedby={errors.repair ? "repair-error" : undefined}
                >
                  <SelectValue
                    placeholder={modelId ? "Select a repair" : "Select a model first"}
                  />
                </SelectTrigger>
                <SelectContent className="bg-card border-border rounded-xl">
                  {REPAIR_TYPES.map((type) => (
                    <SelectItem key={type} value={type} className="text-[13px]">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          {/* Live price preview */}
          {quote ? (
            <p className="text-[12px] text-muted-foreground">
              Estimated price:{" "}
              <span className="text-foreground font-semibold">
                £{quote.minPrice}–£{quote.maxPrice}
              </span>{" "}
              · {quote.estimatedTime} · exact quote confirmed free before we start
            </p>
          ) : brand && modelId && repairType ? (
            <p className="text-[12px] text-muted-foreground">
              We&apos;ll need to inspect this device for an exact quote — free assessment, no
              obligation.
            </p>
          ) : null}

          {/* Issue description */}
          <div className="space-y-1.5">
            <label
              htmlFor="issue"
              className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground"
            >
              Issue description{" "}
              <span className="font-normal normal-case text-muted-foreground/70">(optional)</span>
            </label>
            <Textarea
              id="issue"
              name="issue"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              placeholder="e.g. Cracked screen, won't charge, dropped in water…"
              rows={3}
              className="bg-card border-border rounded-xl text-[13px] resize-none"
            />
          </div>
        </div>
      </section>

      <div className="h-px bg-border" />

      {/* ── Section 3: Date & time ──────────────────────────────── */}
      <section aria-labelledby="schedule-heading">
        <h2
          id="schedule-heading"
          className="text-[13px] font-semibold text-foreground mb-5 flex items-center gap-2"
        >
          <span
            className="w-5 h-5 rounded-full border border-border flex items-center justify-center text-[11px]"
            aria-hidden="true"
          >
            3
          </span>
          Preferred date &amp; time
        </h2>

        <div className="space-y-5">
          <Field label="Date" id="date" required error={errors.date}>
            <Input
              id="date"
              name="date"
              type="date"
              value={date}
              min={today}
              onChange={(e) => {
                setDate(e.target.value);
                setErrors((prev) => ({ ...prev, date: "" }));
              }}
              className="bg-card border-border h-10 rounded-xl text-[13px] max-w-xs"
              aria-describedby={errors.date ? "date-error" : undefined}
            />
          </Field>

          <fieldset>
            <legend className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Time <span className="text-destructive ml-0.5">*</span>
            </legend>
            {errors.time && (
              <p id="time-error" role="alert" className="text-[12px] text-destructive mb-2 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.time}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => {
                    setTime(slot);
                    setErrors((prev) => ({ ...prev, time: "" }));
                  }}
                  aria-pressed={time === slot}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-colors ${
                    time === slot
                      ? "bg-primary text-white border-primary"
                      : "bg-card border-border text-foreground hover:border-primary/60"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      </section>

      {/* ── Error banner ────────────────────────────────────────── */}
      {status === "error" && (
        <div
          role="alert"
          className="flex items-start gap-3 p-4 rounded-xl border border-destructive/30 bg-destructive/10"
        >
          <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
          <p className="text-[13px] text-destructive">
            Something went wrong sending your booking. Please try again, or call us directly on{" "}
            <a href={`tel:${BUSINESS.phone}`} className="underline font-medium">
              {BUSINESS.phoneDisplay}
            </a>
            .
          </p>
        </div>
      )}

      {/* ── Submit ──────────────────────────────────────────────── */}
      <Button
        type="submit"
        disabled={status === "sending"}
        className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl h-12 text-[14px] font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {status === "sending" ? (
          "Sending…"
        ) : (
          <>
            Confirm Booking Request
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>

      <p className="text-[12px] text-muted-foreground text-center">
        We&apos;ll confirm by email within the hour. Walk-ins also welcome — no booking needed for most repairs.
      </p>

      {/* ── Backend setup note (remove once Resend is connected) ─ */}
      {/*
        TO ENABLE EMAIL CONFIRMATIONS:
        1. Sign up at https://resend.com (free tier covers this volume)
        2. Add RESEND_API_KEY=re_xxx to your .env.local file
        3. The route at /api/booking sends a confirmation to the customer
           and a notification to tech@originrepairs.co.uk
        4. Test with: curl -X POST /api/booking -d '{"name":"Test","email":"..."}'
      */}
    </form>
  );
}

// ── Helper: labelled field with error display ─────────────────────
function Field({
  label, id, required, error, children,
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
