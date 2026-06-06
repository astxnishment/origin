"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  BRANDS,
  REPAIR_TYPES,
  getModelsByBrand,
  getRepairQuote,
  type Brand,
  type RepairType,
  type DeviceModel,
} from "@/lib/calculatorData";
import { ArrowRight, Clock, Shield, Zap, MapPin, Check } from "lucide-react";

// ── Quick shortcuts ──────────────────────────────────────────────
const SHORTCUTS: {
  label: string;
  brand: Brand;
  modelId: string;
  repairType: RepairType;
}[] = [
  {
    label: "iPhone Screen",
    brand: "Apple",
    modelId: "iphone-16-pro-max",
    repairType: "Screen replacement",
  },
  {
    label: "iPhone Battery",
    brand: "Apple",
    modelId: "iphone-16",
    repairType: "Battery replacement",
  },
  {
    label: "Samsung Screen",
    brand: "Samsung",
    modelId: "galaxy-s24-ultra",
    repairType: "Screen replacement",
  },
  {
    label: "MacBook Repair",
    brand: "MacBook",
    modelId: "macbook-air-13-m3",
    repairType: "Battery replacement",
  },
];

// ── Brand visuals ────────────────────────────────────────────────
const BRAND_ICON: Record<Brand, string> = {
  Apple: "📱",
  Samsung: "📱",
  "Google Pixel": "📱",
  iPad: "🪄",
  MacBook: "💻",
  Laptop: "💻",
  Console: "🎮",
};

const BRAND_COLOR: Record<Brand, string> = {
  Apple: "from-slate-700 to-slate-900",
  Samsung: "from-blue-700 to-blue-900",
  "Google Pixel": "from-green-700 to-green-900",
  iPad: "from-purple-700 to-purple-900",
  MacBook: "from-slate-600 to-slate-800",
  Laptop: "from-zinc-600 to-zinc-900",
  Console: "from-indigo-700 to-indigo-900",
};

