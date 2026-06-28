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
    background: "var(--control-bg)",
    border: "1px solid var(--control-border)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
  };

  return (
    <div className="relative w-full">
      <div className="surface-glass relative overflow-hidden rounded-lg">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />

        {/* Header — device image updates live as user picks model */}
        <div className="relative flex items-center justify-between gap-4 border-b border-border px-5 pb-4 pt-5">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="h-2 w-2 rounded-full bg-[color:var(--accent)]" />
              <span className="text-[11px] font-semibold text-[color:var(--accent)] uppercase tracking-[0.14em]">
                Instant Quote
              </span>
            </div>
            <h3 className="truncate text-lg font-bold leading-tight text-foreground">
              {selectedModel?.name ?? "Select your device"}
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">{selectedRepair?.label ?? ""}</p>
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
              imgClassName="object-contain w-full h-full drop-shadow-[0_12px_20px_rgba(0,0,0,0.45)]"
            />
          </div>
        </div>

        {/* Selects */}
        <div className="space-y-2.5 px-5 pb-4 pt-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Brand</label>
              <Select value={brand} onValueChange={(v) => changeBrand(v as Brand)}>
                <SelectTrigger className="h-10 rounded-lg text-sm font-medium" style={selectStyle}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(["Apple", "Samsung", "Google Pixel"] as Brand[]).map((b) => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Type</label>
              <Select value={deviceTypeId} onValueChange={changeType}>
                <SelectTrigger className="h-10 rounded-lg text-sm font-medium" style={selectStyle}>
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
            <label className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Model</label>
            <Select value={modelId} onValueChange={changeModel} disabled={!deviceType}>
              <SelectTrigger className="h-10 rounded-lg text-sm font-medium" style={selectStyle}>
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
            <label className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Repair</label>
            <Select value={repairId} onValueChange={setRepairId} disabled={!selectedModel}>
              <SelectTrigger className="h-10 rounded-lg text-sm font-medium" style={selectStyle}>
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
            className="mx-4 mb-3 overflow-hidden rounded-lg"
            style={{
              background: "var(--soft-bg)",
              border: "1px solid var(--control-border)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            <div className="border-b border-border px-5 pb-3 pt-4 text-center">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Estimated price
              </p>
              <p className="py-0.5 text-3xl font-bold text-foreground">{priceStr}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {isQuoteReq
                  ? "Free assessment — no charge if we can't fix it"
                  : "Confirmed after free inspection · includes parts & labour"}
              </p>
            </div>
            <div className="grid grid-cols-3 divide-x divide-border">
              <div className="px-3 py-2.5 flex flex-col items-center gap-1 text-center">
                <CalendarCheck className="h-4 w-4 text-[color:var(--accent)]" />
                <span className="text-[11px] font-semibold text-foreground">Same Day</span>
                <span className="text-[9px] text-muted-foreground uppercase tracking-wide">Repair</span>
              </div>
              <div className="px-3 py-2.5 flex flex-col items-center gap-1 text-center">
                <ShieldCheck className="h-4 w-4 text-[color:var(--accent)]" />
                <span className="text-[11px] font-semibold text-foreground">{selectedRepair.warranty}</span>
                <span className="text-[9px] text-muted-foreground uppercase tracking-wide">Warranty</span>
              </div>
              <div className="px-3 py-2.5 flex flex-col items-center gap-1 text-center">
                <Clock className="h-4 w-4 text-[color:var(--accent)]" />
                <span className="text-[11px] font-semibold text-foreground">{selectedRepair.time}</span>
                <span className="text-[9px] text-muted-foreground uppercase tracking-wide">Est. time</span>
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="px-4 pb-4">
          <Button
            asChild
            className="btn-primary w-full h-11 rounded-lg font-semibold text-[14px]"
          >
            <Link href={bookUrl} className="flex items-center justify-center gap-2">
              Book Same-Day Repair
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
