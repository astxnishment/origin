"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
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
import MobilePriceBar from "@/components/MobilePriceBar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DeviceIcon, type DeviceType } from "@/components/DeviceIcon";
import {
  Search,
  ArrowRight,
  Clock,
  Shield,
  Zap,
  Check,
  Star,
  X,
} from "lucide-react";

// ── Constants ─────────────────────────────────────────────────────
const POPULAR_REPAIRS: RepairType[] = ["Screen replacement", "Battery replacement"];

const BRAND_ICON_TYPE: Record<Brand, DeviceType> = {
  Apple: "iphone",
  Samsung: "samsung",
  "Google Pixel": "pixel",
  iPad: "ipad",
  MacBook: "macbook",
  Laptop: "laptop",
  Console: "console",
};

const POPULAR_SHORTCUTS = [
  { label: "iPhone 17 Pro Max", id: "iphone-17-pro-max", brand: "Apple" as Brand },
  { label: "iPhone 16 Pro", id: "iphone-16-pro", brand: "Apple" as Brand },
  { label: "Galaxy S24 Ultra", id: "galaxy-s24-ultra", brand: "Samsung" as Brand },
  { label: "MacBook Air M3", id: "macbook-air-13-m3", brand: "MacBook" as Brand },
];

// ── Main component ────────────────────────────────────────────────
export default function FullCalculator() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [brand, setBrand] = useState<Brand>("Apple");
  const [modelId, setModelId] = useState<string>("iphone-16-pro");
  const [repairType, setRepairType] = useState<RepairType>("Screen replacement");
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
  const quote = useMemo(() => {
    if (!selectedModel) return null;
    return getRepairQuote(selectedModel, repairType);
  }, [selectedModel, repairType]);

  function selectDevice(device: DeviceModel) {
    setBrand(device.brand);
    setModelId(device.id);
    setRepairType("Screen replacement");
    setSearchQuery("");
    setSearchOpen(false);
  }

  function selectShortcut(s: typeof POPULAR_SHORTCUTS[0]) {
    setBrand(s.brand);
    setModelId(s.id);
    setRepairType("Screen replacement");
  }

  const seoSlug = selectedModel ? buildRepairSlug(selectedModel, repairType) : null;
  const bookHref = selectedModel ? buildBookingHref(selectedModel, repairType) : "/book";

  // Mobile sticky bar appears once the quote card scrolls out of view
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
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <DeviceIcon device={BRAND_ICON_TYPE[device.brand]} size={22} />
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

        {/* SEO page link */}
        {seoSlug && (
          <p className="text-xs text-muted-foreground">
            View dedicated repair page:{" "}
            <Link
              href={`/repairs/${seoSlug}`}
              className="text-blue-500 hover:underline font-medium"
            >
              /repairs/{seoSlug}
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
            </div>
            <div className="flex-shrink-0 opacity-90">
              <DeviceIcon
                device={BRAND_ICON_TYPE[brand]}
                size={brand === "MacBook" || brand === "Laptop" || brand === "Console" ? 60 : 80}
              />
            </div>
          </div>
        </div>

        {/* Price */}
        {quote && (
          <div className="px-7 pt-6 pb-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Estimated Price
            </p>
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-bold text-foreground">£{quote.minPrice}</span>
              <span className="text-2xl font-semibold text-muted-foreground">– £{quote.maxPrice}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Includes parts & labour · Final price confirmed after free inspection
            </p>
          </div>
        )}

        {/* Stats */}
        {quote && (
          <div className="grid grid-cols-3 divide-x" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <div className="px-5 py-4">
              <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-muted-foreground mb-1.5">
                <Clock className="h-2.5 w-2.5" /> Time
              </div>
              <p className="text-sm font-bold text-foreground">{quote.estimatedTime}</p>
            </div>
            <div className="px-5 py-4">
              <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-muted-foreground mb-1.5">
                <Shield className="h-2.5 w-2.5" /> Warranty
              </div>
              <p className="text-sm font-bold text-green-500">{quote.warranty}</p>
            </div>
            <div className="px-5 py-4">
              <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-muted-foreground mb-1.5">
                <Zap className="h-2.5 w-2.5" /> Avail.
              </div>
              <p className="text-sm font-bold text-blue-400">Same Day</p>
            </div>
          </div>
        )}

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
            <a href="tel:07768426754">Call 07768 426754</a>
          </Button>
        </div>
      </div>

      {/* Mobile sticky price bar */}
      {quote && selectedModel && (
        <MobilePriceBar
          show={!quoteVisible}
          deviceName={selectedModel.name}
          repairType={repairType}
          minPrice={quote.minPrice}
          maxPrice={quote.maxPrice}
          bookHref={bookHref}
        />
      )}
    </div>
  );
}
