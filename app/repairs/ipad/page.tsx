import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check, Clock, Shield, ArrowRight, MapPin } from "lucide-react";
import { BUSINESS, FEATURES } from "@/lib/constants";
import {
  getStartingPriceLabel,
  getVisibleModels,
} from "@/lib/serviceCatalogue";
import { WARRANTY_NOTICE } from "@/lib/warranty";
import { serviceImages } from "@/lib/serviceImages";

export const metadata: Metadata = {
  title: "iPad Repair Leeds — Screen, Battery & More | Origin Repairs",
  description:
    "iPad screen, battery and charging-port repair estimates in Leeds for visible catalogue models, with part options and repair-specific warranties.",
};

// Representative model for price display on this page
const REPR_MODEL = "iPad Air 5";

function repairPrice(repairTypeIds: string[]): string {
  return getStartingPriceLabel({
    brand: "Apple",
    category: "tablet",
    model: REPR_MODEL,
    repairTypeIds,
  });
}

const repairTypes = [
  {
    name: "Screen / Display Replacement",
    repairKeys: ["display-assembly-replacement", "screen-replacement"],
    desc: "Display options vary by model and are explained before repair.",
    time: "Model and part dependent",
  },
  {
    name: "Battery Replacement",
    repairKeys: ["battery-replacement"],
    desc: "Restore your iPad's battery life. We assess health first and replace only when needed.",
    time: "60–90 minutes",
  },
  {
    name: "Charging Port Repair",
    repairKeys: ["charging-port-replacement", "charging-port-repair"],
    desc: "Faulty USB-C or Lightning port cleaned, repaired, or replaced.",
    time: "60 minutes",
  },
  {
    name: "Camera Repair",
    repairKeys: ["rear-camera-replacement", "camera-repair"],
    desc: "Front or rear camera replaced if damaged or producing poor-quality images.",
    time: "60 minutes",
  },
  {
    name: "Water Damage Assessment",
    repairKeys: ["liquid-damage-diagnostics", "liquid-damage-diagnostic"],
    desc: "Inspection determines whether cleaning, parts or board-level work is appropriate.",
    time: "Assessment required",
  },
  {
    name: "Speaker Repair",
    repairKeys: ["speaker-earpiece-replacement", "speaker-repair"],
    desc: "Speaker or microphone replaced if muffled, quiet, or completely silent.",
    time: "45–90 minutes",
  },
];

const process = [
  { step: 1, title: "Request a time", desc: "Send the model and fault details so the team can confirm the next step." },
  { step: 2, title: "Assessment", desc: "The fault, part option and final price are confirmed before work begins." },
  { step: 3, title: "Repair", desc: "The selected part is installed and the agreed repair is completed." },
  { step: 4, title: "Quality check", desc: "Relevant functions are checked and the repair-specific warranty is confirmed." },
];

const iPadModels = getVisibleModels("Apple", "tablet").filter((model) =>
  model.startsWith("iPad")
);

