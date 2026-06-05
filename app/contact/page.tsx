"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Clock, CheckCircle } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    device: "",
    issue: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("sent");
        setFormData({ name: "", email: "", phone: "", device: "", issue: "" });
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <>
      <Navbar />

      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-20">
            <Badge className="mb-4 bg-primary/10 text-primary">Contact</Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Get in touch.
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Have a question about your device? Want to book a repair? Contact
              us and we'll get back to you within the hour.
            </p>
          </div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
            {/* Contact info */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold text-foreground mb-8">
                Contact details
              </h2>
              <div className="space-y-6">
                {/* Phone */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">
                      Phone
                    </p>
                    <a
                      href={`tel:${BUSINESS.phone}`}
                      className="text-lg font-semibold text-foreground hover:text-primary transition-colors"
                    >
                      {BUSINESS.phone}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">
                      Email
                    </p>
                    <a
                      href={`mailto:${BUSINESS.email}`}
                      className="text-lg font-semibold text-foreground hover:text-primary transition-colors"
                    >
                      {BUSINESS.email}
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">
                      Location
                    </p>
                    <p className="text-foreground font-semibold">
                      {BUSINESS.address}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {BUSINESS.postcode}, UK
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">
                      Hours
                    </p>
                    <p className="text-foreground font-semibold">
                      Mon–Fri: 9am–6pm
                    </p>
                    <p className="text-foreground font-semibold">Sat: 10am–4pm</p>
                    <p className="text-muted-foreground text-sm">Sun: Closed</p>
                  </div>
                </div>
              </div>

              {/* Info box */}
              <Card className="bg-blue-50 border border-primary/20 mt-8">
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground">
                    Walk-ins welcome! For complex repairs (MacBooks, data
                    recovery), call ahead to ensure a technician is available.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Contact form */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-foreground mb-8">
                Send us a message
              </h2>

              {status === "sent" ? (
                <Card className="bg-green-50 border border-green-200">
                  <CardContent className="p-12 text-center">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-green-900 mb-2">
                      Message sent!
                    </h3>
                    <p className="text-green-800">
                      We'll get back to you within the hour. Check your email
                      for confirmation.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-foreground block mb-2">
                        Name *
                      </label>
                      <Input
                        name="name"
                        placeholder="Your name"
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
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="bg-background border-border"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-foreground block mb-2">
                        Phone
                      </label>
                      <Input
                        name="phone"
                        type="tel"
                        placeholder="07xxx xxxxxx"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="bg-background border-border"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-foreground block mb-2">
                        Device
                      </label>
                      <Input
                        name="device"
                        placeholder="e.g. iPhone 15 Pro"
                        value={formData.device}
                        onChange={handleInputChange}
                        className="bg-background border-border"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground block mb-2">
                      What's the issue? *
                    </label>
                    <Textarea
                      name="issue"
                      placeholder="Describe the problem..."
                      value={formData.issue}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="bg-background border-border resize-none"
                    />
                  </div>

                  {status === "error" && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-sm text-red-600">
                        Something went wrong. Please try again or call{" "}
                        <a
                          href={`tel:${BUSINESS.phone}`}
                          className="font-semibold"
                        >
                          {BUSINESS.phone}
                        </a>
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    disabled={status === "sending"}
                    className="w-full bg-primary hover:bg-blue-700 text-white font-medium"
                  >
                    {status === "sending" ? "Sending..." : "Send Message"}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    We typically respond within 1 hour during business hours.
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* Quick book CTA */}
          <div className="border-t border-border pt-20 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Want to book directly?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Skip the form—get an instant quote or book your repair online.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-blue-700"
              >
                <Link href="/quote">Get Instant Quote</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2">
                <Link href="/book">Book a Repair</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
