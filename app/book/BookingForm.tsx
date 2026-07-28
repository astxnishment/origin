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
  deviceCategory,
  type Brand,
  type RepairType,
  type DeviceCategory,
} from "@/lib/calculatorData";
import { BUSINESS } from "@/lib/constants";
import { Check, Clock, Shield, ArrowRight, AlertCircle, Package, Store } from "lucide-react";

// ── Time slots available for booking ─────────────────────────────
// Mon–Fri 9am–6pm, Sat 10am–4pm, Sun closed (see BUSINESS.hours).
const WEEKDAY_SLOTS = [
  "9:00am", "10:00am", "11:00am", "12:00pm",
  "1:00pm", "2:00pm", "3:00pm", "4:00pm", "5:00pm",
];
const SATURDAY_SLOTS = ["10:00am", "11:00am", "12:00pm", "1:00pm", "2:00pm", "3:00pm"];

function slotsForDate(dateStr: string): string[] {
  if (!dateStr) return WEEKDAY_SLOTS;
  const day = new Date(`${dateStr}T12:00:00`).getDay();
  if (day === 0) return []; // Sunday — closed
  if (day === 6) return SATURDAY_SLOTS;
  return WEEKDAY_SLOTS;
}

const BRAND_ICON_TYPE: Record<Brand, DeviceType> = {
  Apple:          "iphone",
  Samsung:        "samsung",
  "Google Pixel": "iphone",
};

// ── Device types the shop repairs ─────────────────────────────────
// "catalog" types (phone/tablet/laptop) have a model database we can
// filter by brand + model. The rest are booked with a free-text make/model.
type DeviceTypeOption = {
  id: string;
  label: string;
  category: DeviceCategory | null; // null → free-text (no model catalog)
  icon: DeviceType;
  placeholder?: string;
};

const DEVICE_TYPE_OPTIONS: DeviceTypeOption[] = [
  { id: "phone",   label: "Phone",               category: "phone",  icon: "iphone"  },
  { id: "tablet",  label: "Tablet",              category: "tablet", icon: "ipad"    },
  { id: "laptop",  label: "Laptop",              category: "laptop", icon: "laptop"  },
  { id: "console", label: "Game console",        category: null,     icon: "console", placeholder: "e.g. PlayStation 5, Xbox Series X, Switch OLED" },
  { id: "desktop", label: "Desktop / Custom PC", category: null,     icon: "laptop",  placeholder: "e.g. Custom gaming PC, Dell OptiPlex" },
  { id: "other",   label: "Other device",        category: null,     icon: "iphone",  placeholder: "Tell us the make & model" },
];

interface Props {
  prefillBrand?: Brand;
  prefillModelId?: string;
  prefillRepair?: RepairType;
  prefillServiceMethod?: ServiceMethod;
  prefillDeviceType?: string;
  prefillDeviceName?: string;
  prefillIssue?: string;
}

type ServiceMethod = "drop-off" | "mail-in";

// ── Validation ────────────────────────────────────────────────────
function validateForm(data: {
  name: string; email: string; phone: string;
  serviceMethod: ServiceMethod; returnAddress: string;
  deviceType: string; isCatalog: boolean;
  brand: Brand | ""; modelId: string; deviceName: string;
  repairType: RepairType | "";
  date: string; time: string;
}): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!data.name.trim()) errors.name = "Please enter your name.";
  if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = "Please enter a valid email address.";
  if (!data.phone.trim()) errors.phone = "Please enter your phone number.";
  if (data.serviceMethod === "mail-in" && !data.returnAddress.trim())
    errors.returnAddress = "Please enter the return address for your device.";
  if (!data.deviceType) errors.deviceType = "Please choose a device type.";
  if (data.isCatalog) {
    if (!data.brand) errors.brand = "Please select a brand.";
    if (!data.modelId) errors.model = "Please select a model.";
  } else if (data.deviceType && !data.deviceName.trim()) {
    errors.deviceName = "Please tell us the make & model.";
  }
  if (!data.repairType) errors.repair = "Please select a repair type.";
  if (!data.date) errors.date = "Please select a preferred date.";
  else if (slotsForDate(data.date).length === 0)
    errors.date = "We're closed on Sundays — please pick another day.";
  if (!data.time) errors.time = "Please select a preferred time.";
  else if (data.date && !slotsForDate(data.date).includes(data.time))
    errors.time = "That time isn't available on the selected day.";
  return errors;
}

