"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DeviceType } from "@/components/DeviceIcon";
import {
  BRANDS,
  REPAIR_TYPES,
  getModelsByBrand,
  getRepairQuote,
  getRepairTiers,
  getSupportedRepairTypes,
  getDeviceById,
  deviceCategory,
  type Brand,
  type RepairType,
  type DeviceCategory,
} from "@/lib/calculatorData";
import { BUSINESS, FEATURES } from "@/lib/constants";
import { ArrowLeft, ArrowRight, AlertCircle } from "lucide-react";
import TurnstileField, {
  TURNSTILE_ENABLED,
} from "@/components/TurnstileField";
import {
  AppointmentRequestStep,
  BookingSuccess,
  CustomerDetailsStep,
  DeviceSelectionStep,
  Field,
  QuoteSummary,
  RepairSelectionStep,
  ServiceMethodStep,
  slotsForDate,
  type ServiceMethod,
} from "./BookingSteps";

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
];

interface Props {
  prefillBrand?: Brand;
  prefillModelId?: string;
  prefillRepair?: RepairType;
  prefillPartTierId?: string;
  prefillServiceMethod?: ServiceMethod;
  prefillDeviceType?: string;
  prefillDeviceName?: string;
  prefillIssue?: string;
}

// ── Validation ────────────────────────────────────────────────────
function validateForm(data: {
  name: string; email: string; phone: string;
  serviceMethod: ServiceMethod; returnAddress: string;
  deviceType: string; isCatalog: boolean;
  brand: Brand | ""; modelId: string; deviceName: string;
  repairType: RepairType | "";
  partTierId: string; tierRequired: boolean;
  date: string; time: string;
  consentToContact: boolean;
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
  if (data.tierRequired && !data.partTierId)
    errors.partTier = "Please select a part option.";
  if (!data.date) errors.date = "Please select a preferred date.";
  else if (slotsForDate(data.date).length === 0)
    errors.date = "We're closed on Sundays — please pick another day.";
  if (!data.time) errors.time = "Please select a preferred time.";
  else if (data.date && !slotsForDate(data.date).includes(data.time))
    errors.time = "That time isn't available on the selected day.";
  if (!data.consentToContact)
    errors.consentToContact = "Consent is required so we can contact you.";
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
    "Liquid damage repair", "Software / OS issue",
  ],
  desktop: [
    "Custom PC build", "GPU / cooling upgrade", "SSD / RAM upgrade",
    "No power repair", "Motherboard / logic board", "Overheating / fan service",
    "Software / OS issue", "Data recovery", "Hardware diagnostics",
  ],
};

const BOOKING_STEPS = ["Repair", "Visit", "Details"] as const;
const STEP_ERROR_KEYS = [
  ["deviceType", "brand", "model", "deviceName", "repair", "partTier"],
  ["serviceMethod", "returnAddress", "date", "time"],
  ["name", "email", "phone", "consentToContact", "turnstileToken"],
] as const;
const DRAFT_STORAGE_KEY = "origin-booking-draft";

