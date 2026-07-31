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
  getRepairTiers,
  getSupportedRepairTypes,
  repairTypeToSlug,
  type DeviceModel,
  type RepairPrice,
  type RepairType,
} from "@/lib/calculatorData";
import {
  getSpecialistEntry,
  type CatalogueCategory,
} from "@/lib/repairCatalogue";
import { FEATURES } from "@/lib/constants";
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
  Waves,
  type LucideIcon,
} from "lucide-react";

type CategoryId =
  | "phone"
  | "tablet"
  | "laptop"
  | "console"
  | "desktop"
  | "data"
  | "liquid";

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
  specialistCategory?: CatalogueCategory;
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
  { id: "liquid", label: "Liquid damage", detail: "Phones, tablets, laptops, consoles & PCs", icon: Waves },
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
    { id: "phone-data", label: "Phone / tablet", detail: "Phones and tablets", freeText: true },
    { id: "computer-data", label: "Laptop / desktop", detail: "Mac, Windows and custom PCs", freeText: true },
    { id: "removable-data", label: "USB / memory card", detail: "Flash drives and camera cards", presets: ["USB drive / memory card"] },
  ],
  liquid: [
    { id: "liquid-phone", label: "Phone", detail: "iPhone, Galaxy, Pixel and more", freeText: true, specialistCategory: "phone" },
    { id: "liquid-tablet", label: "Tablet", detail: "iPad, Galaxy Tab and Android", freeText: true, specialistCategory: "tablet" },
    { id: "liquid-laptop", label: "Laptop", detail: "MacBook, Windows and gaming", freeText: true, specialistCategory: "laptop" },
    { id: "liquid-console", label: "Game console", detail: "PlayStation, Xbox, Switch and more", freeText: true, specialistCategory: "console" },
    { id: "liquid-desktop", label: "Desktop / custom PC", detail: "Gaming, workstation and office PCs", freeText: true, specialistCategory: "desktop" },
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
    "Liquid damage repair", "Data recovery", "Hardware diagnostics", "Other repair",
  ],
  data: ["Data recovery"],
  liquid: ["Liquid damage repair"],
};

function catalogueCategory(
  category: CategoryId,
  choice?: DeviceChoice | null
): CatalogueCategory {
  if (category === "data") return "data-recovery";
  if (category === "liquid") return choice?.specialistCategory ?? "phone";
  return category;
}

function genericQuote(
  category: CategoryId,
  repair: RepairType,
  choice?: DeviceChoice | null
): RepairPrice | null {
  const entry = getSpecialistEntry(
    catalogueCategory(category, choice),
    repairTypeToSlug(repair)
  );
  if (!entry) return null;

  return {
    minPrice: entry.minPrice ?? 0,
    maxPrice: entry.maxPrice ?? 0,
    estimatedTime: entry.estimatedTime,
    warranty: entry.warranty,
    inspectionRequired: entry.inspectionRequired,
    catalogueId: entry.id,
    partTierId: entry.partTierId,
    partTier: entry.partTier,
    partOrigin: entry.partOrigin,
    supported: true,
  };
}