const REPAIRS_BY_DEVICE: Record<string, readonly RepairType[]> = {
  phone: REPAIR_TYPES.filter((repair) =>
    ![
      "Keyboard / trackpad repair", "SSD / RAM upgrade", "HDMI port repair",
      "Overheating / fan service", "Custom PC build", "GPU / cooling upgrade",
    ].includes(repair)
  ),
  tablet: REPAIR_TYPES.filter((repair) =>
    ![
      "Back glass", "Face ID / biometric repair", "Keyboard / trackpad repair",
      "SSD / RAM upgrade", "HDMI port repair", "Overheating / fan service",
      "Custom PC build", "GPU / cooling upgrade",
    ].includes(repair)
  ),
  laptop: REPAIR_TYPES.filter((repair) =>
    ![
      "Back glass", "Face ID / biometric repair", "HDMI port repair",
      "Custom PC build", "GPU / cooling upgrade",
    ].includes(repair)
  ),
  console: [
    "HDMI port repair", "Charging port", "No power repair",
    "Motherboard / logic board", "Overheating / fan service",
    "Liquid damage repair", "Software / OS issue", "Hardware diagnostics", "Other repair",
  ],
  desktop: [
    "Custom PC build", "GPU / cooling upgrade", "SSD / RAM upgrade",
    "No power repair", "Motherboard / logic board", "Overheating / fan service",
    "Software / OS issue", "Data recovery", "Hardware diagnostics", "Other repair",
  ],
  other: REPAIR_TYPES,
};

