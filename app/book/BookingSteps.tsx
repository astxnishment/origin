"use client";

import Link from "next/link";
import {
  AlertCircle,
  Check,
  Clock,
  Package,
  Shield,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DeviceIcon, type DeviceType } from "@/components/DeviceIcon";
import type {
  DeviceModel,
  RepairPrice,
} from "@/lib/calculatorData";
import type { RepairCatalogueEntry } from "@/lib/repairCatalogue";
import { BUSINESS, FEATURES } from "@/lib/constants";

export type ServiceMethod = "drop-off" | "mail-in";
export type FormErrors = Record<string, string>;

const WEEKDAY_SLOTS = [
  "9:00am",
  "10:00am",
  "11:00am",
  "12:00pm",
  "1:00pm",
  "2:00pm",
  "3:00pm",
  "4:00pm",
  "5:00pm",
];
const SATURDAY_SLOTS = [
  "10:00am",
  "11:00am",
  "12:00pm",
  "1:00pm",
  "2:00pm",
  "3:00pm",
];

export function slotsForDate(dateStr: string): string[] {
  if (!dateStr) return WEEKDAY_SLOTS;
  const day = new Date(`${dateStr}T12:00:00`).getDay();
  if (day === 0) return [];
  if (day === 6) return SATURDAY_SLOTS;
  return WEEKDAY_SLOTS;
}

