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
import {
  SAMSUNG_GALAXY_S,
  SAMSUNG_GALAXY_A,
  SAMSUNG_GALAXY_Z,
  SAMSUNG_GALAXY_TAB,
} from "@/lib/repair-data";

const repairTypes = [
  { name: "Screen replacement", price: "from £69", time: "60 min" },
  { name: "Battery replacement", price: "from £45", time: "45 min" },
  { name: "Charging port", price: "from £59", time: "60 min" },
  { name: "Back glass", price: "from £59", time: "45 min" },
  { name: "Camera replacement", price: "from £59", time: "60 min" },
  { name: "Speaker repair", price: "from £39", time: "45 min" },
  { name: "Water damage diagnostic", price: "from £49", time: "24-48 hrs" },
  { name: "Software repair", price: "from £39", time: "30-60 min" },
];

const allSamsungDevices = [
  ...SAMSUNG_GALAXY_S,
  ...SAMSUNG_GALAXY_A,
  ...SAMSUNG_GALAXY_Z,
  ...SAMSUNG_GALAXY_TAB,
];

const models = Array.from(new Set(allSamsungDevices.map((d) => d.model)));

export default function SamsungRepairsPage() {
  return (
    <>
      <Navbar />

      <main className="pt-32 pb-24">
        {/* Header Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <Badge className="mb-4 bg-primary/10 text-primary">
            Samsung Repairs
          </Badge>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
                Samsung repairs in Leeds.
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Expert Samsung repair for Galaxy S-series, A-series, Z-series
                foldables, and Tab tablets. Fast, affordable, professional.
                Same-day service, genuine parts, 12-month warranty.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-blue-700"
                >
                  <Link href="/book">Book Samsung Repair</Link>
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
                    Samsung models
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white border-border">
                <CardContent className="p-6 text-center">
                  <p className="text-3xl font-bold text-primary mb-1">60 min</p>
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

        {/* Device Categories */}
        <section className="border-y border-border bg-secondary/40 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground mb-8">
              What we repair:
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-white border-border">
                <CardContent className="p-6 text-center">
                  <Smartphone className="h-8 w-8 text-primary mx-auto mb-3" />
                  <p className="font-semibold text-foreground">
                    Galaxy S20—S25
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Plus & Ultra
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white border-border">
                <CardContent className="p-6 text-center">
                  <Smartphone className="h-8 w-8 text-primary mx-auto mb-3" />
                  <p className="font-semibold text-foreground">Galaxy A-Series</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    A13 to A55
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white border-border">
                <CardContent className="p-6 text-center">
                  <Smartphone className="h-8 w-8 text-primary mx-auto mb-3" />
                  <p className="font-semibold text-foreground">Galaxy Z Fold</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Foldable series
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white border-border">
                <CardContent className="p-6 text-center">
                  <Smartphone className="h-8 w-8 text-primary mx-auto mb-3" />
                  <p className="font-semibold text-foreground">Galaxy Tab</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    S8 to S10
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Repair Types */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-3xl font-bold text-foreground mb-12">
            Common Samsung repairs:
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
              <Link href="/book">Book Samsung Repair</Link>
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              Prices are estimates. Final quote given before work starts.
            </p>
          </div>
        </section>

        {/* Why Choose */}
        <section className="border-t border-border bg-blue-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground mb-12">
              Why Origin for Samsung repair?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <Zap className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Competitive Pricing
                  </h3>
                  <p className="text-muted-foreground">
                    Samsung repairs at 30-50% less than official Samsung service
                    centers. Same quality, better price.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Shield className="h-6 w-6 text-green-600 shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Foldable Specialist
                  </h3>
                  <p className="text-muted-foreground">
                    Experienced with Z Fold and Z Flip repairs. Rare expertise
                    in Leeds.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    OEM Parts
                  </h3>
                  <p className="text-muted-foreground">
                    Samsung-grade replacement screens and components. No
                    third-party knockoffs.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Clock className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Fast Turnaround
                  </h3>
                  <p className="text-muted-foreground">
                    90% of repairs same-day. Most screen fixes while you wait.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-border py-20 text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Ready to repair your Samsung?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Get a quote now or book your repair. We service all Samsung
              models.
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
