"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DeviceImage from "@/components/DeviceImage";
import {
  ALL_DEVICES,
  BRANDS,
  buildBookingHref,
  getRepairQuote,
  getRepairTiers,
  getSupportedRepairTypes,
  type Brand,
  type DeviceCategory,
  type RepairType,
} from "@/lib/calculatorData";
import { FEATURES } from "@/lib/constants";

const CATEGORIES: { id: DeviceCategory; label: string }[] = [
  { id: "phone", label: "Phone" },
  { id: "tablet", label: "Tablet" },
  { id: "laptop", label: "Laptop" },
];

function priceLabel(
  minPrice: number,
  maxPrice: number,
  inspectionRequired?: boolean
): string {
  if (inspectionRequired) return "Assessment required";
  return minPrice === maxPrice
    ? `£${minPrice}`
    : `£${minPrice}–£${maxPrice}`;
}

export default function HeroCalculator() {
  const modelListId = useId();
  const [category, setCategory] = useState<DeviceCategory | "">("");
  const [brand, setBrand] = useState<Brand | "">("");
  const [modelName, setModelName] = useState("");
  const [repairType, setRepairType] = useState<RepairType | "">("");
  const [partTierId, setPartTierId] = useState("");

  const brands = useMemo(
    () =>
      category
        ? BRANDS.filter((candidate) =>
            ALL_DEVICES.some(
              (device) =>
                device.brand === candidate && device.category === category
            )
          )
        : [],
    [category]
  );
  const models = useMemo(
    () =>
      category && brand
        ? ALL_DEVICES.filter(
            (device) =>
              device.category === category && device.brand === brand
          )
        : [],
    [brand, category]
  );
  const selectedModel = models.find((device) => device.name === modelName);
  const repairs = selectedModel
    ? getSupportedRepairTypes(selectedModel)
    : [];
  const tiers =
    selectedModel && repairType
      ? getRepairTiers(selectedModel, repairType)
      : [];
  const effectiveTierId =
    tiers.length === 1 ? tiers[0].partTierId : partTierId;
  const quote =
    selectedModel &&
    repairType &&
    (tiers.length <= 1 || effectiveTierId)
      ? getRepairQuote(selectedModel, repairType, effectiveTierId)
      : null;

  function resetAfterCategory(value: DeviceCategory) {
    setCategory(value);
    setBrand("");
    setModelName("");
    setRepairType("");
    setPartTierId("");
  }

  function resetAfterBrand(value: Brand) {
    setBrand(value);
    setModelName("");
    setRepairType("");
    setPartTierId("");
  }

  function chooseModel(value: string) {
    setModelName(value);
    setRepairType("");
    setPartTierId("");
  }

  const bookingHref =
    selectedModel && repairType && quote
      ? buildBookingHref(
          selectedModel,
          repairType,
          quote.partTierId
        )
      : "/quote";

  return (
    <div className="w-full overflow-hidden rounded-md border border-border bg-card">
      <div className="flex min-h-20 items-center justify-between gap-4 border-b border-border px-5 py-4">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Repair estimate
          </p>
          <h2 className="mt-1 truncate text-lg font-semibold">
            {selectedModel?.name ?? "Start with your device"}
          </h2>
        </div>
        {selectedModel && brand && category ? (
          <DeviceImage
            brand={brand}
            model={selectedModel.name}
            category={category}
            size={60}
            className="flex h-16 w-16 shrink-0 items-center justify-center"
            imgClassName="h-full w-full object-contain"
          />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-border bg-surface">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
      </div>

      <div className="space-y-3 p-5">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Category">
            <Select
              value={category}
              onValueChange={(value) =>
                resetAfterCategory(value as DeviceCategory)
              }
            >
              <SelectTrigger
                aria-label="Category"
                className="h-10 rounded-md border-border bg-surface text-[13px]"
              >
                <SelectValue placeholder="Choose" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Brand">
            <Select
              value={brand}
              disabled={!category}
              onValueChange={(value) => resetAfterBrand(value as Brand)}
            >
              <SelectTrigger
                aria-label="Brand"
                className="h-10 rounded-md border-border bg-surface text-[13px]"
              >
                <SelectValue placeholder="Choose" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <Field label="Model">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              list={modelListId}
              value={modelName}
              disabled={!brand}
              onChange={(event) => chooseModel(event.target.value)}
              placeholder={brand ? "Search or choose a model" : "Choose a brand first"}
              aria-label="Model"
              autoComplete="off"
              className="h-10 w-full rounded-md border border-border bg-surface pl-9 pr-3 text-[13px] outline-none transition-colors focus:border-[color:var(--control-border-hover)] disabled:opacity-50"
            />
            <datalist id={modelListId}>
              {models.map((device) => (
                <option key={`${device.brand}-${device.id}`} value={device.name} />
              ))}
            </datalist>
          </div>
        </Field>

        <Field label="Repair">
          <Select
            value={repairType}
            disabled={!selectedModel}
            onValueChange={(value) => {
              setRepairType(value as RepairType);
              setPartTierId("");
            }}
          >
            <SelectTrigger
              aria-label="Repair"
              className="h-10 rounded-md border-border bg-surface text-[13px]"
            >
              <SelectValue placeholder="Choose a repair" />
            </SelectTrigger>
            <SelectContent>
              {repairs.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        {tiers.length > 1 && (
          <Field label="Part option">
            <Select value={partTierId} onValueChange={setPartTierId}>
              <SelectTrigger
                aria-label="Part option"
                className="h-10 rounded-md border-border bg-surface text-[13px]"
              >
                <SelectValue placeholder="Compare part options" />
              </SelectTrigger>
              <SelectContent>
                {tiers.map((tier) => (
                  <SelectItem key={tier.id} value={tier.partTierId}>
                    {tier.partTier} ·{" "}
                    {tier.minPrice === null
                      ? "assessment"
                      : tier.minPrice === tier.maxPrice
                        ? `£${tier.minPrice}`
                        : `£${tier.minPrice}–£${tier.maxPrice}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        )}
      </div>

      {quote && (
        <div className="mx-5 mb-4 overflow-hidden rounded-md border border-border bg-surface">
          <div className="border-b border-border px-5 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Estimated price
            </p>
            <p className="mt-1 text-2xl font-semibold tracking-tight">
              {priceLabel(
                quote.minPrice,
                quote.maxPrice,
                quote.inspectionRequired
              )}
            </p>
            <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
              Estimate only. Availability, fault and final price are confirmed
              before repair.
            </p>
          </div>
          <div className="grid grid-cols-2 divide-x divide-border">
            <div className="p-4">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="mt-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                Estimated time
              </p>
              <p className="mt-1 text-[12px] font-semibold">
                {quote.estimatedTime}
              </p>
            </div>
            <div className="p-4">
              <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="mt-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                Warranty
              </p>
              <p className="mt-1 text-[12px] font-semibold">
                {quote.warranty}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="px-5 pb-5">
        <Button asChild className="h-11 w-full rounded-md text-[13px]">
          <Link
            href={
              quote && !FEATURES.bookingEnabled
                ? "/contact"
                : bookingHref
            }
          >
            {quote
              ? quote.inspectionRequired
                ? "Request an Assessment"
                : FEATURES.bookingEnabled
                  ? "Request This Repair"
                  : "Contact the Team"
              : "Open Full Quote"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}
