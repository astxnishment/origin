import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { serviceImages } from "@/lib/serviceImages";
import {
  getSpecialistPriceLabel,
  getStartingPriceLabel,
} from "@/lib/serviceCatalogue";

export const metadata: Metadata = {
  title: "Phone Repair Leeds | iPhone, Samsung, Google Pixel",
  description:
    "Phone repairs in Leeds for iPhone, Samsung Galaxy, Google Pixel and more. Screens, batteries, charging ports, liquid damage, data recovery and motherboard repair.",
};

const repairTypes = [
  { name: "Screen replacement", price: getStartingPriceLabel({ category: "phone", repairTypeIds: ["screen-replacement"] }), time: "Model and part dependent" },
  { name: "Battery replacement", price: getStartingPriceLabel({ category: "phone", repairTypeIds: ["battery-replacement"] }), time: "Model dependent" },
  { name: "Charging port", price: getStartingPriceLabel({ category: "phone", repairTypeIds: ["charging-port-replacement", "charging-port-repair"] }), time: "Fault dependent" },
  { name: "Back glass / cover", price: getStartingPriceLabel({ category: "phone", repairTypeIds: ["back-glass-replacement", "back-cover-replacement", "back-glass"] }), time: "Model dependent" },
  { name: "Camera repair", price: getStartingPriceLabel({ category: "phone", repairTypeIds: ["camera-lens-replacement", "camera-repair"] }), time: "Model dependent" },
  { name: "Speaker / microphone", price: getStartingPriceLabel({ category: "phone", repairTypeIds: ["speaker-earpiece-replacement", "speaker-repair"] }), time: "Fault dependent" },
  { name: "Liquid damage", price: getSpecialistPriceLabel("phone", "liquid-damage-repair"), time: "Assessment required" },
  { name: "Motherboard repair", price: getSpecialistPriceLabel("phone", "motherboard-logic-board"), time: "1–5 days estimate" },
  { name: "No power repair", price: getSpecialistPriceLabel("phone", "no-power-repair"), time: "1–5 days estimate" },
  { name: "Data recovery", price: getSpecialistPriceLabel("phone", "data-recovery"), time: "2–7 days estimate" },
];

const guarantees = [
  "iPhone, Samsung, Pixel and more",
  "Board-level repairs available",
  "Liquid damage assessment",
  "Data handled carefully",
  "Clear quote before repair",
  "Warranty shown with the selected repair",
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
                    <Link href="/book">Request Phone Repair</Link>
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
              Send the device details and fault symptoms so the team can
              confirm the appropriate assessment.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="btn-primary h-10 rounded-lg px-6 text-[13px]">
                <Link href="/book">Request a Repair</Link>
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
