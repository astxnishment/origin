import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { serviceImages } from "@/lib/serviceImages";

export const metadata: Metadata = {
  title: "Phone Repair Leeds | iPhone, Samsung, Google Pixel",
  description:
    "Phone repairs in Leeds for iPhone, Samsung Galaxy, Google Pixel and more. Screens, batteries, charging ports, liquid damage, data recovery and motherboard repair.",
};

const repairTypes = [
  { name: "Screen replacement", price: "from £39", time: "45-90 min" },
  { name: "Battery replacement", price: "from £24", time: "30-60 min" },
  { name: "Charging port", price: "from £54", time: "1-2 hrs" },
  { name: "Back glass / cover", price: "from £44", time: "1-2 hrs" },
  { name: "Camera repair", price: "from £49", time: "60 min" },
  { name: "Speaker / microphone", price: "from £35", time: "45 min" },
  { name: "Liquid damage", price: "diagnostic from £29", time: "Same day" },
  { name: "Motherboard repair", price: "from £79", time: "1-5 days" },
  { name: "No power repair", price: "from £79", time: "1-5 days" },
  { name: "Data recovery", price: "from £79", time: "2-7 days" },
];

const guarantees = [
  "iPhone, Samsung, Pixel and more",
  "Board-level repairs available",
  "Liquid damage assessment",
  "Data handled carefully",
  "Clear quote before repair",
  "12-month warranty where eligible",
];

const brands = [
  "iPhone",
  "Samsung Galaxy S / A / Z",
  "Google Pixel",
  "OnePlus",
  "Xiaomi",
  "Huawei",
  "Motorola",
  "Nokia",
  "Sony Xperia",
];

export default function PhoneRepairsPage() {
  return (
    <>
      <Navbar />

      <main className="pt-24 pb-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="pt-10 pb-16 border-b border-border">
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-primary mb-3">
              Phone Repairs · Leeds
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-5">
                  Phone repairs for every major model.
                </h1>
                <p className="text-[15px] text-muted-foreground leading-relaxed mb-6 max-w-md">
                  iPhone, Samsung Galaxy, Google Pixel and other Android phones. Screens,
                  batteries, charging ports, liquid damage and board-level faults.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
                  {guarantees.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-[13px] text-muted-foreground">
                      <Check className="h-3.5 w-3.5 text-accent shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild className="btn-primary h-10 rounded-lg px-6 text-[13px]">
                    <Link href="/book">Book Phone Repair</Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-lg h-10 px-6 text-[13px] border-border hover:bg-muted">
                    <Link href="/quote" className="flex items-center gap-2">
                      Get a quote <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center lg:justify-end">
                <Image
                  src={serviceImages.phones.src}
                  alt={serviceImages.phones.alt}
                  width={serviceImages.phones.width}
                  height={serviceImages.phones.height}
                  className="w-full max-w-xl object-contain drop-shadow-[0_18px_54px_rgba(0,0,0,0.34)]"
                  priority
                />
              </div>
            </div>
          </div>

          <div className="py-16 border-b border-border">
            <h2 className="text-xl font-semibold mb-2">Repair types &amp; pricing</h2>
            <p className="text-[13px] text-muted-foreground mb-8 max-w-xl">
              Starting prices shown. Final price depends on the model, part quality and fault condition.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-border rounded-xl overflow-hidden">
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
            <h2 className="text-xl font-semibold mb-6">Brands we repair</h2>
            <div className="flex flex-wrap gap-2">
              {brands.map((brand) => (
                <span
                  key={brand}
                  className="rounded-full border border-border px-3 py-1.5 text-[12px] text-muted-foreground"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-16 text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-3">
              Not sure what phone or fault you have?
            </h2>
            <p className="text-muted-foreground text-[15px] mb-8 max-w-sm mx-auto">
              Bring it in and we&apos;ll check it before quoting.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="btn-primary h-10 rounded-lg px-6 text-[13px]">
                <Link href="/book">Book a Repair</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl h-10 px-6 text-[13px] border-border hover:bg-muted">
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