export default function IPadRepairPage() {
  return (
    <>
      <Navbar />

      <main className="pt-24 pb-24">
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-10 pb-16 border-b border-border">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-primary mb-3">
                iPad Repairs · Leeds
              </p>
              <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-5">
                iPad repair in Leeds city centre.
              </h1>
              <p className="text-[15px] text-muted-foreground leading-relaxed mb-8 max-w-md">
                Screen, battery, charging port, camera and liquid-damage work
                for the models currently listed in our catalogue. Part type,
                price and warranty vary by repair.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild className="btn-primary h-10 rounded-lg px-6 text-[13px]">
                  <Link href="/book" className="flex items-center gap-2">
                    Request iPad Repair <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="rounded-lg h-10 px-6 text-[13px] border-border">
                  <a href={`tel:${BUSINESS.phone}`}>{BUSINESS.phoneDisplay}</a>
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              {/* iPad hero image */}
              <div className="flex items-center justify-center lg:justify-end">
                <div className="relative">
                  <Image
                    src={serviceImages.ipad.src}
                    alt={serviceImages.ipad.alt}
                    width={serviceImages.ipad.width}
                    height={serviceImages.ipad.height}
                    sizes="(min-width: 1024px) 256px, 65vw"
                    className="relative object-contain max-h-64 w-auto drop-shadow-[0_16px_48px_rgba(0,0,0,0.45)]"
                    priority
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Check, title: "Price agreed first", desc: "No repair work starts before approval" },
                { icon: Shield, title: "Repair-specific warranty", desc: "Shown with the selected part option" },
                { icon: Clock, title: "Time estimate", desc: "Confirmed for the selected repair" },
                { icon: MapPin, title: "Leeds City Centre", desc: "76 Cookridge Street" },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="rounded-xl border border-border bg-card p-5">
                  <Icon className="h-4 w-4 text-[color:var(--icon-fg)] mb-2" />
                  <p className="text-[13px] font-semibold text-foreground mb-0.5">{title}</p>
                  <p className="text-[12px] text-muted-foreground">{desc}</p>
                </div>
              ))}
              </div>
            </div>
          </div>
        </section>

        {/* Repair types + prices */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16 border-b border-border">
          <h2 className="text-xl font-semibold mb-2">iPad repairs &amp; pricing</h2>
          <p className="text-[13px] text-muted-foreground mb-8">
            Prices shown are catalogue estimates for an iPad Air 5.
            Device condition, part choice and availability are checked before
            the final quote.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {repairTypes.map(({ name, repairKeys, desc, time }) => {
              const priceDisplay = repairPrice(repairKeys);
              return (
                <div key={name} className="rounded-xl border border-border bg-card p-6 flex flex-col gap-3">
                  <div>
                    <h3 className="text-[14px] font-semibold text-foreground mb-1">{name}</h3>
                    <p className="text-[12px] text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                  <div className="mt-auto pt-3 border-t border-border flex items-center justify-between">
                    <div>
                      <p className="text-[13px] font-semibold text-foreground">{priceDisplay}</p>
                      <p className="text-[11px] text-muted-foreground">{time}</p>
                    </div>
                    <Button asChild size="sm" variant="outline" className="rounded-lg text-[12px] border-border h-8 px-3">
                      <Link href="/book">Request</Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-[12px] text-muted-foreground mt-6">
            * Prices are estimates and may vary after inspection depending on part quality, device condition, and availability.{" "}
            <Link href="/quote" className="text-primary hover:underline">Use the quote calculator</Link> for your exact model.
          </p>
        </section>

        {/* Supported models */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16 border-b border-border">
          <h2 className="text-xl font-semibold mb-6">Supported iPad models</h2>
          <div className="flex flex-wrap gap-2">
            {iPadModels.map((model) => (
              <span key={model} className="px-3 py-1.5 rounded-full border border-border text-[13px] text-muted-foreground">
                {model}
              </span>
            ))}
            <span className="px-3 py-1.5 rounded-full border border-border text-[13px] text-muted-foreground">
              Older models — ask us
            </span>
          </div>
        </section>

        {/* Process */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16 border-b border-border">
          <h2 className="text-xl font-semibold mb-8">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map(({ step, title, desc }) => (
              <div key={step}>
                <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-[12px] font-semibold text-muted-foreground mb-4">
                  {step}
                </div>
                <h3 className="text-[14px] font-semibold text-foreground mb-1">{title}</h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16 border-b border-border">
          <h2 className="text-xl font-semibold mb-8">iPad repair FAQ</h2>
          <div className="space-y-6">
            {[
              {
                q: "Do I need an appointment for iPad repair?",
                a: FEATURES.walkInsEnabled
                  ? "Walk-ins are currently enabled, but contacting the team first is sensible for parts-dependent or complex work."
                  : "Walk-in availability is not currently published. Request a time or contact the team before travelling.",
              },
              {
                q: "Will I lose my data?",
                a: "Back up the device before repair whenever possible. Routine hardware work does not normally require access to personal files, but no repair can guarantee against pre-existing storage failure or data loss.",
              },
              {
                q: "Do you use genuine Apple parts?",
                a: "The quote identifies the available part option. Compatible aftermarket, refurbished original or genuine service parts are only described that way when the catalogue and supply option support the label.",
              },
              {
                q: "What if the repair doesn't fix the problem?",
                a: WARRANTY_NOTICE,
              },
              {
                q: "My iPad got wet — can it be repaired?",
                a: "Power it off and do not charge it. Liquid damage requires inspection, and neither repair nor data recovery can be guaranteed.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="border-b border-border pb-6 last:border-0 last:pb-0">
                <p className="text-[14px] font-semibold text-foreground mb-2">{q}</p>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-3">Request an iPad repair.</h2>
          <p className="text-[15px] text-muted-foreground mb-8 max-w-sm mx-auto">
            Tell us the model and fault so the team can confirm availability
            and the appropriate assessment.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <Button asChild className="btn-primary h-10 rounded-lg px-6 text-[13px]">
              <Link href="/book" className="flex items-center gap-2">
                Request iPad Repair <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-lg h-10 px-6 text-[13px] border-border">
              <a href={`tel:${BUSINESS.phone}`}>Call {BUSINESS.phoneDisplay}</a>
            </Button>
          </div>
          <p className="text-[12px] text-muted-foreground">
            {BUSINESS.address} · Mon–Fri 9am–6pm · Sat 10am–4pm
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}
