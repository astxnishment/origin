import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Smartphone,
  Tablet,
  Laptop,
  Battery,
  Droplets,
  Camera,
  Plug,
  Volume2,
  Wifi,
  HardDrive,
} from "lucide-react";

const categories = [
  {
    device: "iPhone",
    icon: Smartphone,
    badge: "Most Popular",
    repairs: [
      { name: "Screen Replacement", time: "45 min", from: "£49" },
      { name: "Battery Replacement", time: "30 min", from: "£39" },
      { name: "Charging Port Repair", time: "60 min", from: "£45" },
      { name: "Camera Repair", time: "60 min", from: "£55" },
      { name: "Water Damage Treatment", time: "24 hrs", from: "£65" },
      { name: "Home Button Repair", time: "45 min", from: "£40" },
    ],
  },
  {
    device: "Samsung",
    icon: Smartphone,
    badge: null,
    repairs: [
      { name: "Screen Replacement", time: "60 min", from: "£59" },
      { name: "Battery Replacement", time: "45 min", from: "£45" },
      { name: "Charging Port Repair", time: "60 min", from: "£50" },
      { name: "Camera Lens Replacement", time: "45 min", from: "£35" },
      { name: "Water Damage Treatment", time: "24 hrs", from: "£65" },
      { name: "Back Glass Replacement", time: "90 min", from: "£55" },
    ],
  },
  {
    device: "iPad",
    icon: Tablet,
    badge: null,
    repairs: [
      { name: "Screen Replacement", time: "90 min", from: "£79" },
      { name: "Battery Replacement", time: "60 min", from: "£55" },
      { name: "Charging Port Repair", time: "60 min", from: "£50" },
      { name: "Home Button Repair", time: "45 min", from: "£40" },
      { name: "Camera Repair", time: "60 min", from: "£55" },
      { name: "Software Issues", time: "60 min", from: "£35" },
    ],
  },
  {
    device: "MacBook",
    icon: Laptop,
    badge: null,
    repairs: [
      { name: "Screen Replacement", time: "2–3 hrs", from: "£149" },
      { name: "Battery Replacement", time: "90 min", from: "£99" },
      { name: "Keyboard Replacement", time: "2 hrs", from: "£129" },
      { name: "Liquid Damage", time: "24–48 hrs", from: "£95" },
      { name: "SSD Upgrade", time: "60 min", from: "£79" },
      { name: "RAM Upgrade", time: "60 min", from: "£69" },
    ],
  },
];

const repairTypes = [
  { icon: Battery, label: "Battery" },
  { icon: Droplets, label: "Water Damage" },
  { icon: Camera, label: "Camera" },
  { icon: Plug, label: "Charging Port" },
  { icon: Volume2, label: "Speaker / Mic" },
  { icon: Wifi, label: "Network Issues" },
  { icon: HardDrive, label: "Storage" },
];

export default function RepairsPage() {
  return (
    <>
      <Navbar />

      <main className="pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="mb-20">
            <p className="text-xs tracking-widest uppercase text-muted-foreground mb-4">
              Repairs
            </p>
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-6">
              What we fix.
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              From cracked screens to liquid damage — we handle it all. Every
              repair uses OEM-grade parts and comes with a 12-month warranty.
            </p>
          </div>

          {/* Repair type pills */}
          <div className="flex flex-wrap gap-3 mb-20">
            {repairTypes.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 border border-border rounded-full px-4 py-2 text-sm text-muted-foreground"
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </div>
            ))}
          </div>

          {/* Device categories */}
          <div className="space-y-16">
            {categories.map(({ device, icon: Icon, badge, repairs }) => (
              <div key={device}>
                <div className="flex items-center gap-3 mb-8">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-2xl font-semibold">{device}</h2>
                  {badge && (
                    <Badge
                      variant="outline"
                      className="text-xs border-border text-muted-foreground"
                    >
                      {badge}
                    </Badge>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {repairs.map(({ name, time, from }) => (
                    <Card
                      key={name}
                      className="bg-card border-border hover:border-foreground/20 transition-colors"
                    >
                      <CardContent className="p-6 flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm mb-1">{name}</p>
                          <p className="text-xs text-muted-foreground">
                            {time}
                          </p>
                        </div>
                        <p className="text-sm font-semibold whitespace-nowrap">
                          from {from}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-24 border-t border-border pt-20 text-center">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Not sure what&apos;s wrong?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Bring it in — our technicians will diagnose your device for free
              with no obligation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/book">Book a Repair</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-border"
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
