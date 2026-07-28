"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ALL_DEVICES,
  buildBookingHref,
  deviceCategory,
  getRepairQuote,
  repairTypeToSlug,
  type DeviceModel,
  type RepairPrice,
  type RepairType,
} from "@/lib/calculatorData";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Gamepad2,
  HardDrive,
  Laptop,
  Mail,
  MapPin,
  MonitorCog,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  Tablet,
  Wrench,
  type LucideIcon,
} from "lucide-react";

type CategoryId = "phone" | "tablet" | "laptop" | "console" | "desktop" | "data" | "other";

type Category = {
  id: CategoryId;
  label: string;
  detail: string;
  icon: LucideIcon;
};

type DeviceChoice = {
  id: string;
  label: string;
  detail?: string;
  brand?: "Apple" | "Samsung" | "Google Pixel";
  catalogCategory?: "phone" | "tablet" | "laptop";
  presets?: string[];
  freeText?: boolean;
};

const CATEGORIES: Category[] = [
  { id: "phone", label: "Phone", detail: "iPhone, Galaxy, Pixel & Android", icon: Smartphone },
  { id: "tablet", label: "Tablet", detail: "iPad, Galaxy Tab & Android", icon: Tablet },
  { id: "laptop", label: "Laptop", detail: "MacBook, Windows & gaming", icon: Laptop },
  { id: "console", label: "Game console", detail: "PlayStation, Xbox, Switch & more", icon: Gamepad2 },
  { id: "desktop", label: "Custom PC", detail: "Builds, repairs & upgrades", icon: MonitorCog },
  { id: "data", label: "Data recovery", detail: "Drives, SSDs, phones & computers", icon: HardDrive },
  { id: "other", label: "Other device", detail: "Tell us what you need repaired", icon: Wrench },
];

const DEVICE_CHOICES: Record<CategoryId, DeviceChoice[]> = {
  phone: [
    { id: "apple-phone", label: "iPhone", detail: "iPhone 6 through 17 Pro Max", brand: "Apple", catalogCategory: "phone" },
    { id: "samsung-phone", label: "Samsung Galaxy", detail: "S, A, Fold & Flip series", brand: "Samsung", catalogCategory: "phone" },
    { id: "pixel-phone", label: "Google Pixel", detail: "Pixel, Pro, Fold & a-series", brand: "Google Pixel", catalogCategory: "phone" },
    { id: "android-phone", label: "Other Android", detail: "OnePlus, Xiaomi, Sony, Huawei & more", freeText: true },
  ],
  tablet: [
    { id: "apple-tablet", label: "iPad", detail: "Pro, Air, mini & standard", brand: "Apple", catalogCategory: "tablet" },
    { id: "samsung-tablet", label: "Samsung Galaxy Tab", detail: "Tab S and Tab A series", brand: "Samsung", catalogCategory: "tablet" },
    { id: "android-tablet", label: "Other tablet", detail: "Lenovo, Huawei, Amazon & more", freeText: true },
  ],
  laptop: [
    { id: "apple-laptop", label: "MacBook", detail: "Air & Pro, all years", brand: "Apple", catalogCategory: "laptop" },
    { id: "samsung-laptop", label: "Samsung Galaxy Book", detail: "Galaxy Book series", brand: "Samsung", catalogCategory: "laptop" },
    { id: "windows-laptop", label: "Windows / gaming laptop", detail: "Dell, HP, Lenovo, ASUS, Acer & more", freeText: true },
    { id: "other-laptop", label: "Other laptop", detail: "Any make or model", freeText: true },
  ],
  console: [
    { id: "playstation", label: "PlayStation", detail: "PS5, PS4 & earlier", presets: ["PlayStation 5", "PlayStation 5 Slim", "PlayStation 4", "PlayStation 4 Pro"] },
    { id: "xbox", label: "Xbox", detail: "Series X/S & Xbox One", presets: ["Xbox Series X", "Xbox Series S", "Xbox One X", "Xbox One S"] },
    { id: "switch", label: "Nintendo Switch", detail: "Switch, OLED & Lite", presets: ["Nintendo Switch", "Nintendo Switch OLED", "Nintendo Switch Lite"] },
    { id: "handheld", label: "Other console / handheld", detail: "Steam Deck and other systems", freeText: true },
  ],
  desktop: [
    { id: "gaming-pc", label: "Gaming PC", detail: "Repairs, rebuilds & upgrades", presets: ["Custom gaming PC"] },
    { id: "new-build", label: "New custom build", detail: "A complete PC built to your needs", presets: ["New custom PC build"] },
    { id: "workstation", label: "Workstation PC", detail: "High-performance professional systems", presets: ["Workstation PC"] },
    { id: "home-pc", label: "Home / office PC", detail: "Branded and custom desktops", freeText: true },
  ],
  data: [
    { id: "drive", label: "Hard drive / SSD", detail: "Internal and external storage", presets: ["Hard drive / SSD"] },
    { id: "phone-data", label: "Phone / tablet", detail: "Including liquid-damaged devices", freeText: true },
    { id: "computer-data", label: "Laptop / desktop", detail: "Mac, Windows and custom PCs", freeText: true },
    { id: "removable-data", label: "USB / memory card", detail: "Flash drives and camera cards", presets: ["USB drive / memory card"] },
  ],
  other: [
    { id: "other-device", label: "Describe your device", detail: "Any make, model or type", freeText: true },
  ],
};