// ── Component ────────────────────────────────────────────────────
export default function HeroCalculator() {
  const [brand, setBrand] = useState<Brand | "">("");
  const [modelId, setModelId] = useState<string>("");
  const [repairType, setRepairType] = useState<RepairType | "">("");

  const models = useMemo<DeviceModel[]>(() => {
    if (!brand) return [];
    return getModelsByBrand(brand as Brand);
  }, [brand]);

  const selectedModel = useMemo<DeviceModel | undefined>(
    () => models.find((m) => m.id === modelId),
    [models, modelId]
  );

  const quote = useMemo(() => {
    if (!selectedModel || !repairType) return null;
    return getRepairQuote(selectedModel, repairType as RepairType);
  }, [selectedModel, repairType]);

  function applyShortcut(sc: (typeof SHORTCUTS)[0]) {
    setBrand(sc.brand);
    setModelId(sc.modelId);
    setRepairType(sc.repairType);
  }

  const isReady = !!(brand && modelId && repairType && selectedModel && quote);

  return (
    <div className="relative w-full">
      {/* Outer ambient glow */}
      <div className="absolute -inset-10 bg-gradient-to-b from-blue-500/12 via-transparent to-transparent rounded-3xl blur-3xl pointer-events-none" />

      {/* ── Card ──────────────────────────────────────────────── */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background:
            "linear-gradient(145deg, rgba(18,18,18,0.95) 0%, rgba(10,10,10,0.98) 100%)",
          border: "1px solid rgba(59,130,246,0.25)",
          boxShadow:
            "0 0 0 1px rgba(59,130,246,0.15), 0 24px 80px rgba(59,130,246,0.12), 0 8px 32px rgba(0,0,0,0.4)",
        }}
      >
        {/* ── Header ────────────────────────────────────────── */}
        <div className="px-7 pt-7 pb-5 border-b border-white/[0.06]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-500 uppercase tracking-[0.14em]">
              Instant Repair Quote
            </span>
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 font-medium border border-blue-500/20">
              Free Diagnostics
            </span>
          </div>
          {/* Device visual */}
          {selectedModel ? (
            <div className="mt-4 flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${BRAND_COLOR[selectedModel.brand]} flex items-center justify-center text-lg shadow-lg flex-shrink-0`}
              >
                {BRAND_ICON[selectedModel.brand]}
              </div>
              <div>
                <p className="font-bold text-base text-foreground leading-tight">
                  {selectedModel.name}
                </p>
                {repairType && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {repairType}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="mt-3 text-base font-semibold text-muted-foreground">
              Select your device to get a quote
            </p>
          )}
        </div>

        {/* ── Shortcuts ─────────────────────────────────────── */}
        <div className="px-7 pt-5 pb-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-3">
            Quick select
          </p>
          <div className="grid grid-cols-2 gap-2">
            {SHORTCUTS.map((sc) => (
              <button
                key={sc.label}
                onClick={() => applyShortcut(sc)}
                className="text-left px-3 py-2 rounded-lg border text-xs font-medium transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background:
                    brand === sc.brand &&
                    modelId === sc.modelId &&
                    repairType === sc.repairType
                      ? "rgba(59,130,246,0.15)"
                      : "rgba(255,255,255,0.03)",
                  borderColor:
                    brand === sc.brand &&
                    modelId === sc.modelId &&
                    repairType === sc.repairType
                      ? "rgba(59,130,246,0.4)"
                      : "rgba(255,255,255,0.07)",
                  color:
                    brand === sc.brand &&
                    modelId === sc.modelId &&
                    repairType === sc.repairType
                      ? "#3b82f6"
                      : "rgba(255,255,255,0.7)",
                }}
              >
                {sc.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Selects ───────────────────────────────────────── */}
        <div className="px-7 pt-5 pb-6 space-y-4">
          {/* Brand */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
              Brand
            </label>
            <Select
              value={brand}
              onValueChange={(value) => {
                setBrand(value as Brand);
                setModelId("");
                setRepairType("");
              }}
            >
              <SelectTrigger
                className="h-11 rounded-xl text-sm font-medium transition-all duration-150"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <SelectValue placeholder="Select brand..." />
              </SelectTrigger>
              <SelectContent>
                {BRANDS.map((b) => (
                  <SelectItem key={b} value={b}>
                    {BRAND_ICON[b]} {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Model */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
              Model
            </label>
            <Select
              value={modelId}
              onValueChange={(value) => {
                setModelId(value);
                setRepairType("");
              }}
              disabled={!brand}
            >
              <SelectTrigger
                className="h-11 rounded-xl text-sm font-medium transition-all duration-150 disabled:opacity-40"
                style={{
                  background: brand
                    ? "rgba(255,255,255,0.04)"
                    : "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <SelectValue
                  placeholder={brand ? "Select model..." : "Choose brand first"}
                />
              </SelectTrigger>
              <SelectContent>
                {models.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Repair Type */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
              Repair Type
            </label>
            <Select
              value={repairType}
              onValueChange={(value) => setRepairType(value as RepairType)}
              disabled={!selectedModel}
            >
              <SelectTrigger
                className="h-11 rounded-xl text-sm font-medium transition-all duration-150 disabled:opacity-40"
                style={{
                  background: selectedModel
                    ? "rgba(255,255,255,0.04)"
                    : "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <SelectValue
                  placeholder={
                    selectedModel ? "Select repair..." : "Choose model first"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {REPAIR_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ── Results (shown when quote is ready) ───────────── */}
        {isReady && quote && (
          <div
            className="mx-5 mb-5 rounded-xl overflow-hidden"
            style={{
              background: "rgba(59,130,246,0.06)",
              border: "1px solid rgba(59,130,246,0.2)",
            }}
          >
            {/* Price row */}
            <div className="px-5 pt-5 pb-4 border-b border-blue-500/10">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-blue-500/70 mb-1">
                Estimated Price
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-foreground">
                  £{quote.minPrice}
                </span>
                <span className="text-xl font-semibold text-muted-foreground">
                  – £{quote.maxPrice}
                </span>
                <span className="text-xs text-muted-foreground ml-1">
                  incl. labour
                </span>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 divide-x divide-blue-500/10">
              <div className="px-5 py-3">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  <Clock className="h-3 w-3" />
                  Est. Time
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {quote.estimatedTime}
                </p>
              </div>
              <div className="px-5 py-3">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  <Shield className="h-3 w-3" />
                  Warranty
                </div>
                <p className="text-sm font-semibold text-green-500">
                  {quote.warranty}
                </p>
              </div>
              <div className="px-5 py-3 col-span-2">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  <Zap className="h-3 w-3" />
                  Availability
                </div>
                <p className="text-sm font-semibold text-blue-400">
                  Same-Day Available
                </p>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="px-5 pt-2 pb-4 grid grid-cols-2 gap-1.5">
              {[
                "Same-Day Repair",
                "12-Month Warranty",
                "Leeds Based",
                "Quality Parts",
              ].map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                  <span className="text-[11px] text-muted-foreground">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CTA / Footer ──────────────────────────────────── */}
        {isReady ? (
          <div className="px-5 pb-6 space-y-3">
            <Button
              asChild
              className="w-full h-12 rounded-xl font-semibold text-sm bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
            >
              <Link
                href="/book"
                className="flex items-center justify-center gap-2"
              >
                Book This Repair
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <p className="text-[11px] text-muted-foreground text-center">
              Final price confirmed after free inspection
            </p>
          </div>
        ) : (
          <div
            className="mx-5 mb-5 px-5 py-3.5 rounded-xl flex items-center justify-between"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-blue-500" />
              <span className="text-xs text-muted-foreground">
                76 Cookridge Street, Leeds
              </span>
            </div>
            <span className="text-xs text-blue-500 font-medium">
              Walk-ins welcome
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
