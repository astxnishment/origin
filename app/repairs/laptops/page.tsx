import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Laptop, CheckCircle, Clock, Shield, Zap, AlertCircle } from "lucide-react";
import { APPLE_MACBOOKS } from "@/lib/repair-data";

const repairTypes = [
  { name: "Screen replacement", price: "from £149", time: "2-3 hrs" },
  { name: "Battery replacement", price: "from £99", time: "90 min" },
  { name: "Keyboard replacement", price: "from £129", time: "2 hrs" },
  { name: "Trackpad replacement", price: "from £99", time: "90 min" },
  { name: "SSD upgrade", price: "from £79", time: "60 min" },
  { name: "RAM upgrade", price: "from £69", time: "60 min" },
  { name: "Water damage", price: "from £79", time: "24-48 hrs" },
  { name: "Fan cleaning", price: "from £49", time: "30 min" },
];

const models = Array.from(new Set(APPLE_MACBOOKS.map((d) => d.model)));

export default function LaptopRepairsPage() {
  return (
    <>
      <Navbar />

      <main className="pt-32 pb-24">
        {/* Header */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <Badge className="mb-4 bg-primary/10 text-primary">
            Laptop Repairs
          </Badge>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
                MacBook & laptop repairs.
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Expert MacBook and laptop repair service in Leeds. We fix Apple,
                Dell, HP, Lenovo, and more. Expert technicians, genuine parts,
                data-safe repairs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-blue-700"
                >
                  <Link href="/book">Book Laptop Repair</Link>
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
                    MacBook models
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white border-border">
                <CardContent className="p-6 text-center">
                  <p className="text-3xl font-bold text-primary mb-1">4+</p>
                  <p className="text-xs text-muted-foreground">
                    Brands supported
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white border-border">
                <CardContent className="p-6 text-center">
                  <p className="text-3xl font-bold text-green-600 mb-1">
                    Data
                  </p>
                  <p className="text-xs text-muted-foreground">Protected</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Warning Card */}
        <section className="bg-amber-50 border-y border-amber-200 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-4">
              <AlertCircle className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-900 mb-1">
                  Your data is safe with us
                </h3>
                <p className="text-sm text-amber-800">
                  We never access or backup your personal files. Your laptop
                  receives only the repair it needs. Zero data access.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* MacBook Models */}
        <section className="border-y border-border bg-secondary/40 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground mb-8">
              MacBook models we repair:
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {models.map((model) => (
                <Card
                  key={model}
                  className="bg-white border-border hover:border-primary transition-colors"
                >
                  <CardContent className="p-4">
                    <p className="font-medium text-sm text-foreground">
                      {model}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              ✓ Plus Windows laptops: Dell, HP, Lenovo, ASUS, and more
            </p>
          </div>
        </section>

        {/* Repair Types */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-3xl font-bold text-foreground mb-12">
            Common laptop repairs:
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
              <Link href="/book">Book Laptop Repair</Link>
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              Prices vary by model. Final quote given before work starts.
            </p>
          </div>
        </section>

        {/* Why Choose */}
        <section className="border-t border-border bg-blue-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground mb-12">
              Why choose Origin for laptop repair?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <Zap className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Expert Technicians
                  </h3>
                  <p className="text-muted-foreground">
                    Certified engineers specializing in MacBook and laptop
                    repairs. 5+ years experience.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Shield className="h-6 w-6 text-green-600 shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Data Safety
                  </h3>
                  <p className="text-muted-foreground">
                    Your files are yours. We never access personal data. No
                    backups without permission.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Transparent Pricing
                  </h3>
                  <p className="text-muted-foreground">
                    Fixed quotes before we start. No diagnostics fees. No
                    surprises.
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
                    Most repairs completed in hours, not days. Priority for
                    business clients.
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
              Get your laptop fixed today.
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Expert MacBook and laptop repairs in Leeds. Same-day service,
              data-safe, guaranteed.
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