const REPAIRS: Record<CategoryId, RepairType[]> = {
  phone: [
    "Screen replacement", "Battery replacement", "Back glass", "Charging port",
    "Camera repair", "Speaker / microphone", "Face ID / biometric repair",
    "Liquid damage repair", "Motherboard / logic board", "No power repair",
    "Data recovery", "Software / OS issue", "Other repair",
  ],
  tablet: [
    "Screen replacement", "Battery replacement", "Charging port", "Camera repair",
    "Speaker / microphone", "Liquid damage repair", "Motherboard / logic board",
    "No power repair", "Data recovery", "Software / OS issue", "Other repair",
  ],
  laptop: [
    "Screen replacement", "Battery replacement", "Keyboard / trackpad repair",
    "Charging port", "SSD / RAM upgrade", "Overheating / fan service",
    "Liquid damage repair", "Motherboard / logic board", "No power repair",
    "Data recovery", "Software / OS issue", "Hardware diagnostics", "Other repair",
  ],
  console: [
    "HDMI port repair", "Charging port", "No power repair", "Motherboard / logic board",
    "Overheating / fan service", "Liquid damage repair", "Software / OS issue",
    "Hardware diagnostics", "Other repair",
  ],
  desktop: [
    "Custom PC build", "GPU / cooling upgrade", "SSD / RAM upgrade", "No power repair",
    "Motherboard / logic board", "Overheating / fan service", "Software / OS issue",
    "Data recovery", "Hardware diagnostics", "Other repair",
  ],
  data: ["Data recovery", "Liquid damage repair", "Hardware diagnostics"],
  other: ["Hardware diagnostics", "Liquid damage repair", "Data recovery", "Other repair"],
};

const GENERIC_PRICES: Partial<Record<RepairType, Record<CategoryId, [number, number, string, string]>>> = {
  "Liquid damage repair": {
    phone: [79, 249, "1-5 days", "3 months"],
    tablet: [89, 279, "1-5 days", "3 months"],
    laptop: [129, 399, "2-7 days", "3 months"],
    console: [79, 249, "1-5 days", "3 months"],
    desktop: [99, 399, "2-7 days", "3 months"],
    data: [79, 399, "2-10 days", "After assessment"],
    other: [79, 399, "After assessment", "After assessment"],
  },
  "Data recovery": {
    phone: [79, 299, "2-7 days", "N/A"],
    tablet: [99, 299, "2-7 days", "N/A"],
    laptop: [99, 499, "3-10 days", "N/A"],
    console: [99, 399, "3-10 days", "N/A"],
    desktop: [99, 499, "3-10 days", "N/A"],
    data: [79, 499, "2-10 days", "N/A"],
    other: [79, 499, "After assessment", "N/A"],
  },
  "Motherboard / logic board": {
    phone: [79, 249, "1-5 days", "3 months"],
    tablet: [99, 299, "1-5 days", "3 months"],
    laptop: [129, 399, "2-7 days", "3 months"],
    console: [89, 299, "1-5 days", "3 months"],
    desktop: [99, 399, "2-7 days", "3 months"],
    data: [99, 399, "After assessment", "3 months"],
    other: [99, 399, "After assessment", "3 months"],
  },
};

