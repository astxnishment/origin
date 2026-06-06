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
import { DeviceIcon, type DeviceType } from "@/components/DeviceIcon";
import { ArrowRight, Clock, Shield, Zap, MapPin, Check, Star } from "lucide-react";

// ── Quick shortcuts ──────────────────────────────────────────────
const SHORTCUTS: {
  label: string;
  brand: Brand;
  modelId: string;
  repairType: RepairType;
}[] = [
  { label: "iPhone Screen", brand: "Apple", modelId: "iphone-16-pro", repairType: "Screen replacement" },
  { label: "iPhone Battery", brand: "Apple", modelId: "iphone-16", repairType: "Battery replacement" },
  { label: "Samsung Screen", brand: "Samsung", modelId: "galaxy-s24-ultra", repairType: "Screen replacement" },
  { label: "MacBook", brand: "MacBook", modelId: "macbook-air-13-m3", repairType: "Battery replacement" },
];

// ── Popularity metadata ──────────────────────────────────────────
const POPULAR_REPAIRS: RepairType[] = ["Screen replacement", "Battery replacement"];

// ── Brand → device icon type ─────────────────────────────────────
const BRAND_ICON_TYPE: Record<Brand, DeviceType> = {
  Apple: "iphone",
  Samsung: "samsung",
  "Google Pixel": "pixel",
  iPad: "ipad",
  MacBook: "macbook",
  Laptop: "laptop",
  Console: "console",
};

// Default preselected state
const DEFAULT_BRAND: Brand = "Apple";
const DEFAULT_MODEL = "iphone-16-pro";
const DEFAULT_REPAIR: RepairType = "Screen replacement";

