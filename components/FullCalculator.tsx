"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BRANDS,
  REPAIR_TYPES,
  ALL_DEVICES,
  getModelsByBrand,
  getRepairQuote,
  buildRepairSlug,
  buildBookingHref,
  type Brand,
  type RepairType,
  type DeviceModel,
} from "@/lib/calculatorData";
import {
  getRepairTiers,
  hasMultipleTiers,
  isOledModel,
  type RepairRow,
} from "@/lib/pricing";
import MobilePriceBar from "@/components/MobilePriceBar";
import { BUSINESS } from "@/lib/constants";
import { serviceImages } from "@/lib/serviceImages";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Search,
  ArrowRight,
  Clock,
  Shield,
  Zap,
  Check,
  Star,
  X,
  AlertTriangle,
} from "lucide-react";

// ── Constants ─────────────────────────────────────────────────────
const POPULAR_REPAIRS: RepairType[] = ["Screen replacement", "Battery replacement"];

const BRAND_IMAGE: Record<Brand, (typeof serviceImages)[string]> = {
  Apple: serviceImages.iphone,
  Samsung: serviceImages.samsung,
};

const POPULAR_SHORTCUTS = [
  { label: "iPhone 16 Pro", id: "iphone-16-pro", brand: "Apple" as Brand },
  { label: "iPhone 16", id: "iphone-16", brand: "Apple" as Brand },
  { label: "Galaxy S25 Ultra", id: "galaxy-s25-ultra", brand: "Samsung" as Brand },
  { label: "Galaxy S24", id: "galaxy-s24", brand: "Samsung" as Brand },
];

const TIER_BADGE: Record<string, { label: string; color: string }> = {
  Budget: { label: "Budget", color: "bg-zinc-500/20 text-zinc-300" },
  Balanced: { label: "Recommended", color: "bg-blue-500/20 text-blue-300" },
  "Best non-genuine": { label: "Best Value", color: "bg-emerald-500/20 text-emerald-300" },
  Premium: { label: "Premium", color: "bg-amber-500/20 text-amber-300" },
};

