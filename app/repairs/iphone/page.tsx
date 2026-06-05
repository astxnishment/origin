import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Smartphone,
  CheckCircle,
  Clock,
  Shield,
  ArrowRight,
  Zap,
} from "lucide-react";
import { APPLE_IPHONES } from "@/lib/repair-data";

const repairTypes = [
  { name: "Screen replacement", price: "from £79", time: "45 min" },
  { name: "Battery replacement", price: "from £49", time: "30 min" },
  { name: "Charging port", price: "from £59", time: "60 min" },
  { name: "Back glass", price: "from £69", time: "45 min" },
  { name: "Camera replacement", price: "from £69", time: "60 min" },
  { name: "Speaker repair", price: "from £49", time: "45 min" },
  { name: "Water damage diagnostic", price: "from £49", time: "24-48 hrs" },
  { name: "Software repair", price: "from £39", time: "30-60 min" },
];

const models = Array.from(new Set(APPLE_IPHONES.map((d) => d.model)));

export default function IPhoneRepairsPage() {
  return (
    <>
      <Navbar />

      <main className="pt-32 pb-24">
        {/* Header Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <Badge className="mb-4 bg-primary/10 text-primary">
            iPhone Repairs
          </Badge>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
                iPhone repairs in Leeds.
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Expert iPhone repairs for all models. Screen cracks, battery
                drain, water damage, camera issues — we fix it all. Same-day
                service, genuine parts, 12-month warranty.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-blue-700"
                >
                  <Link href="/book">Book iPhone Repair</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-2">
                  <Link href="/quote">Get Instant Quote</Link>
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-white border-border">
                <CardContent className="p-6 text-center">
                  <p className="text-3xl font-bold text-primary mb-1">
                    {models.length}+
                  </p>
                  <p className="text-xs text-muted-foreground">
                    iPhone models
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white border-border">
                <CardContent className="p-6 text-center">
                  <p className="text-3xl font-bold text-primary mb-1">45 min</p>
                  <p className="text-xs text-muted-foreground">
                    Avg screen repair
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white border-border">
                <CardContent className="p-6 text-center">
                  <p className="text-3xl font-bold text-green-600 mb-1">
                    12mo
                  </p>
                  <p className="text-xs text-muted-foreground">Warranty</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Models Section */}
        <section className="border-y border-border bg-secondary/40 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground mb-8">
              Models we repair:
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {models.map((model) => (
                <Card
                  key={model}
                  className="bg-white border-border hover:border-primary transition-colors text-center"
                >
                  <CardContent className="p-4">
                    <Smartphone className="h-6 w-6 text-primary mx-auto mb-2" />
                    <p className="font-medium text-sm text-foreground">
                      {model}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Repair Types */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-3xl font-bold text-foreground mb-12">
            Common iPhone repairs:
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {repairTypes.map(({ name, price, time }) => (
              <Card key={name} className="bg-white border-border hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <CheckCircle className="h-5 w-5 text-green-600 mb-3" />
                  <p className="font-semibold text-foreground mb-2">{name}</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    ⏱️ {time}
                  </p>
                  <p className="text-lg font-bold text-primary">{price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Button asChild size="lg" className="bg-primary hover:bg-blue-700">
              <Link href="/book">Book iPhone Repair</Link>
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              Prices are estimates. Final quote given before work starts.
            </p>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="border-t border-border bg-blue-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground mb-12">
              Why choose Origin for iPhone repair?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <Zap className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Same-Day Service
                  </h3>
                  <p className="text-muted-foreground">
                    90% of iPhone repairs completed while you wait. No
                    multi-day turnarounds.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Shield className="h-6 w-6 text-green-600 shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    12-Month Warranty
                  </h3>
                  <p className="text-muted-foreground">
                    Every iPhone repair backed by our full 12-month warranty.
                    No hidden conditions.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Genuine Parts
                  </h3>
                  <p className="text-muted-foreground">
                    OEM-grade iPhone screens, batteries, and components. Never
                    cheap knockoffs.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Clock className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Fixed Pricing
                  </h3>
                  <p className="text-muted-foreground">
                    Quote before we start. No surprises. No hidden diagnostics
                    fees.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-3xl font-bold text-foreground mb-12">
            iPhone repair FAQs
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                How much does iPhone screen repair cost?
              </h3>
              <p className="text-muted-foreground">
                iPhone screen replacement typically costs £79–£149 depending on
                the model. Newer models (iPhone 14/15/16 Pro) cost more due to
                OLED technology.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Can you fix water-damaged iPhones?
              </h3>
              <p className="text-muted-foreground">
                Yes. We have specialized equipment for liquid damage recovery.
                Success depends on severity and how quickly you bring it in.
                Free diagnostics.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Do you use genuine Apple parts?
              </h3>
              <p className="text-muted-foreground">
                We use OEM-grade components that meet Apple standards. For
                premium repairs, we source official Apple parts.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                What's your warranty?
              </h3>
              <p className="text-muted-foreground">
                Every iPhone repair includes a 12-month warranty on parts and
                labour. If anything goes wrong, we fix it free.
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-border py-20 text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Ready to fix your iPhone?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Get an instant quote or book your repair now. Same-day service in
              Leeds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-blue-700"
              >
                <Link href="/book">Book Now</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2">
                <Link href="/quote">Get Quote</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