export default function BookingForm({
  prefillBrand,
  prefillModelId,
  prefillRepair,
  prefillServiceMethod = "drop-off",
  prefillDeviceType,
  prefillDeviceName,
  prefillIssue,
}: Props) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serviceMethod, setServiceMethod] = useState<ServiceMethod>(prefillServiceMethod);

  // Device selection. Infer the device type from a prefilled model if present,
  // otherwise default to "phone" when a brand was prefilled, else force a choice.
  const prefillCategory = prefillModelId
    ? deviceCategory(getDeviceById(prefillModelId) ?? { id: "", name: "", brand: "Apple", tier: "mid" })
    : null;
  const [deviceType, setDeviceType] = useState<string>(
    prefillCategory ?? prefillDeviceType ?? (prefillBrand ? "phone" : "")
  );
  const [brand, setBrand] = useState<Brand | "">(prefillBrand ?? "");
  const [modelId, setModelId] = useState<string>(prefillModelId ?? "");
  const [deviceName, setDeviceName] = useState<string>(prefillDeviceName ?? "");
  const [repairType, setRepairType] = useState<RepairType | "">(prefillRepair ?? "");

  const deviceTypeOption = DEVICE_TYPE_OPTIONS.find((d) => d.id === deviceType);
  const selectedCategory = deviceTypeOption?.category ?? null;
  const isCatalog = selectedCategory !== null;

  // Brands that actually have a model in the chosen category.
  const availableBrands: Brand[] = isCatalog
    ? BRANDS.filter((b) => getModelsByBrand(b).some((m) => deviceCategory(m) === selectedCategory))
    : [];

  // Customer details
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [returnAddress, setReturnAddress] = useState("");
  const [issue, setIssue] = useState(prefillIssue ?? "");

  const models = brand && isCatalog
    ? getModelsByBrand(brand).filter((m) => deviceCategory(m) === selectedCategory)
    : [];
  const selectedModel = modelId && isCatalog ? getDeviceById(modelId) : undefined;
  const quote =
    selectedModel && repairType
      ? getRepairQuote(selectedModel, repairType as RepairType)
      : null;
  const availableRepairs = REPAIRS_BY_DEVICE[deviceType] ?? REPAIR_TYPES;

  const today = new Date().toISOString().split("T")[0];

  // ── Submit handler ──────────────────────────────────────────────
  // TO CONNECT EMAIL:
  //   1. Add RESEND_API_KEY to .env.local  (get a free key at resend.com)
  //   2. The API route at /api/booking already sends emails via Resend
  //   3. Alternatively replace the fetch() below with Formspree/EmailJS
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm({
      name, email, phone,
      serviceMethod, returnAddress,
      deviceType, isCatalog,
      brand, modelId, deviceName,
      repairType, date, time,
    });
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
          serviceMethod,
          returnAddress: serviceMethod === "mail-in" ? returnAddress : "",
          deviceType: deviceTypeOption?.label ?? "",
          brand: isCatalog ? brand : "",
          model: isCatalog ? (selectedModel?.name ?? "") : deviceName,
          modelId: isCatalog ? modelId : "",
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
            {serviceMethod === "mail-in" ? " your mail-in instructions." : " your slot."}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            What happens next
          </p>
          {(serviceMethod === "mail-in"
            ? [
                `Ship your device tracked to ${BUSINESS.address}`,
                "Include your name, phone number, return address and booking reference",
                "We assess it and confirm the quote before any work begins",
                "Repair completed and returned by tracked delivery",
              ]
            : [
                `Come to ${BUSINESS.address}`,
                "Free assessment to confirm the fault and exact price",
                "Price agreed before any work begins",
                "Repair carried out — 12-month warranty on eligible repairs",
              ]
          ).map((step, i) => (
            <div key={i} className="flex gap-3">
              <span className="text-[12px] font-semibold text-primary mt-0.5 flex-shrink-0">
                {i + 1}.
              </span>
              <p className="text-[13px] text-muted-foreground">{step}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button asChild className="btn-primary h-10 rounded-lg px-6 text-[13px]">
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
          className="overflow-hidden rounded-lg"
          style={{
            background: "var(--soft-bg)",
            border: "1px solid var(--control-border)",
          }}
        >
          <div className="flex items-center justify-between gap-4 px-5 py-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex-shrink-0 opacity-90">
                <DeviceIcon device={BRAND_ICON_TYPE[selectedModel.brand]} size={44} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
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
          <div className="grid grid-cols-3 divide-x divide-border border-t border-border text-[12px]">
            <div className="px-3 py-2 flex items-center justify-center gap-1.5">
              <Clock className="h-3 w-3 text-[color:var(--icon-fg)] flex-shrink-0" />
              <span className="font-medium text-foreground">{quote.estimatedTime}</span>
            </div>
            <div className="px-3 py-2 flex items-center justify-center gap-1.5">
              <Shield className="h-3 w-3 text-green-400 flex-shrink-0" />
              <span className="font-medium text-green-400">12-month warranty</span>
            </div>
            <div className="px-3 py-2 flex items-center justify-center gap-1.5">
              <Check className="h-3 w-3 text-[color:var(--icon-fg)] flex-shrink-0" />
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

          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              How will we receive it?
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {[
                { value: "drop-off" as const, title: "Visit the shop", body: "Walk in or book a time at our Leeds workshop.", icon: Store },
                { value: "mail-in" as const, title: "Mail-in repair", body: "Ship your device to us using tracked postage.", icon: Package },
              ].map(({ value, title, body, icon: Icon }) => {
                const active = serviceMethod === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setServiceMethod(value);
                      setErrors((prev) => ({ ...prev, returnAddress: "" }));
                    }}
                    className="rounded-xl border p-4 text-left transition-colors hover:bg-surface"
                    style={{
                      borderColor: active ? "var(--control-border-hover)" : "var(--border)",
                      background: active ? "var(--selection-bg)" : "var(--card)",
                    }}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <Icon className="h-4 w-4 text-[color:var(--icon-fg)]" />
                      <span className="text-[13px] font-semibold text-foreground">{title}</span>
                    </div>
                    <p className="text-[12px] leading-relaxed text-muted-foreground">{body}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {serviceMethod === "mail-in" && (
            <Field label="Return address" id="returnAddress" required error={errors.returnAddress}>
              <Textarea
                id="returnAddress"
                name="returnAddress"
                value={returnAddress}
                onChange={(e) => {
                  setReturnAddress(e.target.value);
                  setErrors((prev) => ({ ...prev, returnAddress: "" }));
                }}
                placeholder="Your return shipping address"
                rows={3}
                className="bg-card border-border rounded-xl text-[13px] resize-none"
                aria-describedby={errors.returnAddress ? "returnAddress-error" : undefined}
              />
            </Field>
          )}
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
          {/* Device type — the first thing we ask, drives the rest */}
          <Field label="Device type" id="deviceType" required error={errors.deviceType}>
            <Select
              value={deviceType}
              onValueChange={(v) => {
                setDeviceType(v);
                setBrand("");
                setModelId("");
                setDeviceName("");
                setRepairType("");
                setErrors((prev) => ({
                  ...prev, deviceType: "", brand: "", model: "", deviceName: "", repair: "",
                }));
              }}
            >
              <SelectTrigger
                id="deviceType"
                className="bg-card border-border h-10 rounded-xl text-[13px] sm:max-w-xs"
                aria-describedby={errors.deviceType ? "deviceType-error" : undefined}
              >
                <SelectValue placeholder="What are you bringing in?" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border rounded-xl">
                {DEVICE_TYPE_OPTIONS.map((d) => (
                  <SelectItem key={d.id} value={d.id} className="text-[13px]">
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {/* Catalog device (phone / tablet / laptop): brand + model + repair */}
          {isCatalog ? (
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
                    {availableBrands.map((b) => (
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
                    {availableRepairs.map((type) => (
                      <SelectItem key={type} value={type} className="text-[13px]">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          ) : deviceType ? (
            /* Console / desktop / other: free-text make & model + repair */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Make & model" id="deviceName" required error={errors.deviceName}>
                <Input
                  id="deviceName"
                  name="deviceName"
                  value={deviceName}
                  onChange={(e) => {
                    setDeviceName(e.target.value);
                    setErrors((prev) => ({ ...prev, deviceName: "" }));
                  }}
                  placeholder={deviceTypeOption?.placeholder ?? "Tell us the make & model"}
                  className="bg-card border-border h-10 rounded-xl text-[13px]"
                  aria-describedby={errors.deviceName ? "deviceName-error" : undefined}
                />
              </Field>

              <Field label="Repair / issue" id="repair" required error={errors.repair}>
                <Select
                  value={repairType}
                  onValueChange={(v) => {
                    setRepairType(v as RepairType);
                    setErrors((prev) => ({ ...prev, repair: "" }));
                  }}
                  disabled={!deviceName}
                >
                  <SelectTrigger
                    id="repair"
                    className="bg-card border-border h-10 rounded-xl text-[13px] disabled:opacity-50"
                    aria-describedby={errors.repair ? "repair-error" : undefined}
                  >
                    <SelectValue
                      placeholder={deviceName ? "Select a repair" : "Enter your device first"}
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border rounded-xl">
                    {availableRepairs.map((type) => (
                      <SelectItem key={type} value={type} className="text-[13px]">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          ) : null}

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
          {serviceMethod === "mail-in" ? "Expected send date" : "Preferred date & time"}
        </h2>

        <div className="space-y-5">
          <Field label={serviceMethod === "mail-in" ? "Expected send date" : "Date"} id="date" required error={errors.date}>
            <Input
              id="date"
              name="date"
              type="date"
              value={date}
              min={today}
              onChange={(e) => {
                const next = e.target.value;
                setDate(next);
                // Drop a selected time that isn't offered on the new day
                if (time && !slotsForDate(next).includes(time)) setTime("");
                setErrors((prev) => ({
                  ...prev,
                  date: slotsForDate(next).length === 0
                    ? "We're closed on Sundays — please pick another day."
                    : "",
                }));
              }}
              className="bg-card border-border h-10 rounded-xl text-[13px] max-w-xs"
              aria-describedby={errors.date ? "date-error" : undefined}
            />
          </Field>

          <fieldset>
            <legend className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              {serviceMethod === "mail-in" ? "Best time to contact you" : "Time"} <span className="text-destructive ml-0.5">*</span>
            </legend>
            {errors.time && (
              <p id="time-error" role="alert" className="text-[12px] text-destructive mb-2 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.time}
              </p>
            )}
            {slotsForDate(date).length === 0 && (
              <p className="text-[12px] text-muted-foreground mb-2">
                We&apos;re closed on Sundays. Open Mon–Fri 9am–6pm, Sat 10am–4pm.
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              {slotsForDate(date).map((slot) => (
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
                      ? "bg-primary text-primary-foreground border-primary"
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
        className="btn-primary w-full h-12 rounded-lg text-[14px] font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
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
