"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
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
  buildBookingHref,
  type Brand,
  type RepairType,
  type DeviceModel,
} from "@/lib/calculatorData";
import { serviceImages } from "@/lib/serviceImages";
import MobilePriceBar from "@/components/MobilePriceBar";
import { ArrowRight, Clock, ShieldCheck, CalendarCheck, Star } from "lucide-react";

// ── Quick shortcuts ──────────────────────────────────────────────
const SHORTCUTS: { label: string; brand: Brand; modelId: string; repairType: RepairType }[] = [
  { label: "iPhone Screen", brand: "Apple", modelId: "iphone-16-pro", repairType: "Screen replacement" },
  { label: "iPhone Battery", brand: "Apple", modelId: "iphone-16", repairType: "Battery replacement" },
  { label: "Samsung Screen", brand: "Samsung", modelId: "galaxy-s25-ultra", repairType: "Screen replacement" },
  { label: "Samsung Battery", brand: "Samsung", modelId: "galaxy-s24", repairType: "Battery replacement" },
];

const POPULAR_REPAIRS: RepairType[] = ["Screen replacement", "Battery replacement"];

const BRAND_IMAGE: Record<Brand, (typeof serviceImages)[string]> = {
  Apple: serviceImages.iphone,
  Samsung: serviceImages.samsung,
};

const DEFAULT_BRAND: Brand = "Apple";
const DEFAULT_MODEL = "iphone-16-pro";
const DEFAULT_REPAIR: RepairType = "Screen replacement";

// ── Smooth count-up for the headline price ───────────────────────
function useCountUp(target: number, duration = 450) {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const from = fromRef.current;
    const to = target;
    if (from === to) return;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // easeOutExpo
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setValue(Math.round(from + (to - from) * eased));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      fromRef.current = to;
    };
  }, [target, duration]);

  return value;
}