export function BookingSuccess({
  responseMessage,
  serviceMethod,
  warranty,
}: {
  responseMessage: string;
  serviceMethod: ServiceMethod;
  warranty?: string;
}) {
  const steps =
    serviceMethod === "mail-in"
      ? [
          "Wait for the team to accept the request and send current shipping instructions",
          "Do not post the device until those instructions are confirmed",
          "The device is assessed and the quote is confirmed before work begins",
          "Return arrangements are agreed with you",
        ]
      : [
          "The team checks your preferred time and contacts you",
          "The fault and final price are confirmed before work begins",
          "You decide whether to approve the quoted repair",
          `The accepted repair records the ${warranty ?? "repair-specific warranty"}`,
        ];

  return (
    <div className="flex flex-col gap-5 py-12" aria-live="polite">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/15">
        <Check className="h-5 w-5 text-green-500" />
      </div>
      <div>
        <h2 className="mb-2 text-2xl font-semibold">
          Repair request received.
        </h2>
        <p className="text-[15px] text-muted-foreground">{responseMessage}</p>
      </div>
      <div className="space-y-3 rounded-md border border-border bg-card p-6">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          What happens next
        </p>
        {steps.map((step, index) => (
          <div key={step} className="flex gap-3">
            <span className="mt-0.5 shrink-0 text-[12px] font-semibold text-primary">
              {index + 1}.
            </span>
            <p className="text-[13px] text-muted-foreground">{step}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        <Button asChild className="h-11 rounded-md px-6 text-[13px] sm:h-10">
          <Link href="/">Back to home</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="h-11 rounded-md border-border px-6 text-[13px] sm:h-10"
        >
          <a href={BUSINESS.phoneHref}>Call {BUSINESS.phoneDisplay}</a>
        </Button>
      </div>
    </div>
  );
}

export function QuoteSummary({
  model,
  repair,
  quote,
  icon,
}: {
  model: DeviceModel;
  repair: string;
  quote: RepairPrice;
  icon: DeviceType;
}) {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-surface">
      <div className="flex items-center justify-between gap-4 px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="shrink-0 opacity-90">
            <DeviceIcon device={icon} size={44} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Your estimate
            </p>
            <p className="truncate text-[14px] font-semibold">{model.name}</p>
            <p className="text-[12px] text-muted-foreground">{repair}</p>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xl font-semibold">
            {quote.inspectionRequired
              ? "Assessment required"
              : quote.minPrice === quote.maxPrice
                ? `£${quote.minPrice}`
                : `£${quote.minPrice}–£${quote.maxPrice}`}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            estimate, not final quote
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 divide-x divide-border border-t border-border text-[12px]">
        <div className="flex items-center justify-center gap-1.5 px-3 py-2">
          <Clock className="h-3 w-3 shrink-0 text-muted-foreground" />
          <span className="font-medium">{quote.estimatedTime}</span>
        </div>
        <div className="flex items-center justify-center gap-1.5 px-3 py-2">
          <Shield className="h-3 w-3 shrink-0 text-muted-foreground" />
          <span className="font-medium">{quote.warranty}</span>
        </div>
      </div>
    </div>
  );
}

export function CustomerDetailsStep({
  name,
  email,
  phone,
  errors,
  onName,
  onEmail,
  onPhone,
}: {
  name: string;
  email: string;
  phone: string;
  errors: FormErrors;
  onName: (value: string) => void;
  onEmail: (value: string) => void;
  onPhone: (value: string) => void;
}) {
  return (
    <section aria-labelledby="details-heading">
      <StepHeading id="details-heading" number={5}>
        Your details
      </StepHeading>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" id="name" required error={errors.name}>
          <Input
            id="name"
            name="name"
            value={name}
            onChange={(event) => onName(event.target.value)}
            maxLength={100}
            autoComplete="name"
            className="h-11 rounded-md border-border bg-card text-[13px] sm:h-10"
          />
        </Field>
        <Field label="Email" id="email" required error={errors.email}>
          <Input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => onEmail(event.target.value)}
            maxLength={254}
            autoComplete="email"
            className="h-11 rounded-md border-border bg-card text-[13px] sm:h-10"
          />
        </Field>
        <Field label="Phone number" id="phone" required error={errors.phone}>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={phone}
            onChange={(event) => onPhone(event.target.value)}
            maxLength={25}
            autoComplete="tel"
            className="h-11 rounded-md border-border bg-card text-[13px] sm:h-10"
          />
        </Field>
      </div>
    </section>
  );
}

export function ServiceMethodStep({
  value,
  returnAddress,
  errors,
  onChange,
  onReturnAddress,
}: {
  value: ServiceMethod;
  returnAddress: string;
  errors: FormErrors;
  onChange: (value: ServiceMethod) => void;
  onReturnAddress: (value: string) => void;
}) {
  const methods = [
    {
      value: "drop-off" as const,
      title: "Visit / drop-off",
      body: "Request a preferred date and time in Leeds.",
      icon: Store,
    },
    ...(FEATURES.mailInEnabled
      ? [
          {
            value: "mail-in" as const,
            title: "Mail-in repair",
            body: "Request shipping instructions before posting.",
            icon: Package,
          },
        ]
      : []),
  ];

  return (
    <section aria-labelledby="service-method-heading">
      <StepHeading id="service-method-heading" number={3}>
        Service method
      </StepHeading>
      <div className="grid gap-2 sm:grid-cols-2">
        {methods.map(({ value: method, title, body, icon: Icon }) => (
          <button
            key={method}
            type="button"
            onClick={() => onChange(method)}
            aria-pressed={value === method}
            className={`min-h-24 rounded-md border p-4 text-left transition-colors hover:bg-surface ${
              value === method
                ? "border-foreground bg-surface"
                : "border-border bg-card"
            }`}
          >
            <span className="flex items-center gap-2 text-[13px] font-semibold">
              <Icon className="h-4 w-4 text-muted-foreground" />
              {title}
            </span>
            <span className="mt-2 block text-[12px] leading-5 text-muted-foreground">
              {body}
            </span>
          </button>
        ))}
      </div>
      {value === "mail-in" && (
        <div className="mt-4">
          <Field
            label="Return address"
            id="returnAddress"
            required
            error={errors.returnAddress}
          >
            <Textarea
              id="returnAddress"
              name="returnAddress"
              value={returnAddress}
              onChange={(event) => onReturnAddress(event.target.value)}
              maxLength={500}
              rows={3}
              className="resize-none rounded-md border-border bg-card text-[13px]"
            />
          </Field>
        </div>
      )}
    </section>
  );
}

export function DeviceSelectionStep({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby="device-heading">
      <StepHeading id="device-heading" number={1}>
        Your device
      </StepHeading>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function RepairSelectionStep({
  tiers,
  partTierId,
  issue,
  error,
  onTier,
  onIssue,
}: {
  tiers: RepairCatalogueEntry[];
  partTierId: string;
  issue: string;
  error?: string;
  onTier: (value: string) => void;
  onIssue: (value: string) => void;
}) {
  return (
    <section aria-labelledby="repair-options-heading">
      <StepHeading id="repair-options-heading" number={2}>
        Repair details
      </StepHeading>
      <PartTierStep
        tiers={tiers}
        partTierId={partTierId}
        error={error}
        onChange={onTier}
      />
      <div className="mt-4 space-y-1.5">
        <label
          htmlFor="issue"
          className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground"
        >
          Issue description{" "}
          <span className="font-normal normal-case">(optional)</span>
        </label>
        <Textarea
          id="issue"
          name="issue"
          value={issue}
          onChange={(event) => onIssue(event.target.value)}
          maxLength={2000}
          rows={3}
          className="resize-none rounded-md border-border bg-card text-[13px]"
        />
      </div>
    </section>
  );
}

export function PartTierStep({
  tiers,
  partTierId,
  error,
  onChange,
}: {
  tiers: RepairCatalogueEntry[];
  partTierId: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  if (tiers.length <= 1) return null;

  return (
    <fieldset aria-describedby={error ? "partTier-error" : undefined}>
      <legend className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        Part option <span className="text-destructive">*</span>
      </legend>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {tiers.map((tier) => (
          <button
            key={tier.id}
            type="button"
            onClick={() => onChange(tier.partTierId)}
            aria-pressed={partTierId === tier.partTierId}
            className={`min-h-28 rounded-md border p-4 text-left transition-colors ${
              partTierId === tier.partTierId
                ? "border-foreground bg-surface"
                : "border-border bg-card hover:bg-surface"
            }`}
          >
            <span className="block text-[13px] font-semibold">
              {tier.partTier}
            </span>
            <span className="mt-1 block text-[11px] capitalize text-muted-foreground">
              {tier.partOrigin.replaceAll("-", " ")}
            </span>
            <span className="mt-3 block text-[12px] font-medium">
              {tier.minPrice === null || tier.maxPrice === null
                ? "Assessment required"
                : tier.minPrice === tier.maxPrice
                  ? `£${tier.minPrice}`
                  : `£${tier.minPrice}–£${tier.maxPrice}`}
              {" · "}
              {tier.warranty}
            </span>
            {tier.customerNote && (
              <span className="mt-2 block text-[11px] leading-5 text-muted-foreground">
                {tier.customerNote}
              </span>
            )}
          </button>
        ))}
      </div>
      {error && (
        <p
          id="partTier-error"
          role="alert"
          className="mt-2 flex items-center gap-1 text-[12px] text-destructive"
        >
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </fieldset>
  );
}

export function AppointmentRequestStep({
  serviceMethod,
  date,
  time,
  today,
  errors,
  onDate,
  onTime,
}: {
  serviceMethod: ServiceMethod;
  date: string;
  time: string;
  today: string;
  errors: FormErrors;
  onDate: (value: string) => void;
  onTime: (value: string) => void;
}) {
  const slots = slotsForDate(date);
  return (
    <section aria-labelledby="schedule-heading">
      <StepHeading id="schedule-heading" number={4}>
        {serviceMethod === "mail-in"
          ? "Expected send date"
          : "Preferred date and time"}
      </StepHeading>
      <Field label="Date" id="date" required error={errors.date}>
        <Input
          id="date"
          name="date"
          type="date"
          value={date}
          min={today}
          onChange={(event) => onDate(event.target.value)}
          className="h-11 max-w-xs rounded-md border-border bg-card text-[13px] sm:h-10"
        />
      </Field>
      <fieldset className="mt-5">
        <legend className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          {serviceMethod === "mail-in" ? "Best contact time" : "Preferred time"}{" "}
          <span className="text-destructive">*</span>
        </legend>
        {errors.time && (
          <p
            id="time-error"
            role="alert"
            className="mt-2 text-[12px] text-destructive"
          >
            {errors.time}
          </p>
        )}
        {slots.length === 0 && date && (
          <p className="mt-2 text-[12px] text-muted-foreground">
            Sunday requests are unavailable.
          </p>
        )}
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
          {slots.map((slot) => (
            <button
              key={slot}
              type="button"
              onClick={() => onTime(slot)}
              aria-pressed={time === slot}
              className={`min-h-11 w-full rounded-md border px-2 text-[12px] font-medium ${
                time === slot
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:bg-surface"
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      </fieldset>
    </section>
  );
}

function StepHeading({
  id,
  number,
  children,
}: {
  id: string;
  number: number;
  children: React.ReactNode;
}) {
  return (
    <h2
      id={id}
      className="mb-5 flex items-center gap-2 text-[13px] font-semibold"
    >
      <span className="flex h-5 w-5 items-center justify-center rounded-full border border-border text-[11px]">
        {number}
      </span>
      {children}
    </h2>
  );
}

export function Field({
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
          <AlertCircle className="h-3 w-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
