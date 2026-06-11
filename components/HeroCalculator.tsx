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
  getDeviceTypesByBrand,
  formatPrice,
  buildBookingUrl,
  type Brand,
} from "@/lib/deviceData";
import DeviceImage from "@/components/DeviceImage";
import { ArrowRight, Clock, ShieldCheck, CalendarCheck } from "lucide-react";

export default function HeroCalculator() {
  const [brand, setBrand]       = useState<Brand>("Apple");
  const [deviceTypeId, setTypeId] = useState<string>(() =>
    getDeviceTypesByBrand("Apple")[0]?.id ?? ""
  );
  const [modelId, setModelId]   = useState<string>(() =>
    getDeviceTypesByBrand("Apple")[0]?.models[0]?.id ?? ""
  );
  const [repairId, setRepairId] = useState<string>(() =>
    getDeviceTypesByBrand("Apple")[0]?.models[0]?.repairs[0]?.id ?? ""
  );

  const deviceTypes    = useMemo(() => getDeviceTypesByBrand(brand), [brand]);
  const deviceType     = useMemo(() => deviceTypes.find((d) => d.id === deviceTypeId) ?? null, [deviceTypes, deviceTypeId]);
  const models         = deviceType?.models ?? [];
  const selectedModel  = models.find((m) => m.id === modelId) ?? null;
  const repairs        = selectedModel?.repairs ?? [];
  const selectedRepair = repairs.find((r) => r.id === repairId) ?? null;

  function changeBrand(b: Brand) {
    setBrand(b);
    const types = getDeviceTypesByBrand(b);
    const t = types[0];
    setTypeId(t?.id ?? "");
    setModelId(t?.models[0]?.id ?? "");
    setRepairId(t?.models[0]?.repairs[0]?.id ?? "");
  }

  function changeType(id: string) {
    setTypeId(id);
    const dt = deviceTypes.find((d) => d.id === id);
    setModelId(dt?.models[0]?.id ?? "");
    setRepairId(dt?.models[0]?.repairs[0]?.id ?? "");
  }

  function changeModel(id: string) {
    setModelId(id);
    const mdl = deviceType?.models.find((m) => m.id === id);
    setRepairId(mdl?.repairs[0]?.id ?? "");
  }

  const priceStr   = selectedRepair ? formatPrice(selectedRepair.price) : "—";
  const isQuoteReq = !selectedRepair?.price;
  const bookUrl    = buildBookingUrl(brand, deviceTypeId, modelId, repairId);

  // Derive the repairCategory for sizing SVG icons
  const repairCategory = deviceType?.repairCategory ?? "phone";

  const selectStyle = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.12)",
  };

  return (
    <div className="relative w-full">
      <div className="glow-ambient absolute -inset-x-16 -top-24 -bottom-16 pointer-events-none" />

      <div className="surface-glass relative rounded-3xl overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

        {/* Header — device image updates live as user picks model */}
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
            <p className="text-xs text-zinc-400 mt-0.5">{selectedRepair?.label ?? ""}</p>
          </div>

          {/* Device image — live update per model */}
          <div className="flex-shrink-0 w-16 h-16">
            <DeviceImage
              brand={brand}
              model={selectedModel?.name ?? ""}
              deviceTypeId={deviceTypeId}
              category={repairCategory as "phone" | "tablet" | "laptop"}
              size={64}
              className="w-full h-full flex items-center justify-center"
              imgClassName="object-contain w-full h-full drop-shadow-[0_4px_12px_rgba(59,130,246,0.2)]"
            />
          </div>
        </div>

        {/* Selects */}
        <div className="px-7 pt-5 pb-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500">Brand</label>
              <Select value={brand} onValueChange={(v) => changeBrand(v as Brand)}>
                <SelectTrigger className="h-10 rounded-xl text-sm font-medium" style={selectStyle}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(["Apple", "Samsung"] as Brand[]).map((b) => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500">Type</label>
              <Select value={deviceTypeId} onValueChange={changeType}>
                <SelectTrigger className="h-10 rounded-xl text-sm font-medium" style={selectStyle}>
                  <SelectValue placeholder="Type…" />
                </SelectTrigger>
                <SelectContent>
                  {deviceTypes.map((dt) => (
                    <SelectItem key={dt.id} value={dt.id}>{dt.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500">Model</label>
            <Select value={modelId} onValueChange={changeModel} disabled={!deviceType}>
              <SelectTrigger className="h-10 rounded-xl text-sm font-medium" style={selectStyle}>
                <SelectValue placeholder="Select model…" />
              </SelectTrigger>
              <SelectContent>
                {models.map((m) => (
                  <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500">Repair</label>
            <Select value={repairId} onValueChange={setRepairId} disabled={!selectedModel}>
              <SelectTrigger className="h-10 rounded-xl text-sm font-medium" style={selectStyle}>
                <SelectValue placeholder="Select repair…" />
              </SelectTrigger>
              <SelectContent>
                {repairs.map((r) => (
                  <SelectItem key={r.id} value={r.id}>{r.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Result */}
        {selectedRepair && (
          <div
            className="mx-4 mb-4 rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(160deg, rgba(59,130,246,0.12) 0%, rgba(59,130,246,0.04) 100%)",
              border: "1px solid rgba(59,130,246,0.22)",
            }}
          >
            <div className="px-6 pt-5 pb-4 text-center border-b border-blue-500/10">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-300/70 mb-1">
                Estimated price
              </p>
              <p className="text-3xl font-bold text-white py-1">{priceStr}</p>
              <p className="text-xs text-zinc-400 mt-1">
                {isQuoteReq
                  ? "Free assessment — no charge if we can't fix it"
                  : "Confirmed after free inspection · includes parts & labour"}
              </p>
            </div>
            <div className="grid grid-cols-3 divide-x divide-blue-500/10">
              <div className="px-3 py-3 flex flex-col items-center gap-1 text-center">
                <CalendarCheck className="h-4 w-4 text-green-400" />
                <span className="text-[11px] font-semibold text-white">Same Day</span>
                <span className="text-[9px] text-zinc-500 uppercase tracking-wide">Repair</span>
              </div>
              <div className="px-3 py-3 flex flex-col items-center gap-1 text-center">
                <ShieldCheck className="h-4 w-4 text-green-400" />
                <span className="text-[11px] font-semibold text-white">{selectedRepair.warranty}</span>
                <span className="text-[9px] text-zinc-500 uppercase tracking-wide">Warranty</span>
              </div>
              <div className="px-3 py-3 flex flex-col items-center gap-1 text-center">
                <Clock className="h-4 w-4 text-green-400" />
                <span className="text-[11px] font-semibold text-white">{selectedRepair.time}</span>
                <span className="text-[9px] text-zinc-500 uppercase tracking-wide">Est. time</span>
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="px-4 pb-5 space-y-2.5">
          <Button
            asChild
            className="w-full h-12 rounded-xl font-semibold text-[15px] bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white"
            style={{ boxShadow: "0 8px 30px -8px rgba(59,130,246,0.5)" }}
          >
            <Link href={bookUrl} className="flex items-center justify-center gap-2">
              Book Same-Day Repair
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500">
            <span>More options?</span>
            <Link href="/quote" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Full calculator →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