// ── Component ────────────────────────────────────────────────────
export default function HeroCalculator() {
  const [brand, setBrand] = useState<Brand>(DEFAULT_BRAND);
  const [modelId, setModelId] = useState<string>(DEFAULT_MODEL);
  const [repairType, setRepairType] = useState<RepairType>(DEFAULT_REPAIR);

  const models = useMemo<DeviceModel[]>(() => getModelsByBrand(brand), [brand]);

  const selectedModel = useMemo<DeviceModel | undefined>(
    () => models.find((m) => m.id === modelId),
    [models, modelId]
  );

  const quote = useMemo(() => {
    if (!selectedModel || !repairType) return null;
    return getRepairQuote(selectedModel, repairType);
  }, [selectedModel, repairType]);

  function applyShortcut(sc: (typeof SHORTCUTS)[0]) {
    setBrand(sc.brand);
    setModelId(sc.modelId);
    setRepairType(sc.repairType);
  }

  const isActive = (sc: (typeof SHORTCUTS)[0]) =>
    brand === sc.brand && modelId === sc.modelId && repairType === sc.repairType;

  return (
    <div className="relative w-full">
      {/* Ambient glow */}
      <div className="absolute -inset-10 bg-gradient-to-b from-blue-500/12 via-transparent to-transparent rounded-3xl blur-3xl pointer-events-none" />

      {/* ── Card ──────────────────────────────────────────────── */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(145deg, rgba(18,18,18,0.97) 0%, rgba(10,10,10,0.99) 100%)",
          border: "1px solid rgba(59,130,246,0.22)",
          boxShadow: "0 0 0 1px rgba(59,130,246,0.12), 0 28px 90px rgba(59,130,246,0.12), 0 8px 32px rgba(0,0,0,0.5)",
        }}
      >

        {/* ── Header: device visual ─────────────────────────── */}
        <div
          className="relative px-7 pt-6 pb-5 border-b overflow-hidden"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          {/* Subtle brand glow behind icon */}
          <div className="absolute right-0 top-0 w-48 h-full bg-gradient-to-l from-blue-500/5 to-transparent pointer-events-none" />

          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.14em]">
                Repair Quote
              </span>
              <h3 className="text-lg font-bold text-foreground mt-1 leading-tight truncate">
                {selectedModel?.name ?? "Select your device"}
              </h3>
              {repairType && (
                <p className="text-xs text-muted-foreground mt-0.5">{repairType}</p>
              )}
            </div>

            {/* Device SVG icon */}
            <div className="flex-shrink-0 opacity-90">
              <DeviceIcon
                device={BRAND_ICON_TYPE[brand]}
                size={brand === "MacBook" || brand === "Laptop" || brand === "Console" ? 56 : 72}
              />
            </div>
          </div>
        </div>

        {/* ── Quick shortcuts ────────────────────────────────── */}
        <div className="px-7 pt-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-2.5">
            Popular repairs
          </p>
          <div className="grid grid-cols-2 gap-2">
            {SHORTCUTS.map((sc) => {
              const active = isActive(sc);
              return (
                <button
                  key={sc.label}
                  onClick={() => applyShortcut(sc)}
                  className="text-left px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5"
                  style={{
                    background: active ? "rgba(59,130,246,0.14)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${active ? "rgba(59,130,246,0.35)" : "rgba(255,255,255,0.07)"}`,
                    color: active ? "#3b82f6" : "rgba(255,255,255,0.65)",
                  }}
                >
                  <Star className="h-2.5 w-2.5 flex-shrink-0 opacity-70" />
                  {sc.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Selects ───────────────────────────────────────── */}
        <div className="px-7 pt-5 pb-5 space-y-3.5">
          {/* Brand */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
              Brand
            </label>
            <Select
              value={brand}
              onValueChange={(v) => {
                const b = v as Brand;
                setBrand(b);
                const firstModel = getModelsByBrand(b)[0];
                setModelId(firstModel?.id ?? "");
                setRepairType("Screen replacement");
              }}
            >
              <SelectTrigger
                className="h-10 rounded-xl text-sm font-medium"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)" }}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BRANDS.map((b) => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
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
              onValueChange={(v) => {
                setModelId(v);
                setRepairType("Screen replacement");
              }}
            >
              <SelectTrigger
                className="h-10 rounded-xl text-sm font-medium"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)" }}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {models.map((m) => (
                  <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
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
              onValueChange={(v) => setRepairType(v as RepairType)}
            >
              <SelectTrigger
                className="h-10 rounded-xl text-sm font-medium"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)" }}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REPAIR_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    <span className="flex items-center gap-2">
                      {type}
                      {POPULAR_REPAIRS.includes(type) && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold uppercase tracking-wide leading-none">
                          Popular
                        </span>
                      )}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ── Results (always visible once quote exists) ─────── */}
        {quote && selectedModel && (
          <div
            className="mx-5 mb-4 rounded-xl overflow-hidden"
            style={{
              background: "rgba(59,130,246,0.06)",
              border: "1px solid rgba(59,130,246,0.18)",
            }}
          >
            {/* Price */}
            <div className="px-5 pt-4 pb-3 border-b border-blue-500/10">
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-blue-500/60 mb-1">
                Estimated Price
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-foreground">£{quote.minPrice}</span>
                <span className="text-lg font-semibold text-muted-foreground">– £{quote.maxPrice}</span>
                <span className="text-xs text-muted-foreground">incl. labour</span>
              </div>
            </div>

            {/* 3-col stats */}
            <div className="grid grid-cols-3 divide-x divide-blue-500/10">
              <div className="px-4 py-3">
                <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-muted-foreground mb-1">
                  <Clock className="h-2.5 w-2.5" /> Time
                </div>
                <p className="text-xs font-semibold text-foreground">{quote.estimatedTime}</p>
              </div>
              <div className="px-4 py-3">
                <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-muted-foreground mb-1">
                  <Shield className="h-2.5 w-2.5" /> Warranty
                </div>
                <p className="text-xs font-semibold text-green-500">{quote.warranty}</p>
              </div>
              <div className="px-4 py-3">
                <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-muted-foreground mb-1">
                  <Zap className="h-2.5 w-2.5" /> Availability
                </div>
                <p className="text-xs font-semibold text-blue-400">Same Day</p>
              </div>
            </div>

            {/* Trust checks */}
            <div className="px-4 pb-3 pt-1 grid grid-cols-2 gap-1">
              {["Same-Day Repair", "12-Month Warranty", "Leeds Based", "Quality Parts"].map((t) => (
                <div key={t} className="flex items-center gap-1.5">
                  <Check className="h-2.5 w-2.5 text-green-500 flex-shrink-0" />
                  <span className="text-[10px] text-muted-foreground">{t}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CTA ───────────────────────────────────────────── */}
        <div className="px-5 pb-5 space-y-2.5">
          <Button
            asChild
            className="w-full h-11 rounded-xl font-semibold text-sm bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white transition-all duration-200"
            style={{ boxShadow: "0 4px 20px rgba(59,130,246,0.3)" }}
          >
            <Link href="/book" className="flex items-center justify-center gap-2">
              Book This Repair
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3 text-blue-500" />
              <span className="text-[11px] text-muted-foreground">76 Cookridge St, Leeds</span>
            </div>
            <Link href="/quote" className="text-[11px] text-blue-500 hover:text-blue-400 font-medium transition-colors">
              Full calculator →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