function ChoiceButton({
  active,
  title,
  detail,
  icon: Icon,
  onClick,
  className,
}: {
  active: boolean;
  title: string;
  detail?: string;
  icon?: LucideIcon;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-20 items-center gap-3 border p-4 text-left transition-colors hover:bg-surface ${className ?? ""}`}
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
  const [partTierId, setPartTierId] = useState("");

  const models = useMemo(() => {
    if (!deviceChoice?.brand || !deviceChoice.catalogCategory) return [];
    return ALL_DEVICES.filter(
      (device) =>
        device.brand === deviceChoice.brand &&
        deviceCategory(device) === deviceChoice.catalogCategory
    );
  }, [deviceChoice]);

  const resolvedDeviceName = model?.name || deviceName.trim();
  const repairTiers =
    model && repair ? getRepairTiers(model, repair) : [];
  const needsTierSelection =
    repairTiers.length > 1 && !partTierId;
  const quote = category && repair
    ? model
      ? needsTierSelection
        ? null
        : getRepairQuote(
            model,
            repair,
            repairTiers.length === 1
              ? repairTiers[0].partTierId
              : partTierId
          )
      : genericQuote(category, repair, deviceChoice)
    : null;
  const availableRepairs = model
    ? getSupportedRepairTypes(model)
    : category
      ? REPAIRS[category].filter((item) =>
          getSpecialistEntry(
            catalogueCategory(category, deviceChoice),
            repairTypeToSlug(item)
          )
        )
      : [];

  const isReady = Boolean(category && deviceChoice && resolvedDeviceName && repair && quote);

  function resetAfterCategory(next: CategoryId) {
    setCategory(next);
    setDeviceChoice(null);
    setModel(null);
    setDeviceName("");
    setDeviceNameDraft("");
    setRepair(null);
    setPartTierId("");
  }

  function pickDevice(choice: DeviceChoice) {
    setDeviceChoice(choice);
    setModel(null);
    setDeviceName(choice.presets?.length === 1 ? choice.presets[0] : "");
    setDeviceNameDraft("");
    setRepair(null);
    setPartTierId("");
  }

  function reset() {
    setCategory(null);
    setDeviceChoice(null);
    setModel(null);
    setDeviceName("");
    setDeviceNameDraft("");
    setRepair(null);
    setPartTierId("");
  }

  const bookingBase = (() => {
    if (!isReady || !category || !repair || !quote) return "/book";
    if (model) {
      return buildBookingHref(
        model,
        repair,
        quote.partTierId
      );
    }
    if (!["console", "desktop"].includes(category)) return "/contact";
    const params = new URLSearchParams({
      device: category,
      deviceName: resolvedDeviceName,
      repair: repairTypeToSlug(repair),
      issue: category === "data" ? "Data recovery assessment requested" : "",
    });
    return `/book?${params.toString()}`;
  })();

  const mailInUrl = `${bookingBase}${bookingBase.includes("?") ? "&" : "?"}method=mail-in`;
  const canRequestOnline =
    FEATURES.bookingEnabled &&
    (Boolean(model) || category === "console" || category === "desktop");
  const completedSteps = [
    Boolean(category),
    Boolean(deviceChoice),
    Boolean(resolvedDeviceName),
    Boolean(repair),
  ].filter(Boolean).length;
  const quoteDisplay = quote
    ? quote.inspectionRequired
      ? quote.minPrice > 0
        ? `£${quote.minPrice}–£${quote.maxPrice}`
        : "Quote required"
      : quote.minPrice === quote.maxPrice
        ? `£${quote.minPrice}`
        : `£${quote.minPrice}–£${quote.maxPrice}`
    : null;

  return (
    <div className="panel overflow-hidden">
      <div className="grid lg:grid-cols-[minmax(0,1.62fr)_minmax(320px,1fr)]">
        <div className="bg-card p-5 sm:p-7 lg:p-8">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">
                Step {Math.min(completedSteps + 1, 4)} of 4
              </p>
              <h2 className="mt-2 text-xl font-semibold">
                {!category
                  ? "What needs repairing?"
                  : !deviceChoice
                    ? category === "data"
                      ? "Where is the data stored?"
                      : category === "liquid"
                        ? "Which device is liquid-damaged?"
                        : `Which ${CATEGORIES.find((item) => item.id === category)?.label.toLowerCase()}?`
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
          <div
            className="mb-7 grid grid-cols-4 gap-1.5"
            aria-label={`${completedSteps} of 4 quote steps completed`}
            aria-valuemax={4}
            aria-valuemin={0}
            aria-valuenow={completedSteps}
            role="progressbar"
          >
            {[1, 2, 3, 4].map((step) => (
              <span
                key={step}
                className={`h-1 rounded-full ${
                  step <= completedSteps
                    ? "bg-foreground"
                    : "bg-foreground/10"
                }`}
              />
            ))}
          </div>

          {!category && (
            <div className="grid overflow-hidden rounded-lg border border-border sm:grid-cols-2">
              {CATEGORIES.map((item, index) => (
                <ChoiceButton
                  key={item.id}
                  active={false}
                  title={item.label}
                  detail={item.detail}
                  icon={item.icon}
                  className={index === CATEGORIES.length - 1 ? "sm:col-span-2" : undefined}
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
                {DEVICE_CHOICES[category].map((choice, index) => (
                  <ChoiceButton
                    key={choice.id}
                    active={false}
                    title={choice.label}
                    detail={choice.detail}
                    className={
                      DEVICE_CHOICES[category].length % 2 === 1 &&
                      index === DEVICE_CHOICES[category].length - 1
                        ? "sm:col-span-2"
                        : undefined
                    }
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
                {availableRepairs.map((item) => (
                  <ChoiceButton
                    key={item}
                    active={false}
                    title={item}
                    onClick={() => {
                      setRepair(item);
                      setPartTierId("");
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {category &&
            model &&
            repair &&
            repairTiers.length > 1 &&
            needsTierSelection && (
              <div>
                <button
                  type="button"
                  onClick={() => setRepair(null)}
                  className="mb-5 flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Change repair
                </button>
                <p className="mb-3 text-[13px] text-muted-foreground">
                  Choose a part option. Each option has its own price and
                  warranty.
                </p>
                <div className="grid overflow-hidden rounded-lg border border-border sm:grid-cols-2">
                  {repairTiers.map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setPartTierId(tier.partTierId)}
                      className="min-h-28 border-b border-border p-4 text-left transition-colors last:border-b-0 hover:bg-surface sm:border-r"
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
                    </button>
                  ))}
                </div>
              </div>
            )}

          {isReady && quote && category && repair && (
            <div className="border-t border-border pt-6">
              <button
                type="button"
                onClick={() => setRepair(null)}
                className="mb-4 flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Change repair
              </button>
              <p className="text-[15px] font-semibold text-foreground">
                Your estimate is ready.
              </p>
              <p className="mt-1 max-w-lg text-[13px] leading-5 text-muted-foreground">
                Review the price, time and warranty in the summary, then choose
                the service method that suits you.
              </p>
            </div>
          )}
        </div>

        <aside className="border-t border-border bg-surface p-5 sm:p-7 lg:self-start lg:border-l lg:border-t-0 lg:p-8">
          <p className="eyebrow">Your quote</p>

          {completedSteps === 0 ? (
            <div className="py-10 lg:py-14">
              <p className="text-lg font-semibold text-foreground">
                Start with a device.
              </p>
              <p className="mt-2 max-w-[30ch] text-[13px] leading-5 text-muted-foreground">
                Your selected model, repair, estimated price, time and warranty
                will appear here.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {[
                [
                  "Device",
                  category
                    ? CATEGORIES.find((item) => item.id === category)?.label
                    : null,
                ],
                ["Type", deviceChoice?.label],
                ["Model", resolvedDeviceName],
                ["Repair", repair],
              ]
                .filter((entry): entry is [string, string] => Boolean(entry[1]))
                .map(([label, value]) => (
                  <div
                    key={label}
                    className="border-b border-border pb-3 last:border-0"
                  >
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {label}
                    </p>
                    <p className="mt-1 text-[13px] font-medium text-foreground">
                      {value}
                    </p>
                  </div>
                ))}
            </div>
          )}

          {isReady ? (
            <div className="mt-7">
              <div className="border-y border-border py-5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Estimated price
                </p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
                  {quoteDisplay}
                </p>
                <div className="mt-5 space-y-2.5">
                  <div className="flex items-start gap-2.5 text-[12px]">
                    <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span>{quote?.estimatedTime}</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-[12px]">
                    <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span>{quote?.warranty}</span>
                  </div>
                </div>
                <p className="mt-4 text-[11px] leading-5 text-muted-foreground">
                  Estimate only. The fault, parts and fixed price are confirmed
                  before work starts.
                </p>
              </div>
              <div className="mt-5 space-y-2.5">
              {canRequestOnline ? (
                <Button asChild className="btn-primary h-11 w-full rounded-md">
                  <Link href={bookingBase} className="flex items-center justify-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {quote?.inspectionRequired
                      ? "Request an Assessment"
                      : "Request Repair"}
                  </Link>
                </Button>
              ) : (
                <Button asChild className="btn-primary h-11 w-full rounded-md">
                  <Link href="/contact">Request a manual quote</Link>
                </Button>
              )}
              {canRequestOnline && FEATURES.mailInEnabled && (
                <Button asChild variant="outline" className="h-11 w-full rounded-md border-border bg-card">
                  <Link href={mailInUrl} className="flex items-center justify-center gap-2">
                    <Mail className="h-4 w-4" />
                    Request mail-in repair
                  </Link>
                </Button>
              )}
              </div>
            </div>
          ) : (
            completedSteps > 0 && (
              <p className="mt-7 text-[12px] leading-relaxed text-muted-foreground">
                Complete the choices to see an estimated range and book the
                next step.
              </p>
            )
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
