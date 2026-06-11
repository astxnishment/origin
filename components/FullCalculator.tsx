"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DEVICE_TYPES,
  getDeviceTypesByBrand,
  formatPrice,
  buildBookingUrl,
  buildWhatsAppUrl,
  type Brand,
  type DeviceType,
  type DeviceModel,
  type RepairOption,
} from "@/lib/deviceData";
import { ArrowRight, ChevronRight, RotateCcw, Clock, Shield, MessageCircle } from "lucide-react";

// ── Brand images ─────────────────────────────────────────────────
const BRAND_META: Record<Brand, { label: string; sub: string }> = {
  Apple:          { label: "Apple",        sub: "iPhone · iPad · MacBook"      },
  Samsung:        { label: "Samsung",      sub: "Galaxy S · A · Z · Tab · Book" },
  "Google Pixel": { label: "Google Pixel", sub: "Pixel 6 · 7 · 8 · 9 · Fold"   },
};

// ── Step indicator ────────────────────────────────────────────────
const STEPS = ["Brand", "Device type", "Model", "Repair", "Quote"];

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-1 mb-8">
      {STEPS.map((label, i) => {
        const done    = i < current;
        const active  = i === current;
        return (
          <div key={label} className="flex items-center gap-1 flex-1 min-w-0">
            <div className="flex flex-col items-center flex-1 min-w-0">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 transition-all"
                style={{
                  background: done ? "#3b82f6" : active ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.06)",
                  border: active ? "1.5px solid #3b82f6" : done ? "none" : "1.5px solid rgba(255,255,255,0.12)",
                  color: done ? "#fff" : active ? "#60a5fa" : "rgba(255,255,255,0.3)",
                }}
              >
                {done ? "✓" : i + 1}
              </div>
              <span
                className="text-[9px] uppercase tracking-wide mt-1 hidden sm:block truncate w-full text-center"
                style={{ color: active ? "#60a5fa" : done ? "#3b82f6" : "rgba(255,255,255,0.25)" }}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className="h-px flex-1 mx-1 mb-3 sm:mb-5 transition-all"
                style={{ background: done ? "#3b82f6" : "rgba(255,255,255,0.08)" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Selection pill / card ─────────────────────────────────────────
function OptionGrid({
  options,
  selected,
  onSelect,
  cols = 2,
}: {
  options: { id: string; label: string; sub?: string }[];
  selected: string | null;
  onSelect: (id: string) => void;
  cols?: number;
}) {
  return (
    <div
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {options.map((opt) => {
        const active = selected === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className="text-left px-4 py-3 rounded-xl transition-all duration-150 hover:scale-[1.01] active:scale-[0.99]"
            style={{
              background: active ? "rgba(59,130,246,0.14)" : "rgba(255,255,255,0.03)",
              border: `1.5px solid ${active ? "rgba(59,130,246,0.5)" : "rgba(255,255,255,0.07)"}`,
            }}
          >
            <span
              className="text-sm font-medium block"
              style={{ color: active ? "#93c5fd" : "rgba(255,255,255,0.75)" }}
            >
              {opt.label}
            </span>
            {opt.sub && (
              <span className="text-[11px] text-zinc-500 mt-0.5 block">{opt.sub}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────
export default function FullCalculator() {
  const [brand, setBrand]           = useState<Brand | null>(null);
  const [deviceType, setDeviceType] = useState<DeviceType | null>(null);
  const [model, setModel]           = useState<DeviceModel | null>(null);
  const [repair, setRepair]         = useState<RepairOption | null>(null);

  // Step index: 0=brand 1=type 2=model 3=repair 4=quote
  const step = brand === null ? 0 : deviceType === null ? 1 : model === null ? 2 : repair === null ? 3 : 4;

  function reset() {
    setBrand(null); setDeviceType(null); setModel(null); setRepair(null);
  }
  function pickBrand(b: Brand) {
    if (b !== brand) { setDeviceType(null); setModel(null); setRepair(null); }
    setBrand(b);
  }
  function pickType(dt: DeviceType) {
    if (dt.id !== deviceType?.id) { setModel(null); setRepair(null); }
    setDeviceType(dt);
  }
  function pickModel(mdl: DeviceModel) {
    if (mdl.id !== model?.id) setRepair(null);
    setModel(mdl);
  }

  const priceStr = repair ? formatPrice(repair.price) : "";
  const bookUrl  = brand && deviceType && model && repair
    ? buildBookingUrl(brand, deviceType.id, model.id, repair.id)
    : "/book";
  const waUrl = model && repair
    ? buildWhatsAppUrl(model.name, repair.label, priceStr)
    : "https://wa.me/447768426754";

  return (
    <div className="max-w-2xl mx-auto">
      <StepBar current={step} />

      {/* ── STEP 0: Brand ──────────────────────────────────── */}
      <Section
        title="Choose your brand"
        visible={step >= 0}
        done={brand !== null}
        summary={brand ?? undefined}
        onEdit={() => { setBrand(null); setDeviceType(null); setModel(null); setRepair(null); }}
      >
        <OptionGrid
          cols={2}
          selected={brand}
          onSelect={(id) => pickBrand(id as Brand)}
          options={(["Apple", "Samsung", "Google Pixel"] as Brand[]).map((b) => ({
            id: b,
            label: BRAND_META[b].label,
            sub: BRAND_META[b].sub,
          }))}
        />
      </Section>

      {/* ── STEP 1: Device type ────────────────────────────── */}
      {brand && (
        <Section
          title="Choose device type"
          visible={step >= 1}
          done={deviceType !== null}
          summary={deviceType?.name}
          onEdit={() => { setDeviceType(null); setModel(null); setRepair(null); }}
        >
          <OptionGrid
            cols={2}
            selected={deviceType?.id ?? null}
            onSelect={(id) => { const dt = DEVICE_TYPES.find((d) => d.id === id)!; pickType(dt); }}
            options={getDeviceTypesByBrand(brand).map((dt) => ({ id: dt.id, label: dt.name }))}
          />
        </Section>
      )}

      {/* ── STEP 2: Model ──────────────────────────────────── */}
      {deviceType && (
        <Section
          title="Choose model"
          visible={step >= 2}
          done={model !== null}
          summary={model?.name}
          onEdit={() => { setModel(null); setRepair(null); }}
        >
          <OptionGrid
            cols={1}
            selected={model?.id ?? null}
            onSelect={(id) => { const mdl = deviceType.models.find((m) => m.id === id)!; pickModel(mdl); }}
            options={deviceType.models.map((m) => ({ id: m.id, label: m.name }))}
          />
        </Section>
      )}

      {/* ── STEP 3: Repair type ────────────────────────────── */}
      {model && (
        <Section
          title="Choose repair"
          visible={step >= 3}
          done={repair !== null}
          summary={repair?.label}
          onEdit={() => setRepair(null)}
        >
          <div className="space-y-2">
            {model.repairs.map((r) => {
              const active = repair?.id === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setRepair(r)}
                  className="w-full text-left px-4 py-3 rounded-xl transition-all duration-150 flex items-center justify-between gap-4"
                  style={{
                    background: active ? "rgba(59,130,246,0.14)" : "rgba(255,255,255,0.03)",
                    border: `1.5px solid ${active ? "rgba(59,130,246,0.5)" : "rgba(255,255,255,0.07)"}`,
                  }}
                >
                  <div>
                    <span
                      className="text-sm font-medium block"
                      style={{ color: active ? "#93c5fd" : "rgba(255,255,255,0.8)" }}
                    >
                      {r.label}
                    </span>
                    <span className="text-[11px] text-zinc-500">{r.time}</span>
                  </div>
                  <span
                    className="text-sm font-bold flex-shrink-0 tabular-nums"
                    style={{ color: active ? "#60a5fa" : r.price ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.3)" }}
                  >
                    {formatPrice(r.price)}
                  </span>
                </button>
              );
            })}
          </div>
        </Section>
      )}

      {/* ── STEP 4: Quote result ───────────────────────────── */}
      {repair && brand && deviceType && model && (
        <div
          className="mt-4 rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(145deg, rgba(18,18,22,0.98) 0%, rgba(10,10,14,0.99) 100%)",
            border: "1.5px solid rgba(59,130,246,0.3)",
            boxShadow: "0 0 0 1px rgba(59,130,246,0.08), 0 20px 60px rgba(59,130,246,0.1)",
          }}
        >
          {/* Header */}
          <div className="px-6 pt-5 pb-4 border-b border-white/[0.06]">
            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.14em] mb-1">
              Your Quote
            </p>
            <p className="text-xl font-bold text-white">{model.name}</p>
            <p className="text-sm text-zinc-400 mt-0.5">{repair.label}</p>
          </div>

          {/* Breadcrumb trail */}
          <div className="px-6 py-3 flex items-center gap-1.5 flex-wrap border-b border-white/[0.04]">
            {[brand, deviceType.name, model.name, repair.label].map((item, i, arr) => (
              <span key={i} className="flex items-center gap-1.5">
                <span className="text-[12px] text-zinc-400">{item}</span>
                {i < arr.length - 1 && <ChevronRight className="h-3 w-3 text-zinc-600 flex-shrink-0" />}
              </span>
            ))}
          </div>

          {/* Price */}
          <div className="px-6 pt-5 pb-4 border-b border-white/[0.06]">
            <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Estimated price</p>
            <p className="text-4xl font-bold text-white">{priceStr}</p>
            <p className="text-[11px] text-zinc-500 mt-2 leading-relaxed">
              Final price confirmed after free inspection. Depends on part quality and availability.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 divide-x divide-white/[0.06]">
            <div className="px-6 py-4">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-zinc-500 mb-1">
                <Clock className="h-3 w-3" /> Time estimate
              </div>
              <p className="text-sm font-semibold text-white">{repair.time}</p>
            </div>
            <div className="px-6 py-4">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-zinc-500 mb-1">
                <Shield className="h-3 w-3" /> Warranty
              </div>
              <p className="text-sm font-semibold text-green-400">{repair.warranty}</p>
            </div>
          </div>

          {/* CTAs */}
          <div className="px-5 pb-5 pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              asChild
              className="h-11 rounded-xl font-semibold text-sm bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white"
              style={{ boxShadow: "0 4px 20px rgba(59,130,246,0.3)" }}
            >
              <Link href={bookUrl} className="flex items-center justify-center gap-2">
                Book this repair
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-xl font-semibold text-sm border-white/10 hover:bg-white/5 text-white"
            >
              <a href={waUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                <MessageCircle className="h-4 w-4 text-green-400" />
                WhatsApp for exact price
              </a>
            </Button>
          </div>

          {/* Pricing note */}
          <p className="px-5 pb-5 text-[10px] text-zinc-600 leading-relaxed">
            Prices are estimates and may vary after inspection depending on part quality, device condition and part availability.
          </p>
        </div>
      )}

      {/* Reset button */}
      {step > 0 && (
        <button
          onClick={reset}
          className="mt-5 flex items-center gap-1.5 text-[12px] text-zinc-500 hover:text-zinc-300 transition-colors mx-auto"
        >
          <RotateCcw className="h-3 w-3" />
          Start over
        </button>
      )}
    </div>
  );
}

// ── Collapsible section wrapper ───────────────────────────────────
function Section({
  title,
  visible,
  done,
  summary,
  onEdit,
  children,
}: {
  title: string;
  visible: boolean;
  done: boolean;
  summary?: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  if (!visible) return null;

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-3">
        <p
          className="text-xs font-bold uppercase tracking-[0.14em]"
          style={{ color: done ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.7)" }}
        >
          {title}
          {done && summary && (
            <span className="ml-2 normal-case font-medium text-blue-400 tracking-normal">
              → {summary}
            </span>
          )}
        </p>
        {done && (
          <button
            onClick={onEdit}
            className="text-[11px] text-zinc-500 hover:text-blue-400 transition-colors"
          >
            Change
          </button>
        )}
      </div>
      {!done && children}
    </div>
  );
}
