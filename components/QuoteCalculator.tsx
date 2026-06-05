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
import { Card, CardContent } from "@/components/ui/card";
import {
  getBrandsByCategory,
  getModelsByBrand,
  getRepairInfo,
  DEVICE_CATEGORIES,
  REPAIR_TYPES,
} from "@/lib/repair-data";
import { Clock, Shield, Zap, CheckCircle } from "lucide-react";

export default function QuoteCalculator() {
  const [category, setCategory] = useState<string>("");
  const [brand, setBrand] = useState<string>("");
  const [modelId, setModelId] = useState<string>("");
  const [repairType, setRepairType] = useState<string>("");

  // Get available brands for selected category
  const availableBrands = useMemo(() => {
    if (!category) return [];
    return getBrandsByCategory(category as any);
  }, [category]);

  // Get available models for selected brand and category
  const availableModels = useMemo(() => {
    if (!brand || !category) return [];
    return getModelsByBrand(brand, category as any);
  }, [brand, category]);

  // Get selected device
  const selectedDevice = useMemo(() => {
    if (!modelId) return null;
    return availableModels.find((d) => d.id === modelId);
  }, [modelId, availableModels]);

  // Get available repair types for selected device
  const deviceRepairTypes = useMemo(() => {
    if (!selectedDevice) return [];
    return selectedDevice.repairs.map((r) => r.type);
  }, [selectedDevice]);

  // Get repair quote
  const quote = useMemo(() => {
    if (!selectedDevice || !repairType) return null;
    return getRepairInfo(selectedDevice, repairType as any);
  }, [selectedDevice, repairType]);

  const isComplete = category && brand && modelId && repairType && quote;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-white">
      <div className="mb-16">
        <p className="text-xs tracking-widest uppercase text-primary font-semibold mb-3">
          Quick Estimate
        </p>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Get your repair quote instantly.
        </h2>
        <p className="text-muted-foreground max-w-lg">
          Select your device and repair type to see an estimated price, repair
          time, and warranty coverage.
        </p>
      </div>

      {/* Calculator Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Left: Form inputs */}
        <div className="space-y-6">
          {/* Device Category */}
          <div className="space-y-2">
            <label className="text-xs font-medium tracking-widest uppercase text-foreground">
              Device Category
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Select device type" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                {DEVICE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Brand */}
          <div className="space-y-2">
            <label className="text-xs font-medium tracking-widest uppercase text-foreground">
              Brand
            </label>
            <Select value={brand} onValueChange={setBrand} disabled={!category}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Select brand" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                {availableBrands.map((b) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Model */}
          <div className="space-y-2">
            <label className="text-xs font-medium tracking-widest uppercase text-foreground">
              Model
            </label>
            <Select value={modelId} onValueChange={setModelId} disabled={!brand}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                {availableModels.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Repair Type */}
          <div className="space-y-2">
            <label className="text-xs font-medium tracking-widest uppercase text-foreground">
              Repair Type
            </label>
            <Select value={repairType} onValueChange={setRepairType} disabled={!selectedDevice}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Select repair type" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                {deviceRepairTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Right: Result display */}
        <div>
          {isComplete ? (
            <Card className="bg-gradient-to-br from-primary/5 to-green-500/5 border-2 border-primary h-full flex flex-col">
              <CardContent className="p-8 flex flex-col h-full justify-between">
                {/* Estimated Price */}
                <div className="mb-8 pb-8 border-b border-primary/20">
                  <p className="text-xs font-medium tracking-widest uppercase text-primary mb-2">
                    Estimated Price
                  </p>
                  <p className="text-5xl font-bold text-foreground">
                    £{quote.minPrice}—£{quote.maxPrice}
                  </p>
                  <p className="text-xs text-muted-foreground mt-3">
                    Final price depends on device condition and part availability.
                  </p>
                </div>

                {/* Details grid */}
                <div className="space-y-6 mb-8">
                  {/* Repair Time */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium tracking-widest uppercase text-foreground">
                        Estimated Time
                      </p>
                      <p className="text-sm font-medium text-foreground mt-1">
                        {quote.estimatedTime}
                      </p>
                    </div>
                  </div>

                  {/* Warranty */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0 border border-green-500/20">
                      <Shield className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium tracking-widest uppercase text-foreground">
                        Warranty
                      </p>
                      <p className="text-sm font-medium text-green-600 mt-1">
                        {quote.warranty}
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <Button asChild className="w-full bg-primary hover:bg-blue-700 text-white font-medium">
                  <Link href="/book">Book This Repair</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-secondary/30 border-border h-full">
              <CardContent className="p-8 flex items-center justify-center h-full">
                <div className="text-center">
                  <Zap className="w-12 h-12 text-primary/30 mx-auto mb-4" />
                  <p className="text-muted-foreground font-medium">
                    {!category
                      ? "Select a device category to get started"
                      : !brand
                      ? "Select a brand"
                      : !modelId
                      ? "Select a model"
                      : "Select a repair type to see pricing"}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-blue-50 border border-primary/20 rounded-lg p-6">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="font-semibold text-foreground">Note:</span> This
          estimate is based on typical repair scenarios. Final pricing depends
          on device condition, parts availability, and labour complexity. We
          provide a detailed, fixed quote before beginning any repair work at no
          obligation.{" "}
          <Link
            href="/contact"
            className="text-primary font-medium hover:underline"
          >
            Contact us
          </Link>{" "}
          for specific pricing on your device.
        </p>
      </div>
    </section>
  );
}
