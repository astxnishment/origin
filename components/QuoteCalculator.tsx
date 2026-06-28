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
  REPAIR_TYPES,
  type DeviceCategory,
  type RepairType,
} from "@/lib/repair-data";
import { ArrowRight, Check, Clock, Shield } from "lucide-react";

const steps = [
  { id: "category", label: "Category" },
  { id: "brand", label: "Brand" },
  { id: "model", label: "Model" },
  { id: "repair", label: "Repair" },
];

export default function QuoteCalculator() {
  const [category, setCategory] = useState<DeviceCategory | "">("");
  const [brand, setBrand] = useState<string>("");
  const [modelId, setModelId] = useState<string>("");
  const [repairType, setRepairType] = useState<RepairType | "">("");

  const availableBrands = useMemo(() => {
    if (!category) return [];
    return getBrandsByCategory(category);
  }, [category]);

  const availableModels = useMemo(() => {
    if (!brand || !category) return [];
    return getModelsByBrand(brand, category);
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
    return getRepairInfo(selectedDevice, repairType);
  }, [selectedDevice, repairType]);

  const currentStep = !category ? 0 : !brand ? 1 : !modelId ? 2 : 3;
  const isComplete = category && brand && modelId && repairType && quote;

  const resetFrom = (step: number) => {
    if (step <= 0) { setCategory(""); setBrand(""); setModelId(""); setRepairType(""); }
    else if (step <= 1) { setBrand(""); setModelId(""); setRepairType(""); }
    else if (step <= 2) { setModelId(""); setRepairType(""); }
    else { setRepairType(""); }
  };

  const selectCategory = (value: string) => {
    if (DEVICE_CATEGORIES.includes(value as DeviceCategory)) {
      setCategory(value as DeviceCategory);
      resetFrom(1);
    }
  };

  const selectRepairType = (value: string) => {
    if (REPAIR_TYPES.includes(value as RepairType)) {
      setRepairType(value as RepairType);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* ── Form ── */}
      <div className="lg:col-span-3 space-y-4">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                i < currentStep
                  ? "bg-green-500/20 text-green-500"
                : i === currentStep
                  ? "bg-white/10 text-foreground"
                  : "bg-surface text-muted-foreground"
              }`}>
                {i < currentStep ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <span className="w-3.5 h-3.5 rounded-full border border-current flex items-center justify-center text-[9px]">
                    {i + 1}
                  </span>
                )}
                {s.label}
              </div>
              {i < steps.length - 1 && (
                <div className={`w-4 h-px ${i < currentStep ? "bg-green-500/40" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          {/* Device Category */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Device category
            </label>
            <Select value={category} onValueChange={selectCategory}>
              <SelectTrigger className="bg-card border-border h-11 rounded-lg text-sm">
                <SelectValue placeholder="Select device type…" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {DEVICE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat} className="text-sm">{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Brand */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Brand
            </label>
            <Select value={brand} onValueChange={(v) => { setBrand(v); resetFrom(2); }} disabled={!category}>
              <SelectTrigger className="bg-card border-border h-11 rounded-lg text-sm disabled:opacity-50">
                <SelectValue placeholder={category ? "Select brand…" : "Select device type first"} />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {availableBrands.map((b) => (
                  <SelectItem key={b} value={b} className="text-sm">{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Model */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Model
            </label>
            <Select value={modelId} onValueChange={(v) => { setModelId(v); resetFrom(3); }} disabled={!brand}>
              <SelectTrigger className="bg-card border-border h-11 rounded-lg text-sm disabled:opacity-50">
                <SelectValue placeholder={brand ? "Select model…" : "Select brand first"} />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {availableModels.map((m) => (
                  <SelectItem key={m.id} value={m.id} className="text-sm">{m.displayName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Repair Type */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Repair type
            </label>
            <Select value={repairType} onValueChange={selectRepairType} disabled={!selectedDevice}>
              <SelectTrigger className="bg-card border-border h-11 rounded-lg text-sm disabled:opacity-50">
                <SelectValue placeholder={selectedDevice ? "Select repair…" : "Select model first"} />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {deviceRepairTypes.map((type) => (
                  <SelectItem key={type} value={type} className="text-sm">{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <p className="text-xs text-muted-foreground pt-2">
          Final price confirmed before we start any work.
        </p>
      </div>

      {/* ── Result ── */}
      <div className="lg:col-span-2">
        {isComplete && quote ? (
          <div className="h-full rounded-lg border border-border bg-card p-7 flex flex-col gap-6 card-premium">
            {/* Price */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Estimated price
              </p>
              <p className="text-4xl font-bold text-foreground">
                £{quote.minPrice}
                <span className="text-muted-foreground text-2xl font-normal">–</span>
                £{quote.maxPrice}
              </p>
            </div>

            <div className="h-px bg-border" />

            {/* Details */}
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="icon-circle">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Est. time
                  </p>
                  <p className="text-sm font-medium text-foreground mt-0.5">
                    {quote.estimatedTime}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="icon-circle accent">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Warranty
                  </p>
                  <p className="text-sm font-medium text-green-500 mt-0.5">
                    {quote.warranty}
                  </p>
                </div>
              </div>
            </div>

            <div className="h-px bg-border" />

            <Button
              asChild
              className="btn-primary w-full h-11 flex items-center justify-center gap-2"
            >
              <Link href="/book">
                Book this repair
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="h-full min-h-[320px] rounded-lg border border-dashed border-border bg-surface/50 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center mx-auto mb-4">
                <span className="text-lg">→</span>
              </div>
              <p className="text-sm text-muted-foreground">
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