const CATEGORY_DEFAULTS: Record<CategoryId, [number, number, string, string]> = {
  phone: [39, 249, "45 min-5 days", "Up to 12 months"],
  tablet: [59, 299, "1-5 days", "Up to 12 months"],
  laptop: [49, 449, "Same day-7 days", "Up to 12 months"],
  console: [39, 299, "Same day-5 days", "Up to 6 months"],
  desktop: [39, 399, "Same day-7 days", "Up to 12 months"],
  data: [79, 499, "2-10 days", "N/A"],
  other: [29, 399, "After assessment", "Repair dependent"],
};

function genericQuote(category: CategoryId, repair: RepairType): RepairPrice {
  const [minPrice, maxPrice, estimatedTime, warranty] =
    GENERIC_PRICES[repair]?.[category] ?? CATEGORY_DEFAULTS[category];
  return { minPrice, maxPrice, estimatedTime, warranty, inspectionRequired: true };
}

function ChoiceButton({
  active,
  title,
  detail,
  icon: Icon,
  onClick,
}: {
  active: boolean;
  title: string;
  detail?: string;
  icon?: LucideIcon;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-20 items-center gap-3 border p-4 text-left transition-colors hover:bg-surface"
      style={{
        background: active ? "var(--selection-bg)" : "var(--card)",
        borderColor: active ? "var(--control-border-hover)" : "var(--border)",
      }}
    >
      {Icon && <Icon className="h-5 w-5 shrink-0 text-[color:var(--icon-fg)]" />}
      <span className="min-w-0">
        <span className="block text-[14px] font-semibold text-foreground">{title}</span>
        {detail && <span className="mt-0.5 block text-[12px] leading-snug text-muted-foreground">{detail}</span>}
      </span>
      {active && <Check className="ml-auto h-4 w-4 shrink-0 text-[color:var(--accent)]" />}
    </button>
  );
}

