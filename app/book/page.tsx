"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getBrandsByCategory,
  getModelsByBrand,
  DEVICE_CATEGORIES,
} from "@/lib/repair-data";
import { BUSINESS } from "@/lib/constants";
import { CheckCircle, Clock, Shield } from "lucide-react";

const timeSlots = [
  "9:00am",
  "10:00am",
  "11:00am",
  "12:00pm",
  "1:00pm",
  "2:00pm",
  "3:00pm",
  "4:00pm",
  "5:00pm",
];

export default function BookRepairPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [modelId, setModelId] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    issue: "",
  });

  const availableBrands = category
    ? getBrandsByCategory(category as any)
    : [];

  const availableModels = brand && category
    ? getModelsByBrand(brand, category as any)
    : [];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, date: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          category,
          brand,
          modelId,
        }),
      });

      if (response.ok) {
        setStatus("sent");
        setFormData({
          name: "",
          email: "",
          phone: "",
          date: "",
          time: "",
          issue: "",
        });
        setCategory("");
        setBrand("");
        setModelId("");
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  const isFormValid =
    formData.name &&
    formData.email &&
    formData.phone &&
    category &&
    brand &&
    modelId &&
    formData.date &&
    formData.time;

  return (
    <>
      <Navbar />

      <main className="pt-32 pb-24 bg-gradient-to-b from-background to-secondary/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {status === "sent" ? (
            // Confirmation screen
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Booking confirmed!
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                We've sent a confirmation email to <span className="font-semibold text-foreground">{formData.email}</span>.
                We'll also send you an SMS reminder 24 hours before your appointment.
              </p>

              {/* Confirmation Details Card */}
              <Card className="bg-white border-border mb-8 max-w-md mx-auto">
                <CardContent className="p-6">
                  <div className="space-y-4 text-left">
                    <div>
                      <p className="text-xs font-semibold text-primary uppercase">
                        Booking Details
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Device</p>
                        <p className="font-semibold text-foreground">
                          {brand} {availableModels.find(m => m.id === modelId)?.displayName || ""}
                        </p>
                      </div>
                      <div className="flex gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Date</p>
                          <p className="font-semibold text-foreground">
                            {new Date(formData.date).toLocaleDateString("en-GB")}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Time</p>
                          <p className="font-semibold text-foreground">
                            {formData.time}
                          </p>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-border">
                        <p className="text-xs text-muted-foreground">
                          Contact
                        </p>
                        <p className="font-semibold text-foreground">
                          {formData.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Next Steps */}
              <div className="bg-blue-50 border border-primary/20 rounded-lg p-6 max-w-2xl mx-auto mb-8">
                <h2 className="font-semibold text-foreground mb-4">
                  What's next?
                </h2>
                <ul className="space-y-2 text-sm text-muted-foreground text-left">
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">1.</span>
                    <span>
                      Come to <strong>{BUSINESS.address}</strong>
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">2.</span>
                    <span>
                      Our technician will diagnose your device (free)
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">3.</span>
                    <span>
                      We'll confirm the final price before any work starts
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary font-bold">4.</span>
                    <span>
                      Repair completed with 12-month warranty included
                    </span>
                  </li>
                </ul>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-primary hover:bg-blue-700">
                  <Link href="/">Back to Home</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-2 border-primary text-primary"
                >
                  <a href={`tel:${BUSINESS.phone}`}>{BUSINESS.phone}</a>
                </Button>
              </div>
            </div>
          ) : (
            // Booking form
            <>
              <div className="mb-12 text-center">
                <Badge className="mb-4 bg-primary/10 text-primary">
                  Book Your Repair
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  Schedule your repair.
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Fill in the details below and we'll confirm your booking
                  within the hour.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Section 1: Your Details */}
                <Card className="bg-white border-border">
                  <CardHeader className="border-b border-border">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold">
                        1
                      </span>
                      Your Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-2">
                          Full Name *
                        </label>
                        <Input
                          name="name"
                          placeholder="John Smith"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="bg-background border-border"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-2">
                          Email *
                        </label>
                        <Input
                          name="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="bg-background border-border"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-foreground block mb-2">
                        Phone Number *
                      </label>
                      <Input
                        name="phone"
                        type="tel"
                        placeholder="07xxx xxxxxx"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="bg-background border-border"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Section 2: Device Info */}
                <Card className="bg-white border-border">
                  <CardHeader className="border-b border-border">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold">
                        2
                      </span>
                      Your Device
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-2">
                          Category *
                        </label>
                        <Select value={category} onValueChange={setCategory}>
                          <SelectTrigger className="bg-background border-border">
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            {DEVICE_CATEGORIES.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-2">
                          Brand *
                        </label>
                        <Select
                          value={brand}
                          onValueChange={setBrand}
                          disabled={!category}
                        >
                          <SelectTrigger className="bg-background border-border">
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            {availableBrands.map((b) => (
                              <SelectItem key={b} value={b}>
                                {b}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-2">
                          Model *
                        </label>
                        <Select
                          value={modelId}
                          onValueChange={setModelId}
                          disabled={!brand}
                        >
                          <SelectTrigger className="bg-background border-border">
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            {availableModels.map((m) => (
                              <SelectItem key={m.id} value={m.id}>
                                {m.displayName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-foreground block mb-2">
                        What's the issue?
                      </label>
                      <Textarea
                        name="issue"
                        placeholder="e.g. Cracked screen, battery doesn't hold charge, water damage..."
                        value={formData.issue}
                        onChange={handleInputChange}
                        rows={3}
                        className="bg-background border-border resize-none"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Section 3: Schedule */}
                <Card className="bg-white border-border">
                  <CardHeader className="border-b border-border">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold">
                        3
                      </span>
                      Preferred Date & Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div>
                      <label className="text-xs font-semibold text-foreground block mb-2">
                        Date *
                      </label>
                      <Input
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleDateChange}
                        required
                        className="bg-background border-border"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-foreground block mb-3">
                        Time *
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {timeSlots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({ ...prev, time: slot }))
                            }
                            className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                              formData.time === slot
                                ? "bg-primary text-white"
                                : "bg-secondary border border-border hover:border-primary"
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Trust & Assurance */}
                <Card className="bg-blue-50 border border-primary/20">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <Shield className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-foreground text-sm">
                            12-Month Warranty
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Every repair covered. No hidden conditions.
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-foreground text-sm">
                            60-Minute Average Turnaround
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Most repairs while you wait.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Button */}
                {status === "error" && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-600">
                      Something went wrong. Please try again or call{" "}
                      <a href={`tel:${BUSINESS.phone}`} className="font-semibold">
                        {BUSINESS.phone}
                      </a>
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  disabled={!isFormValid || status === "sending"}
                  className="w-full bg-primary hover:bg-blue-700 text-white font-medium"
                >
                  {status === "sending" ? "Booking..." : "Confirm Booking"}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  We'll confirm your slot by email within the hour. Walk-ins also welcome!
                </p>
              </form>
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