export default function BookingForm({
  prefillBrand,
  prefillModelId,
  prefillRepair,
  prefillPartTierId,
  prefillServiceMethod = "drop-off",
  prefillDeviceType,
  prefillDeviceName,
  prefillIssue,
}: Props) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serviceMethod, setServiceMethod] = useState<ServiceMethod>(
    FEATURES.mailInEnabled ? prefillServiceMethod : "drop-off"
  );

  // Device selection. Infer the device type from a prefilled model if present,
  // otherwise default to "phone" when a brand was prefilled, else force a choice.
  const prefillCategory = prefillModelId
    ? deviceCategory(
        getDeviceById(prefillModelId) ?? {
          id: "",
          name: "",
          brand: "Apple",
          category: "phone",
          tier: "mid",
        }
      )
    : null;
  const [deviceType, setDeviceType] = useState<string>(
    prefillCategory ?? prefillDeviceType ?? (prefillBrand ? "phone" : "")
  );
  const [brand, setBrand] = useState<Brand | "">(prefillBrand ?? "");
  const [modelId, setModelId] = useState<string>(prefillModelId ?? "");
  const [deviceName, setDeviceName] = useState<string>(prefillDeviceName ?? "");
  const [repairType, setRepairType] = useState<RepairType | "">(prefillRepair ?? "");
  const [partTierId, setPartTierId] = useState(prefillPartTierId ?? "");

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
  const [website, setWebsite] = useState("");
  const [consentToContact, setConsentToContact] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const startedAt = useRef(0);
  const idempotencyKey = useRef("");
  const stepPanelRef = useRef<HTMLDivElement>(null);
  const draftHydrated = useRef(false);

  useEffect(() => {
    startedAt.current = Date.now();
    idempotencyKey.current = crypto.randomUUID();

    if (!prefillBrand && !prefillModelId && !prefillDeviceType) {
      try {
        const draft = JSON.parse(
          sessionStorage.getItem(DRAFT_STORAGE_KEY) ?? "{}"
        ) as Partial<{
          serviceMethod: ServiceMethod;
          deviceType: string;
          brand: Brand;
          modelId: string;
          deviceName: string;
          repairType: RepairType;
          partTierId: string;
          date: string;
          time: string;
          currentStep: number;
        }>;

        /* eslint-disable react-hooks/set-state-in-effect */
        if (draft.serviceMethod && FEATURES.mailInEnabled) {
          setServiceMethod(draft.serviceMethod);
        }
        if (draft.deviceType) setDeviceType(draft.deviceType);
        if (draft.brand) setBrand(draft.brand);
        if (draft.modelId) setModelId(draft.modelId);
        if (draft.deviceName) setDeviceName(draft.deviceName);
        if (draft.repairType) setRepairType(draft.repairType);
        if (draft.partTierId) setPartTierId(draft.partTierId);
        if (draft.date) setDate(draft.date);
        if (draft.time) setTime(draft.time);
        if (typeof draft.currentStep === "number") {
          setCurrentStep(Math.min(1, Math.max(0, draft.currentStep)));
        }
        /* eslint-enable react-hooks/set-state-in-effect */
      } catch {
        sessionStorage.removeItem(DRAFT_STORAGE_KEY);
      }
    }

    draftHydrated.current = true;
  }, [prefillBrand, prefillDeviceType, prefillModelId]);

  useEffect(() => {
    if (!draftHydrated.current) return;
    sessionStorage.setItem(
      DRAFT_STORAGE_KEY,
      JSON.stringify({
        serviceMethod,
        deviceType,
        brand,
        modelId,
        deviceName,
        repairType,
        partTierId,
        date,
        time,
        currentStep: Math.min(currentStep, 1),
      })
    );
  }, [
    brand,
    currentStep,
    date,
    deviceName,
    deviceType,
    modelId,
    partTierId,
    repairType,
    serviceMethod,
    time,
  ]);

  useEffect(() => {
    stepPanelRef.current?.focus();
  }, [currentStep]);

  const models = brand && isCatalog
    ? getModelsByBrand(brand).filter((m) => deviceCategory(m) === selectedCategory)
    : [];
  const selectedModel = modelId && isCatalog ? getDeviceById(modelId) : undefined;
  const repairTiers =
    selectedModel && repairType
      ? getRepairTiers(selectedModel, repairType as RepairType)
      : [];
  const effectivePartTierId =
    repairTiers.length === 1 ? repairTiers[0].partTierId : partTierId;
  const quote =
    selectedModel &&
    repairType &&
    (repairTiers.length <= 1 || effectivePartTierId)
      ? getRepairQuote(
          selectedModel,
          repairType as RepairType,
          effectivePartTierId
        )
      : null;
  const availableRepairs = selectedModel
    ? getSupportedRepairTypes(selectedModel)
    : REPAIRS_BY_DEVICE[deviceType] ?? REPAIR_TYPES;

  const today = new Date().toISOString().split("T")[0];

  function currentValidationErrors(): Record<string, string> {
    return validateForm({
      name,
      email,
      phone,
      serviceMethod,
      returnAddress,
      deviceType,
      isCatalog,
      brand,
      modelId,
      deviceName,
      repairType,
      partTierId: effectivePartTierId ?? "",
      tierRequired: repairTiers.length > 1,
      date,
      time,
      consentToContact,
    });
  }

  function moveToStep(nextStep: number) {
    if (nextStep > currentStep) {
      const allErrors = currentValidationErrors();
      const stepErrors = Object.fromEntries(
        STEP_ERROR_KEYS[currentStep]
          .filter((key) => allErrors[key])
          .map((key) => [key, allErrors[key]])
      );
      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors);
        const firstErrorId = Object.keys(stepErrors)[0];
        requestAnimationFrame(() =>
          document.getElementById(firstErrorId)?.focus()
        );
        return;
      }
    }

    setErrors({});
    setCurrentStep(Math.min(BOOKING_STEPS.length - 1, Math.max(0, nextStep)));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = currentValidationErrors();
    if (TURNSTILE_ENABLED && !turnstileToken) {
      validationErrors.turnstileToken = "Complete the spam check.";
    }
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Scroll to first error
      const firstErrorId = Object.keys(validationErrors)[0];
      document.getElementById(firstErrorId)?.focus();
      return;
    }

    setErrors({});
    setStatus("sending");
    setResponseMessage("");

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, email, phone, issue, date, time,
          serviceMethod,
          returnAddress: serviceMethod === "mail-in" ? returnAddress : "",
          deviceType,
          brand: isCatalog ? brand : "",
          model: isCatalog ? (selectedModel?.name ?? "") : deviceName,
          modelId: isCatalog ? modelId : "",
          repair: repairType,
          partTierId: effectivePartTierId ?? "",
          catalogueId: quote?.catalogueId ?? "",
          consentToContact,
          website,
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

      if (response.ok) {
        sessionStorage.removeItem(DRAFT_STORAGE_KEY);
        setResponseMessage(
          result.message ??
            "Repair request received. The team will confirm availability."
        );
        setStatus("sent");
      } else {
        if (result.fields) {
          setErrors(
            Object.fromEntries(
              Object.entries(result.fields).map(([key, messages]) => [
                key,
                messages[0] ?? "",
              ])
            )
          );
        }
        setResponseMessage(
          result.error ??
            "We could not send the request. Please try again."
        );
        setStatus("error");
      }
    } catch {
      setResponseMessage(
        "We could not send the request. Please try again or contact us directly."
      );
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <BookingSuccess
        responseMessage={responseMessage}
        serviceMethod={serviceMethod}
        warranty={quote?.warranty}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      <nav aria-label="Repair request progress">
        <ol className="grid grid-cols-3 gap-2">
          {BOOKING_STEPS.map((label, index) => (
            <li key={label}>
              <div
                className={`h-1 rounded-full ${
                  index <= currentStep ? "bg-foreground" : "bg-border"
                }`}
              />
              <p
                className={`mt-2 text-[11px] font-medium ${
                  index === currentStep
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {index + 1}. {label}
              </p>
            </li>
          ))}
        </ol>
      </nav>

      {Object.values(errors).some(Boolean) && (
        <div
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/10 p-4"
        >
          <p className="text-[13px] font-semibold text-destructive">
            Check the highlighted fields before submitting.
          </p>
          <ul className="mt-2 space-y-1 text-[12px] text-destructive">
            {Object.entries(errors)
              .filter(([, message]) => Boolean(message))
              .map(([field, message]) => (
                <li key={field}>
                  <a href={`#${field}`} className="underline">
                    {message}
                  </a>
                </li>
              ))}
          </ul>
        </div>
      )}

      {currentStep === 2 && quote && selectedModel && (
        <QuoteSummary
          model={selectedModel}
          repair={repairType}
          quote={quote}
          icon={BRAND_ICON_TYPE[selectedModel.brand]}
        />
      )}

      <div ref={stepPanelRef} tabIndex={-1} className="space-y-8 outline-none">
      {currentStep === 2 && (
        <CustomerDetailsStep
          name={name}
          email={email}
          phone={phone}
          errors={errors}
          onName={setName}
          onEmail={setEmail}
          onPhone={setPhone}
        />
      )}

      {currentStep === 1 && (
        <>
          <ServiceMethodStep
            value={serviceMethod}
            returnAddress={returnAddress}
            errors={errors}
            onChange={(value) => {
              setServiceMethod(value);
              setErrors((previous) => ({
                ...previous,
                returnAddress: "",
              }));
            }}
            onReturnAddress={(value) => {
              setReturnAddress(value);
              setErrors((previous) => ({
                ...previous,
                returnAddress: "",
              }));
            }}
          />
          <div className="h-px bg-border" />
        </>
      )}

      {currentStep === 0 && (
        <>
        <DeviceSelectionStep>
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
                setPartTierId("");
                setErrors((prev) => ({
                  ...prev, deviceType: "", brand: "", model: "", deviceName: "", repair: "",
                }));
              }}
            >
              <SelectTrigger
                id="deviceType"
                className="h-11 rounded-xl border-border bg-card text-[13px] sm:h-10 sm:max-w-xs"
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
                    setPartTierId("");
                    setErrors((prev) => ({
                      ...prev,
                      brand: "",
                      model: "",
                      repair: "",
                      partTier: "",
                    }));
                  }}
                >
                  <SelectTrigger
                    id="brand"
                    className="h-11 rounded-xl border-border bg-card text-[13px] sm:h-10"
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
                    setRepairType("");
                    setPartTierId("");
                    setErrors((prev) => ({
                      ...prev,
                      model: "",
                      repair: "",
                      partTier: "",
                    }));
                  }}
                  disabled={!brand}
                >
                  <SelectTrigger
                    id="model"
                    className="h-11 rounded-xl border-border bg-card text-[13px] disabled:opacity-50 sm:h-10"
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
                    setPartTierId("");
                    setErrors((prev) => ({
                      ...prev,
                      repair: "",
                      partTier: "",
                    }));
                  }}
                  disabled={!modelId}
                >
                  <SelectTrigger
                    id="repair"
                    className="h-11 rounded-xl border-border bg-card text-[13px] disabled:opacity-50 sm:h-10"
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
                  maxLength={120}
                  className="h-11 rounded-xl border-border bg-card text-[13px] sm:h-10"
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
                    className="h-11 rounded-xl border-border bg-card text-[13px] disabled:opacity-50 sm:h-10"
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
        </DeviceSelectionStep>

        <div className="h-px bg-border" />

        <RepairSelectionStep
          tiers={isCatalog ? repairTiers : []}
          partTierId={partTierId}
          issue={issue}
          error={errors.partTier}
          onTier={(value) => {
            setPartTierId(value);
            setErrors((previous) => ({
              ...previous,
              partTier: "",
            }));
          }}
          onIssue={setIssue}
        />
        </>
      )}

      {currentStep === 1 && (
        <AppointmentRequestStep
          serviceMethod={serviceMethod}
          date={date}
          time={time}
          today={today}
          errors={errors}
          onDate={(next) => {
            setDate(next);
            if (time && !slotsForDate(next).includes(time)) setTime("");
            setErrors((previous) => ({
              ...previous,
              date:
                slotsForDate(next).length === 0
                  ? "Sunday requests are unavailable."
                  : "",
            }));
          }}
          onTime={(value) => {
            setTime(value);
            setErrors((previous) => ({ ...previous, time: "" }));
          }}
        />
      )}

      {currentStep === 2 && (
        <>
        <div className="border-t border-border pt-6">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Review and consent
          </p>
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
            I agree that Origin Repairs may use these details to contact me
            about this repair request. See the{" "}
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

      <div
        className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
        aria-hidden="true"
      >
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <TurnstileField onToken={setTurnstileToken} />
      {errors.turnstileToken && (
        <p role="alert" className="text-[12px] text-destructive">
          {errors.turnstileToken}
        </p>
      )}

      {/* ── Error banner ────────────────────────────────────────── */}
      {status === "error" && (
        <div
          role="alert"
          className="flex items-start gap-3 p-4 rounded-xl border border-destructive/30 bg-destructive/10"
        >
          <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
          <p className="text-[13px] text-destructive">
            {responseMessage} Call{" "}
            <a href={`tel:${BUSINESS.phone}`} className="underline font-medium">
              {BUSINESS.phoneDisplay}
            </a>
            {" "}if the problem continues.
          </p>
        </div>
      )}

      <Button
        type="submit"
        disabled={status === "sending"}
        className="btn-primary w-full h-12 rounded-lg text-[14px] font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {status === "sending" ? (
          "Sending…"
        ) : (
          <>
            Request Repair Slot
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>

      <p className="text-[12px] text-muted-foreground text-center">
        This request does not reserve a time. The team will confirm
        availability and the final quote.
      </p>
        </>
      )}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-border pt-6">
        {currentStep > 0 ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => moveToStep(currentStep - 1)}
            className="h-11 rounded-md px-5"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        ) : (
          <span />
        )}
        {currentStep < BOOKING_STEPS.length - 1 && (
          <Button
            type="button"
            onClick={() => moveToStep(currentStep + 1)}
            className="h-11 rounded-md px-6"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </form>
  );
}