// ── Component ────────────────────────────────────────────────────
export default function HeroCalculator() {
  const [brand, setBrand] = useState<Brand>(DEFAULT_BRAND);
  const [modelId, setModelId] = useState<string>(DEFAULT_MODEL);
  const [repairType, setRepairType] = useState<RepairType>(DEFAULT_REPAIR);

  const models = useMemo<DeviceModel[]>(() => getModelsByBrand(brand), [brand]);
  const selectedModel = useMemo(() => models.find((m) => m.id === modelId), [models, modelId]);

  const quote = useMemo(() => {
    if (!selectedModel) return null;
    return getRepairQuote(selectedModel, repairType);
  }, [selectedModel, repairType]);

  // Single headline estimate (midpoint of the range)
  const estimate =
    quote && !quote.inspectionRequired
      ? Math.round((quote.minPrice + quote.maxPrice) / 2)
      : 0;
  const animatedPrice = useCountUp(estimate);

  // Booking handoff link with prefilled device/repair
  const bookHref = selectedModel ? buildBookingHref(selectedModel, repairType) : "/book";

  // Show the mobile sticky bar once the calculator card scrolls out of view
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [cardVisible, setCardVisible] = useState(true);
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setCardVisible(entry.isIntersecting),
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function applyShortcut(sc: (typeof SHORTCUTS)[0]) {
    setBrand(sc.brand);
    setModelId(sc.modelId);
    setRepairType(sc.repairType);
  }
  const isActive = (sc: (typeof SHORTCUTS)[0]) =>
    brand === sc.brand && modelId === sc.modelId && repairType === sc.repairType;

  const selectStyle = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.12)",
  };

  return (
    <div className="relative w-full">
      {/* Soft ambient light — Apple Store, not RGB */}
      <div className="glow-ambient absolute -inset-x-16 -top-24 -bottom-16 pointer-events-none" />

      {/* ── Card ──────────────────────────────────────────────── */}
      <div ref={cardRef} className="surface-glass relative rounded-3xl overflow-hidden">
        {/* Top accent hairline */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

        {/* ── Header ───────────────────────────────────────── */}
        <div className="relative px-7 pt-6 pb-5 flex items-center justify-between gap-4 border-b border-white/[0.07]">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-500/60 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              <span className="text-[11px] font-semibold text-green-400 uppercase tracking-[0.14em]">
                Instant Quote
              </span>
            </div>
            <h3 className="text-lg font-bold text-white leading-tight truncate">
              {selectedModel?.name ?? "Select your device"}
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">{repairType}</p>
          </div>
          <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center">
            <Image
              src={BRAND_IMAGE[brand].src}
              alt={BRAND_IMAGE[brand].alt}
              width={160}
              height={200}
              className="object-contain w-full h-full drop-shadow-[0_4px_12px_rgba(59,130,246,0.2)]"
            />
          </div>
        </div>

        {/* ── Shortcuts ────────────────────────────────────── */}
        <div className="px-7 pt-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-500 mb-2.5">
            Popular repairs
          </p>
          <div className="grid grid-cols-2 gap-2">
            {SHORTCUTS.map((sc) => {
              const active = isActive(sc);
              return (
                <button
                  key={sc.label}
                  onClick={() => applyShortcut(sc)}
                  className="text-left px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 hover:scale-[1.015] active:scale-[0.98] flex items-center gap-1.5"
                  style={{
                    background: active ? "rgba(59,130,246,0.16)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${active ? "rgba(59,130,246,0.4)" : "rgba(255,255,255,0.08)"}`,
                    color: active ? "#60a5fa" : "rgba(255,255,255,0.7)",
                  }}
                >
                  <Star className="h-2.5 w-2.5 flex-shrink-0 opacity-70" />
                  {sc.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Selects ──────────────────────────────────────── */}
        <div className="px-7 pt-5 pb-5 grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500">Brand</label>
            <Select
              value={brand}
              onValueChange={(v) => {
                const b = v as Brand;
                setBrand(b);
                setModelId(getModelsByBrand(b)[0]?.id ?? "");
                setRepairType("Screen replacement");
              }}
            >
              <SelectTrigger className="h-10 rounded-xl text-sm font-medium" style={selectStyle}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BRANDS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500">Model</label>
            <Select
              value={modelId}
              onValueChange={(v) => { setModelId(v); setRepairType("Screen replacement"); }}
            >
              <SelectTrigger className="h-10 rounded-xl text-sm font-medium" style={selectStyle}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {models.map((m) => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2 space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500">Repair Type</label>
            <Select value={repairType} onValueChange={(v) => setRepairType(v as RepairType)}>
              <SelectTrigger className="h-10 rounded-xl text-sm font-medium" style={selectStyle}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REPAIR_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    <span className="flex items-center gap-2">
                      {type}
                      {POPULAR_REPAIRS.includes(type) && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold uppercase tracking-wide leading-none">
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

        {/* ── Result — the star ────────────────────────────── */}
        {quote && (
          <div
            className="mx-4 mb-4 rounded-2xl overflow-hidden"
            style={{
              background:
                "linear-gradient(160deg, rgba(59,130,246,0.12) 0%, rgba(59,130,246,0.04) 100%)",
              border: "1px solid rgba(59,130,246,0.22)",
            }}
          >
            {/* Price */}
            <div className="px-6 pt-5 pb-4 text-center border-b border-blue-500/10">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-300/70 mb-1">
                Your estimated price
              </p>
                  {quote.inspectionRequired ? (
                <p className="text-3xl font-bold text-white py-2">Inspection required</p>
              ) : (
                <div key={estimate} className="animate-price flex items-start justify-center gap-1 leading-none">
                  <span className="text-2xl font-bold text-white/80 mt-2">£</span>
                  <span className="text-6xl font-extrabold text-white tracking-tight tabular-nums">
                    {animatedPrice}
                  </span>
                </div>
              )}
              <p className="text-xs text-zinc-400 mt-2">
                {quote.inspectionRequired
                  ? "Free assessment · no charge if we can't fix it"
                  : `Range £${quote.minPrice}–£${quote.maxPrice} · confirmed after free inspection`}
              </p>
            </div>

            {/* Instant trust line */}
            <div className="grid grid-cols-3 divide-x divide-blue-500/10">
              <div className="px-3 py-3 flex flex-col items-center gap-1 text-center">
                <CalendarCheck className="h-4 w-4 text-green-400" />
                <span className="text-[11px] font-semibold text-white leading-tight">Same Day</span>
                <span className="text-[9px] text-zinc-500 uppercase tracking-wide">Repair</span>
              </div>
              <div className="px-3 py-3 flex flex-col items-center gap-1 text-center">
                <ShieldCheck className="h-4 w-4 text-green-400" />
                <span className="text-[11px] font-semibold text-white leading-tight">12 Month</span>
                <span className="text-[9px] text-zinc-500 uppercase tracking-wide">Warranty</span>
              </div>
              <div className="px-3 py-3 flex flex-col items-center gap-1 text-center">
                <Clock className="h-4 w-4 text-green-400" />
                <span className="text-[11px] font-semibold text-white leading-tight">Ready</span>
                <span className="text-[9px] text-zinc-500 uppercase tracking-wide">Today</span>
              </div>
            </div>
          </div>
        )}

        {/* ── CTA ──────────────────────────────────────────── */}
        <div className="px-4 pb-5 space-y-2.5">
          <Button
            asChild
            className="w-full h-12 rounded-xl font-semibold text-[15px] bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white transition-all duration-200"
            style={{ boxShadow: "0 8px 30px -8px rgba(59,130,246,0.5)" }}
          >
            <Link href={bookHref} className="flex items-center justify-center gap-2">
              Book Same-Day Repair
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500">
            <span>Prefer to browse?</span>
            <Link href="/quote" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Open full calculator →
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile sticky price bar — appears once card scrolls away */}
      {quote && selectedModel && !quote.inspectionRequired && (
        <MobilePriceBar
          show={!cardVisible}
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
