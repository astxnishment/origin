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
} from "@/lib/calculatorData";
import { ArrowRight, Clock, Shield, Zap } from "lucide-react";

export default function HeroCalculator() {
  const [brand, setBrand] = useState<Brand | "">("");
  const [modelId, setModelId] = useState<string>("");
  const [repairType, setRepairType] = useState<RepairType | "">("");

  const models = useMemo(() => {
    if (!brand) return [];
    return getModelsByBrand(brand as Brand);
  }, [brand]);

  const selectedModel = useMemo(() => {
    return models.find((m) => m.id === modelId);
  }, [models, modelId]);

  const repairTypes = useMemo(() => {
    if (!selectedModel) return [];
    return REPAIR_TYPES;
  }, [selectedModel]);

  const quote = useMemo(() => {
    if (!selectedModel || !repairType) return null;
    return getRepairQuote(selectedModel, repairType as RepairType);
  }, [selectedModel, repairType]);

  const isReady = brand && modelId && repairType && selectedModel;

  return (
    <div className="relative hidden lg:block">
      {/* Outer glow container */}
      <div className="absolute -inset-8 bg-gradient-to-b from-blue-500/10 via-transparent to-transparent rounded-3xl blur-2xl pointer-events-none" />

      {/* Premium card */}
      <div
        className="relative rounded-2xl border border-blue-500/30 overflow-hidden shadow-2xl card-premium"
        style={{
          background: "linear-gradient(135deg, rgba(15,15,15,0.9) 0%, rgba(10,10,10,0.95) 100%)",
          boxShadow: "0 0 0 1px rgba(59, 130, 246, 0.2), 0 20px 60px rgba(59, 130, 246, 0.1)",
        }}
      >
        {/* Card header */}
        <div className="px-8 pt-8 pb-6 border-b border-blue-500/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-blue-500 uppercase tracking-wider">
              Repair Quote
            </span>
            {isReady && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-green-500/15 text-green-500 font-medium">
                12 month warranty
              </span>
            )}
          </div>
          <h3 className="text-xl font-semibold text-foreground">
            {selectedModel?.name || "Select device"}
          </h3>
        </div>

        {/* Card body - calculator section */}
        {!isReady ? (
          <div className="px-8 py-8 space-y-5">
            {/* Brand */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
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
                <SelectTrigger className="bg-surface border-blue-500/20 text-foreground h-10 rounded-lg">
                  <SelectValue placeholder="Select brand..." />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {BRANDS.map((b) => (
                    <SelectItem key={b} value={b} className="text-sm">
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Model */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
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
                <SelectTrigger className="bg-surface border-blue-500/20 text-foreground h-10 rounded-lg disabled:opacity-50">
                  <SelectValue placeholder={brand ? "Select model..." : "Choose brand first"} />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {models.map((m) => (
                    <SelectItem key={m.id} value={m.id} className="text-sm">
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Repair Type */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Repair Type
              </label>
              <Select
                value={repairType}
                onValueChange={(value) => setRepairType(value as RepairType)}
                disabled={!selectedModel}
              >
                <SelectTrigger className="bg-surface border-blue-500/20 text-foreground h-10 rounded-lg disabled:opacity-50">
                  <SelectValue placeholder={selectedModel ? "Select repair..." : "Choose model first"} />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {repairTypes.map((type) => (
                    <SelectItem key={type} value={type} className="text-sm">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : null}

        {/* Results section */}
        {isReady && quote ? (
          <div className="px-8 py-8 space-y-8">
            {/* Repair info */}
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Repair Type
                </p>
                <p className="text-lg font-semibold text-foreground">{repairType}</p>
              </div>
            </div>

            {/* Price section */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Estimated Price
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-bold text-foreground">
                  £{quote.minPrice}–£{quote.maxPrice}
                </p>
                <p className="text-xs text-muted-foreground">incl. labour</p>
              </div>
              <p className="text-xs text-muted-foreground italic pt-2">
                Final price confirmed after inspection.
              </p>
            </div>

            {/* Status boxes */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-surface/50 border border-blue-500/10 p-4">
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="h-3 w-3" />
                  Est. Time
                </p>
                <p className="text-sm font-semibold text-foreground">{quote.estimatedTime}</p>
              </div>
              <div className="rounded-lg bg-surface/50 border border-green-500/10 p-4">
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="h-3 w-3" />
                  Warranty
                </p>
                <p className="text-sm font-semibold text-green-500">{quote.warranty}</p>
              </div>
            </div>

            {/* CTA */}
            <Button
              asChild
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium h-11 rounded-lg transition-all duration-200 text-sm shadow-lg hover:shadow-xl"
            >
              <Link href="/book" className="flex items-center justify-center gap-2">
                Book This Repair
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : null}

        {/* Card footer - trust indicator */}
        {!isReady ? (
          <div className="px-8 py-4 bg-surface/30 border-t border-blue-500/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-500" />
              <span className="text-xs text-muted-foreground">Get instant quote</span>
            </div>
            <span className="text-xs text-blue-500 font-medium">Free Diagnostics</span>
          </div>
        ) : (
          <div className="px-8 py-4 bg-surface/30 border-t border-blue-500/10">
            <p className="text-xs text-muted-foreground text-center">
              We'll confirm the final price after inspection
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
