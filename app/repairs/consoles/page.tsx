import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { serviceImages } from "@/lib/serviceImages";

export const metadata: Metadata = {
  title: "Console Repair Leeds | PlayStation, Xbox, Nintendo",
  description:
    "Game console repair in Leeds for PlayStation, Xbox, Nintendo Switch and handheld consoles. HDMI ports, no power, overheating, liquid damage and board-level repair.",
};

const repairTypes = [
  { name: "HDMI port repair", price: "from £59", time: "1-3 days" },
  { name: "USB-C / charging port", price: "from £59", time: "1-3 days" },
  { name: "No power repair", price: "from £79", time: "1-5 days" },
  { name: "Overheating service", price: "from £49", time: "Same day" },
  { name: "Liquid damage repair", price: "from £79", time: "1-5 days" },
  { name: "Board-level repair", price: "from £89", time: "1-5 days" },
  { name: "Storage upgrade", price: "from £79", time: "60 min" },
  { name: "Software / update issue", price: "from £39", time: "60 min" },
];

const consoles = [
  "PlayStation 5",
  "PlayStation 4",
  "Xbox Series X",
  "Xbox Series S",
  "Xbox One",
  "Nintendo Switch",
  "Nintendo Switch OLED",
  "Steam Deck",
];

const consoleFamilies = [
  {
    name: "PlayStation",
    note: "PS5 and PS4 repairs",
    image: serviceImages.playstation,
  },
  {
    name: "Xbox",
    note: "Series X/S and Xbox One repairs",
    image: serviceImages.xbox,
  },
  {
    name: "Nintendo Switch",
    note: "Switch, OLED and Lite repairs",
    image: serviceImages.nintendoSwitch,
  },
];

const guarantees = [
  "HDMI and USB-C port repair",
  "No power and board-level faults",
  "Overheating and fan cleaning",
  "Liquid damage assessment",
  "Storage upgrades available",
  "Fixed quote before work starts",
];

export default function ConsoleRepairsPage() {
  return (
    <>
      <Navbar />

      <main className="pt-24 pb-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="pt-10 pb-16 border-b border-border">
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-primary mb-3">
              Console Repairs · Leeds
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-5">
                  Console repair for PlayStation, Xbox and Nintendo.
                </h1>
                <p className="text-[15px] text-muted-foreground leading-relaxed mb-6 max-w-md">
                  HDMI faults, no power, overheating, storage upgrades, liquid damage and board-level repairs. We inspect first and quote before work starts.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
                  {guarantees.map((g) => (
                    <li key={g} className="flex items-center gap-2 text-[13px] text-muted-foreground">
                      <Check className="h-3.5 w-3.5 text-accent shrink-0" />
                      {g}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild className="btn-primary h-10 rounded-lg px-6 text-[13px]">
                    <Link href="/book">Book Console Repair</Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-lg h-10 px-6 text-[13px] border-border hover:bg-muted">
                    <Link href="/contact" className="flex items-center gap-2">
                      Ask about a fault <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center lg:justify-end">
                <Image
                  src={serviceImages.console.src}
                  alt={serviceImages.console.alt}
                  width={serviceImages.console.width}
                  height={serviceImages.console.height}
                  className="relative max-h-72 w-auto object-contain drop-shadow-[0_16px_48px_rgba(0,0,0,0.45)]"
                  priority
                />
              </div>
            </div>
          </div>

          <div className="py-16 border-b border-border">
            <h2 className="text-xl font-semibold mb-8">Console families</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border rounded-xl overflow-hidden">
              {consoleFamilies.map(({ name, note, image }) => (
                <div key={name} className="bg-card p-5 text-center hover:bg-surface transition-colors">
                  <div className="mx-auto mb-4 flex h-32 items-center justify-center">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={image.width}
                      height={image.height}
                      className="max-h-32 w-auto object-contain drop-shadow-[0_14px_34px_rgba(0,0,0,0.32)]"
                    />
                  </div>
                  <p className="text-[14px] font-semibold text-foreground">{name}</p>
                  <p className="mt-1 text-[12px] text-muted-foreground">{note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="py-16 border-b border-border">
            <h2 className="text-xl font-semibold mb-8">Console repair pricing</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden">
              {repairTypes.map(({ name, price, time }) => (
                <div key={name} className="bg-card p-5 hover:bg-surface transition-colors">
                  <p className="text-[13px] font-medium text-foreground mb-1">{name}</p>
                  <p className="text-[13px] font-semibold text-primary">{price}</p>
                  <p className="text-[12px] text-muted-foreground mt-0.5">{time}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="py-16 border-b border-border">
            <h2 className="text-xl font-semibold mb-2">Consoles supported</h2>
            <p className="text-[13px] text-muted-foreground mb-8">
              If it is not listed, bring it in anyway. We inspect most modern consoles and handheld gaming devices.
            </p>
            <div className="flex flex-wrap gap-2">
              {consoles.map((consoleName) => (
                <span key={consoleName} className="px-3 py-1.5 rounded-full bg-surface border border-border text-[12px] text-foreground">
                  {consoleName}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-16 text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-3">Bring your console in.</h2>
            <p className="text-[15px] text-muted-foreground mb-8 max-w-sm mx-auto">
              We will inspect it, explain the fault, and quote before any repair work starts.
            </p>
            <Button asChild className="btn-primary h-10 rounded-lg px-8 text-[13px]">
              <Link href="/contact">Contact Origin Repairs</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