// ── Main component ────────────────────────────────────────────────
export default function FullCalculator() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [brand, setBrand] = useState<Brand>("Apple");
  const [modelId, setModelId] = useState<string>("iphone-16-pro");
  const [repairType, setRepairType] = useState<RepairType>("Screen replacement");
  const [selectedTier, setSelectedTier] = useState<RepairRow | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Search across all devices
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return ALL_DEVICES.filter((d) => d.name.toLowerCase().includes(q)).slice(0, 8);
  }, [searchQuery]);

  // Close search on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const models = useMemo(() => getModelsByBrand(brand), [brand]);
  const selectedModel = useMemo(() => models.find((m) => m.id === modelId), [models, modelId]);

  // Legacy quote (cheapest tier) used as fallback
  const quote = useMemo(() => {
    if (!selectedModel) return null;
    return getRepairQuote(selectedModel, repairType);
  }, [selectedModel, repairType]);

  // Quality tiers from v2 data
  const tiers = useMemo(() => {
    if (!selectedModel) return [];
    return getRepairTiers(selectedModel.brand, selectedModel.name, repairTypeToExcel(repairType));
  }, [selectedModel, repairType]);

  const showTierSelector = tiers.length > 1;

  // Auto-select recommended tier when tiers change
  useEffect(() => {
    if (tiers.length === 0) { setSelectedTier(null); return; }
    const balanced = tiers.find((t) => t.recommendedTier === "Balanced" && t.minPrice !== null);
    const bestNonGenuine = tiers.find((t) => t.recommendedTier === "Best non-genuine" && t.minPrice !== null);
    const priced = tiers.find((t) => t.minPrice !== null);
    setSelectedTier(balanced ?? bestNonGenuine ?? priced ?? tiers[0]);
  }, [tiers]);

  // Effective quote: use selected tier if available
  const effectiveTier = selectedTier ?? (tiers.length === 1 ? tiers[0] : null);
  const showLcdWarning =
    effectiveTier?.partQuality === "Aftermarket LCD (Cheapest)" &&
    selectedModel &&
    isOledModel(selectedModel.name) &&
    tiers.some((t) => t.partQuality !== "Aftermarket LCD (Cheapest)");

  function selectDevice(device: DeviceModel) {
    setBrand(device.brand);
    setModelId(device.id);
    setRepairType("Screen replacement");
    setSearchQuery("");
    setSearchOpen(false);
  }

  function selectShortcut(s: (typeof POPULAR_SHORTCUTS)[0]) {
    setBrand(s.brand);
    setModelId(s.id);
    setRepairType("Screen replacement");
  }

  const seoSlug = selectedModel ? buildRepairSlug(selectedModel, repairType) : null;
  const bookHref = selectedModel ? buildBookingHref(selectedModel, repairType) : "/book";

  // Mobile sticky bar
  const quoteCardRef = useRef<HTMLDivElement | null>(null);
  const [quoteVisible, setQuoteVisible] = useState(true);
  useEffect(() => {
    const el = quoteCardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setQuoteVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Price display
  const priceDisplay = effectiveTier
    ? effectiveTier.displayPrice
    : quote?.inspectionRequired
    ? "Inspection required"
    : quote
    ? `£${quote.minPrice}–£${quote.maxPrice}`
    : null;

  const isInspection = effectiveTier
    ? effectiveTier.minPrice === null
    : !!quote?.inspectionRequired;

  const timeEstimate = effectiveTier?.timeEstimate ?? quote?.estimatedTime ?? "Contact us";
  const warrantyMonths = effectiveTier?.warrantyMonths ?? (quote ? 12 : 0);
  const customerNote = effectiveTier?.customerNote ?? "";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">

      {/* ── LEFT: Controls ─────────────────────────────────────── */}
      <div className="space-y-6">

        {/* Search bar */}
        <div ref={searchRef} className="relative">
          <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
            Search device
          </label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }}
              onFocus={() => setSearchOpen(true)}
              placeholder="e.g. iPhone 17 Pro Max, Galaxy S24…"
              className="w-full h-12 pl-11 pr-10 rounded-xl text-sm font-medium text-foreground placeholder:text-muted-foreground outline-none transition-all duration-150"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(""); setSearchOpen(false); inputRef.current?.focus(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Search dropdown */}
          {searchOpen && searchResults.length > 0 && (
            <div
              className="absolute top-full mt-2 left-0 right-0 rounded-xl overflow-hidden z-50"
              style={{
                background: "rgba(12,12,12,0.98)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
                backdropFilter: "blur(16px)",
              }}
            >
              {searchResults.map((device) => (
                <button
                  key={device.id}
                  onClick={() => selectDevice(device)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/[0.04] border-b border-white/[0.04] last:border-0"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <Image
                      src={BRAND_IMAGE[device.brand].src}
                      alt=""
                      width={32}
                      height={40}
                      className="object-contain w-6 h-6"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{device.name}</p>
                    <p className="text-xs text-muted-foreground">{device.brand}</p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground ml-auto" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Popular devices */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
            Most requested
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {POPULAR_SHORTCUTS.map((s) => {
              const active = modelId === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => selectShortcut(s)}
                  className="px-3 py-2.5 rounded-xl text-xs font-medium text-left transition-all duration-150 hover:scale-[1.02]"
                  style={{
                    background: active ? "rgba(59,130,246,0.14)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${active ? "rgba(59,130,246,0.35)" : "rgba(255,255,255,0.07)"}`,
                    color: active ? "#3b82f6" : "rgba(255,255,255,0.65)",
                  }}
                >
                  <Star className="h-2.5 w-2.5 mb-1 opacity-60" />
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Or divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">or select manually</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Manual selects */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Brand */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Brand
            </label>
            <Select
              value={brand}
              onValueChange={(v) => {
                const b = v as Brand;
                setBrand(b);
                const first = getModelsByBrand(b)[0];
                setModelId(first?.id ?? "");
                setRepairType("Screen replacement");
              }}
            >
              <SelectTrigger className="h-11 rounded-xl text-sm" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)" }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BRANDS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Model */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Model
            </label>
            <Select
              value={modelId}
              onValueChange={(v) => { setModelId(v); setRepairType("Screen replacement"); }}
            >
              <SelectTrigger className="h-11 rounded-xl text-sm" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)" }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {models.map((m) => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Repair */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Repair Type
            </label>
            <Select
              value={repairType}
              onValueChange={(v) => setRepairType(v as RepairType)}
            >
              <SelectTrigger className="h-11 rounded-xl text-sm" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)" }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REPAIR_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    <span className="flex items-center gap-2">
                      {type}
                      {POPULAR_REPAIRS.includes(type) && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold uppercase leading-none">
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

        {/* ── Quality tier selector ─────────────────────────────── */}
        {showTierSelector && (
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Part Quality
            </label>
            <div className="space-y-2">
              {tiers.map((tier) => {
                const isSelected = selectedTier?.partQuality === tier.partQuality;
                const badge = TIER_BADGE[tier.recommendedTier] ?? null;
                const isLcd = tier.partQuality === "Aftermarket LCD (Cheapest)";
                return (
                  <button
                    key={tier.partQuality}
                    onClick={() => setSelectedTier(tier)}
                    className="w-full text-left rounded-xl px-4 py-3 transition-all duration-150 hover:scale-[1.005]"
                    style={{
                      background: isSelected
                        ? "rgba(59,130,246,0.12)"
                        : "rgba(255,255,255,0.03)",
                      border: `1px solid ${isSelected ? "rgba(59,130,246,0.4)" : "rgba(255,255,255,0.07)"}`,
                    }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Radio dot */}
                        <div
                          className="flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all"
                          style={{
                            borderColor: isSelected ? "#3b82f6" : "rgba(255,255,255,0.2)",
                          }}
                        >
                          {isSelected && (
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <span
                            className="text-sm font-medium"
                            style={{ color: isSelected ? "#e2e8f0" : "rgba(255,255,255,0.65)" }}
                          >
                            {tier.partQuality}
                          </span>
                          {isLcd && (
                            <span className="ml-2 text-[10px] text-amber-400 font-medium">
                              ⚠ LCD
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {badge && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase leading-none ${badge.color}`}>
                            {badge.label}
                          </span>
                        )}
                        <span
                          className="text-sm font-bold tabular-nums"
                          style={{ color: isSelected ? "#60a5fa" : "rgba(255,255,255,0.5)" }}
                        >
                          {tier.displayPrice}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* LCD warning */}
            {showLcdWarning && (
              <div
                className="flex items-start gap-3 rounded-xl px-4 py-3"
                style={{
                  background: "rgba(245,158,11,0.08)",
                  border: "1px solid rgba(245,158,11,0.25)",
                }}
              >
                <AlertTriangle className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-200/80 leading-relaxed">
                  Budget LCD is the cheapest option but has lower colour, brightness and resale value than OLED.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Clean repair page link */}
        {seoSlug && selectedModel && (
          <p className="text-xs text-muted-foreground">
            <Link
              href={`/repairs/${seoSlug}`}
              className="text-blue-500 hover:underline font-medium"
            >
              View {selectedModel.name} {repairType.toLowerCase()} page →
            </Link>
          </p>
        )}
      </div>

      {/* ── RIGHT: Quote result ─────────────────────────────────── */}
      <div
        ref={quoteCardRef}
        className="lg:sticky lg:top-28 rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(145deg, rgba(18,18,18,0.97) 0%, rgba(10,10,10,0.99) 100%)",
          border: "1px solid rgba(59,130,246,0.22)",
          boxShadow: "0 0 0 1px rgba(59,130,246,0.1), 0 24px 80px rgba(59,130,246,0.12)",
        }}
      >
        {/* Device visual header */}
        <div
          className="relative px-7 pt-6 pb-5 border-b overflow-hidden"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <div className="absolute right-0 top-0 w-40 h-full bg-gradient-to-l from-blue-500/6 to-transparent pointer-events-none" />
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.14em]">
                Your Quote
              </span>
              <h2 className="text-xl font-bold text-foreground mt-1 leading-tight truncate">
                {selectedModel?.name ?? "No device selected"}
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">{repairType}</p>
              {effectiveTier && (
                <p className="text-xs text-zinc-500 mt-0.5">{effectiveTier.partQuality}</p>
              )}
            </div>
            <div className="flex-shrink-0 opacity-90">
              <Image
                src={BRAND_IMAGE[brand].src}
                alt={BRAND_IMAGE[brand].alt}
                width={160}
                height={200}
                className="object-contain w-16 h-20 drop-shadow-[0_4px_16px_rgba(59,130,246,0.2)]"
              />
            </div>
          </div>
        </div>

        {/* Price */}
        {priceDisplay && (
          <div className="px-7 pt-6 pb-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Estimated Price
            </p>
            {isInspection ? (
              <p className="text-2xl font-bold text-foreground">Inspection required</p>
            ) : (
              <p className="text-4xl font-bold text-foreground">{priceDisplay}</p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              {isInspection
                ? "Free assessment · no charge if we can't fix it"
                : "Includes parts & labour · Final price confirmed after free inspection"}
            </p>
            {customerNote && (
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed border-t border-white/5 pt-2">
                {customerNote}
              </p>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 divide-x" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="px-5 py-4">
            <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-muted-foreground mb-1.5">
              <Clock className="h-2.5 w-2.5" /> Time
            </div>
            <p className="text-sm font-bold text-foreground">{timeEstimate}</p>
          </div>
          <div className="px-5 py-4">
            <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-muted-foreground mb-1.5">
              <Shield className="h-2.5 w-2.5" /> Warranty
            </div>
            <p className="text-sm font-bold text-green-500">
              {warrantyMonths > 0 ? `${warrantyMonths} months` : "After inspection"}
            </p>
          </div>
          <div className="px-5 py-4">
            <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-muted-foreground mb-1.5">
              <Zap className="h-2.5 w-2.5" /> Avail.
            </div>
            <p className="text-sm font-bold text-blue-400">Same Day</p>
          </div>
        </div>

        {/* Trust checks */}
        <div className="px-7 py-4 border-t grid grid-cols-2 gap-2" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          {["Same-Day Repair", "12-Month Warranty", "Leeds Based", "Quality Parts"].map((t) => (
            <div key={t} className="flex items-center gap-2">
              <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
              <span className="text-xs text-muted-foreground">{t}</span>
            </div>
          ))}
        </div>

        {/* Popularity */}
        <div className="px-7 pb-4">
          <div className="flex items-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-blue-500 text-blue-500" />
            ))}
            <span className="text-xs text-muted-foreground ml-1">Most requested repair</span>
          </div>
        </div>

        {/* Pricing note */}
        <div className="px-7 pb-4">
          <p className="text-[10px] text-zinc-500 leading-relaxed">
            Prices are estimates and may vary after inspection depending on part quality, device condition, and part availability.
          </p>
        </div>

        {/* CTA */}
        <div className="px-5 pb-6 space-y-3">
          <Button
            asChild
            className="w-full h-12 rounded-xl font-semibold text-sm bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white transition-all duration-200"
            style={{ boxShadow: "0 4px 24px rgba(59,130,246,0.3)" }}
          >
            <Link href={bookHref} className="flex items-center justify-center gap-2">
              Book This Repair
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full h-10 rounded-xl text-sm border-border hover:bg-surface">
            <a href={`tel:${BUSINESS.phone}`}>Call {BUSINESS.phoneDisplay}</a>
          </Button>
        </div>
      </div>

      {/* Mobile sticky price bar — only when we have a real price */}
      {!isInspection && selectedModel && priceDisplay && (
        <MobilePriceBar
          show={!quoteVisible}
          deviceName={selectedModel.name}
          repairType={repairType}
          minPrice={effectiveTier?.minPrice ?? quote?.minPrice ?? 0}
          maxPrice={effectiveTier?.maxPrice ?? quote?.maxPrice ?? 0}
          bookHref={bookHref}
        />
      )}
    </div>
  );
}

// Maps UI repair type to Excel repair_type column (v3 workbook names)
function repairTypeToExcel(repairType: RepairType): string {
  const map: Record<RepairType, string> = {
    "Screen replacement": "Screen Replacement",
    "Battery replacement": "Battery Replacement",
    "Back glass": "Back Glass Replacement",
    "Charging port": "Charging Port Replacement",
    "Camera repair": "Camera Lens Replacement",
    "Speaker / microphone": "Speaker / Earpiece Replacement",
    "Water damage diagnostics": "Water Damage Diagnostic",
    "Data recovery": "Data Recovery Assessment",
  };
  return map[repairType] ?? repairType;
}
