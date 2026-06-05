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
  getBrandsByCategory,
  getModelsByBrand,
  getRepairInfo,
  DEVICE_CATEGORIES,
} from "@/lib/repair-data";
import { ArrowRight, Check } from "lucide-react";

const steps = [
  { id: "category", label: "Category" },
  { id: "brand", label: "Brand" },
  { id: "model", label: "Model" },
  { id: "repair", label: "Repair" },
];

export default function QuoteCalculator() {
  const [category, setCategory] = useState<string>("");
  const [brand, setBrand] = useState<string>("");
  const [modelId, setModelId] = useState<string>("");
  const [repairType, setRepairType] = useState<string>("");

  const availableBrands = useMemo(() => {
    if (!category) return [];
    return getBrandsByCategory(category as any);
  }, [category]);

  const availableModels = useMemo(() => {
    if (!brand || !category) return [];
    return getModelsByBrand(brand, category as any);
  }, [brand, category]);

  const selectedDevice = useMemo(() => {
    if (!modelId) return null;
    return availableModels.find((d) => d.id === modelId);
  }, [modelId, availableModels]);

  const deviceRepairTypes = useMemo(() => {
    if (!selectedDevice) return [];
    return selectedDevice.repairs.map((r) => r.type);
  }, [selectedDevice]);

  const quote = useMemo(() => {
    if (!selectedDevice || !repairType) return null;
    return getRepairInfo(selectedDevice, repairType as any);
  }, [selectedDevice, repairType]);

  const currentStep = !category ? 0 : !brand ? 1 : !modelId ? 2 : 3;
  const isComplete = category && brand && modelId && repairType && quote;

  const resetFrom = (step: number) => {
    if (step <= 0) { setCategory(""); setBrand(""); setModelId(""); setRepairType(""); }
    else if (step <= 1) { setBrand(""); setModelId(""); setRepairType(""); }
    else if (step <= 2) { setModelId(""); setRepairType(""); }
    else { setRepairType(""); }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* ── Form ── */}
      <div className="lg:col-span-3 space-y-3">
        {/* Progress */}
        <div className="flex items-center gap-1 mb-6">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center gap-1">
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
                i < currentStep
                  ? "bg-accent/15 text-accent"
                  : i === currentStep
                  ? "bg-primary/15 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}>
                {i < currentStep ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <span className="w-3.5 h-3.5 rounded-full border border-current flex items-center justify-center text-[9px]">
                    {i + 1}
                  </span>
                )}
                {s.label}
              </div>
              {i < steps.length - 1 && (
                <div className={`w-4 h-px ${i < currentStep ? "bg-accent/40" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Device Category */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            Device type
          </label>
          <Select value={category} onValueChange={(v) => { setCategory(v); resetFrom(1); }}>
            <SelectTrigger className="bg-card border-border h-11 rounded-xl text-[14px]">
              <SelectValue placeholder="Select device type…" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border rounded-xl">
              {DEVICE_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat} className="text-[13px]">{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Brand */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            Brand
          </label>
          <Select value={brand} onValueChange={(v) => { setBrand(v); resetFrom(2); }} disabled={!category}>
            <SelectTrigger className="bg-card border-border h-11 rounded-xl text-[14px] disabled:opacity-40">
              <SelectValue placeholder={category ? "Select brand…" : "Select device type first"} />
            </SelectTrigger>
            <SelectContent className="bg-card border-border rounded-xl">
              {availableBrands.map((b) => (
                <SelectItem key={b} value={b} className="text-[13px]">{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Model */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            Model
          </label>
          <Select value={modelId} onValueChange={(v) => { setModelId(v); resetFrom(3); }} disabled={!brand}>
            <SelectTrigger className="bg-card border-border h-11 rounded-xl text-[14px] disabled:opacity-40">
              <SelectValue placeholder={brand ? "Select model…" : "Select brand first"} />
            </SelectTrigger>
            <SelectContent className="bg-card border-border rounded-xl">
              {availableModels.map((m) => (
                <SelectItem key={m.id} value={m.id} className="text-[13px]">{m.displayName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Repair Type */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            Repair type
          </label>
          <Select value={repairType} onValueChange={setRepairType} disabled={!selectedDevice}>
            <SelectTrigger className="bg-card border-border h-11 rounded-xl text-[14px] disabled:opacity-40">
              <SelectValue placeholder={selectedDevice ? "Select repair…" : "Select model first"} />
            </SelectTrigger>
            <SelectContent className="bg-card border-border rounded-xl">
              {deviceRepairTypes.map((type) => (
                <SelectItem key={type} value={type} className="text-[13px]">{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <p className="text-[11px] text-muted-foreground pt-1">
          Final price confirmed before we start any work. No obligation.
        </p>
      </div>

      {/* ── Result ── */}
      <div className="lg:col-span-2">
        {isComplete && quote ? (
          <div className="h-full rounded-2xl border border-border bg-card p-7 flex flex-col gap-6">
            {/* Price */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground mb-1">
                Estimated price
              </p>
              <p className="text-4xl font-semibold text-foreground">
                £{quote.minPrice}
                <span className="text-muted-foreground font-normal">–</span>
                £{quote.maxPrice}
              </p>
            </div>

            <div className="h-px bg-border" />

            {/* Details */}
            <div className="space-y-3 text-[13px]">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Device</span>
                <span className="text-foreground font-medium text-right">
                  {selectedDevice?.displayName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Repair</span>
                <span className="text-foreground font-medium">{repairType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Est. time</span>
                <span className="text-foreground font-medium">{quote.estimatedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Warranty</span>
                <span className="text-accent font-medium">{quote.warranty}</span>
              </div>
            </div>

            <div className="h-px bg-border" />

            <Button
              asChild
              className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl h-11 text-[13px] font-medium"
            >
              <Link href="/book" className="flex items-center justify-center gap-2">
                Book this repair
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="h-full min-h-[280px] rounded-2xl border border-dashed border-border bg-surface flex items-center justify-center p-8">
            <div className="text-center">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                <span className="text-[18px]">→</span>
              </div>
              <p className="text-[13px] text-muted-foreground">
                {!category
                  ? "Select a device type to begin"
                  : !brand
                  ? "Now select a brand"
                  : !modelId
                  ? "Select your model"
                  : "Choose a repair type"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