export default function FullCalculator() {
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [deviceChoice, setDeviceChoice] = useState<DeviceChoice | null>(null);
  const [model, setModel] = useState<DeviceModel | null>(null);
  const [deviceName, setDeviceName] = useState("");
  const [deviceNameDraft, setDeviceNameDraft] = useState("");
  const [repair, setRepair] = useState<RepairType | null>(null);

  const models = useMemo(() => {
    if (!deviceChoice?.brand || !deviceChoice.catalogCategory) return [];
    return ALL_DEVICES.filter(
      (device) =>
        device.brand === deviceChoice.brand &&
        deviceCategory(device) === deviceChoice.catalogCategory
    );
  }, [deviceChoice]);

  const resolvedDeviceName = model?.name || deviceName.trim();
  const quote = category && repair
    ? model
      ? getRepairQuote(model, repair)
      : genericQuote(category, repair)
    : null;

  const isReady = Boolean(category && deviceChoice && resolvedDeviceName && repair && quote);

  function resetAfterCategory(next: CategoryId) {
    setCategory(next);
    setDeviceChoice(null);
    setModel(null);
    setDeviceName("");
    setDeviceNameDraft("");
    setRepair(null);
  }

  function pickDevice(choice: DeviceChoice) {
    setDeviceChoice(choice);
    setModel(null);
    setDeviceName(choice.presets?.length === 1 ? choice.presets[0] : "");
    setDeviceNameDraft("");
    setRepair(null);
  }

  function reset() {
    setCategory(null);
    setDeviceChoice(null);
    setModel(null);
    setDeviceName("");
    setDeviceNameDraft("");
    setRepair(null);
  }

  const bookingBase = (() => {
    if (!isReady || !category || !repair || !quote) return "/book";
    if (model) return buildBookingHref(model, repair);
    const params = new URLSearchParams({
      device: ["console", "desktop"].includes(category) ? category : "other",
      deviceName: resolvedDeviceName,
      repair: repairTypeToSlug(repair),
      issue: category === "data" ? "Data recovery assessment requested" : "",
    });
    return `/book?${params.toString()}`;
  })();

  const mailInUrl = `${bookingBase}${bookingBase.includes("?") ? "&" : "?"}method=mail-in`;

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="grid lg:grid-cols-[1fr_320px]">
        <div className="p-5 sm:p-7 lg:p-8">
          <div className="mb-7 flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {category ? "Build your quote" : "Start here"}
              </p>
              <h2 className="mt-1 text-xl font-semibold">
                {!category
                  ? "What needs repairing?"
                  : !deviceChoice
                    ? `Which ${CATEGORIES.find((item) => item.id === category)?.label.toLowerCase()}?`
                    : !resolvedDeviceName
                      ? "Choose or enter the model"
                      : !repair
                        ? "What is the fault?"
                        : "Your estimate is ready"}
              </h2>
            </div>
            {category && (
              <button
                type="button"
                onClick={reset}
                className="flex shrink-0 items-center gap-1.5 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Start over
              </button>
            )}
          </div>

          {!category && (
            <div className="grid overflow-hidden rounded-lg border border-border sm:grid-cols-2">
              {CATEGORIES.map((item) => (
                <ChoiceButton
                  key={item.id}
                  active={false}
                  title={item.label}
                  detail={item.detail}
                  icon={item.icon}
                  onClick={() => resetAfterCategory(item.id)}
                />
              ))}
            </div>
          )}

          {category && !deviceChoice && (
            <>
              <button
                type="button"
                onClick={reset}
                className="mb-4 flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Device categories
              </button>
              <div className="grid overflow-hidden rounded-lg border border-border sm:grid-cols-2">
                {DEVICE_CHOICES[category].map((choice) => (
                  <ChoiceButton
                    key={choice.id}
                    active={false}
                    title={choice.label}
                    detail={choice.detail}
                    onClick={() => pickDevice(choice)}
                  />
                ))}
              </div>
            </>
          )}

          {category && deviceChoice && !resolvedDeviceName && (
            <div>
              <button
                type="button"
                onClick={() => setDeviceChoice(null)}
                className="mb-4 flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Device type
              </button>

              {models.length > 0 && (
                <div className="max-h-[420px] overflow-y-auto rounded-lg border border-border">
                  {models.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setModel(item)}
                      className="flex w-full items-center justify-between border-b border-border px-4 py-3 text-left text-[13px] font-medium last:border-b-0 hover:bg-surface"
                    >
                      {item.name}
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              )}

              {deviceChoice.presets && deviceChoice.presets.length > 1 && (
                <div className="grid overflow-hidden rounded-lg border border-border sm:grid-cols-2">
                  {deviceChoice.presets.map((preset) => (
                    <ChoiceButton
                      key={preset}
                      active={false}
                      title={preset}
                      onClick={() => setDeviceName(preset)}
                    />
                  ))}
                </div>
              )}

              {deviceChoice.freeText && (
                <div className="rounded-lg border border-border bg-surface p-4">
                  <label htmlFor="quote-device-model" className="mb-2 block text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Make and model
                  </label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Input
                      id="quote-device-model"
                      value={deviceNameDraft}
                      onChange={(event) => setDeviceNameDraft(event.target.value)}
                      placeholder="e.g. ASUS ROG Zephyrus G16"
                      className="h-11 rounded-md border-border bg-card text-[13px]"
                    />
                    <Button
                      type="button"
                      disabled={!deviceNameDraft.trim()}
                      onClick={() => setDeviceName(deviceNameDraft.trim())}
                      className="btn-primary h-11 rounded-md px-5"
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {category && deviceChoice && resolvedDeviceName && !repair && (
            <div>
              <button
                type="button"
                onClick={() => {
                  setModel(null);
                  setDeviceName("");
                  setDeviceNameDraft("");
                }}
                className="mb-4 flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Change model
              </button>
              <p className="mb-3 text-[13px] text-muted-foreground">{resolvedDeviceName}</p>
              <div className="grid overflow-hidden rounded-lg border border-border sm:grid-cols-2">
                {REPAIRS[category].map((item) => (
                  <ChoiceButton
                    key={item}
                    active={false}
                    title={item}
                    onClick={() => setRepair(item)}
                  />
                ))}
              </div>
            </div>
          )}

          {isReady && quote && category && repair && (
            <div>
              <button
                type="button"
                onClick={() => setRepair(null)}
                className="mb-5 flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Change repair
              </button>

              <div className="rounded-lg border border-border bg-surface p-5 sm:p-6">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Estimated price</p>
                <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-3xl font-semibold tracking-tight">
                      {quote.inspectionRequired
                        ? quote.minPrice > 0
                          ? `£${quote.minPrice}-£${quote.maxPrice}`
                          : "Quote required"
                        : quote.minPrice === quote.maxPrice
                          ? `£${quote.minPrice}`
                          : `£${quote.minPrice}-£${quote.maxPrice}`}
                    </p>
                    <p className="mt-1 text-[13px] text-muted-foreground">{resolvedDeviceName} · {repair}</p>
                  </div>
                  <span className="rounded-md border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                    Confirmed after assessment
                  </span>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 overflow-hidden rounded-lg border border-border">
                <div className="bg-card p-4">
                  <Clock className="mb-2 h-4 w-4 text-[color:var(--icon-fg)]" />
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Typical time</p>
                  <p className="mt-1 text-[13px] font-semibold">{quote.estimatedTime}</p>
                </div>
                <div className="border-l border-border bg-card p-4">
                  <ShieldCheck className="mb-2 h-4 w-4 text-[color:var(--accent)]" />
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Warranty</p>
                  <p className="mt-1 text-[13px] font-semibold">{quote.warranty}</p>
                </div>
              </div>

              <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
                This is an estimate, not a final price. We confirm the fault, parts and fixed price before work starts.
                Warranty applies to eligible repairs where a fault is caused by our installation or a part we supplied.
              </p>
            </div>
          )}
        </div>

        <aside className="border-t border-border bg-surface p-5 sm:p-7 lg:border-l lg:border-t-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Your selection</p>
          <div className="mt-5 space-y-4">
            {[
              ["Device", category ? CATEGORIES.find((item) => item.id === category)?.label : "Not selected"],
              ["Type", deviceChoice?.label ?? "Not selected"],
              ["Model", resolvedDeviceName || "Not selected"],
              ["Repair", repair ?? "Not selected"],
            ].map(([label, value]) => (
              <div key={label} className="border-b border-border pb-3 last:border-0">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
                <p className="mt-1 text-[13px] font-medium text-foreground">{value}</p>
              </div>
            ))}
          </div>

          {isReady ? (
            <div className="mt-7 space-y-2.5">
              <Button asChild className="btn-primary h-11 w-full rounded-md">
                <Link href={bookingBase} className="flex items-center justify-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Book in Leeds
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-11 w-full rounded-md border-border bg-card">
                <Link href={mailInUrl} className="flex items-center justify-center gap-2">
                  <Mail className="h-4 w-4" />
                  Book a mail-in repair
                </Link>
              </Button>
            </div>
          ) : (
            <p className="mt-7 text-[12px] leading-relaxed text-muted-foreground">
              Complete the choices to see an estimated range and book the next step.
            </p>
          )}

          <div className="mt-7 border-t border-border pt-5">
            <p className="text-[12px] font-medium text-foreground">Can&apos;t find your device?</p>
            <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
              We repair far more than the models listed here.
            </p>
            <Link href="/contact" className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-foreground hover:underline">
              Ask for a manual quote
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
