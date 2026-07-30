import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { serviceImages } from "@/lib/serviceImages";
import { getSpecialistPriceLabel } from "@/lib/serviceCatalogue";

export const metadata: Metadata = {
  title: "Custom PC Builds & Upgrades Leeds | Gaming PCs",
  description:
    "Custom gaming PC builds, workstation builds and PC upgrades in Leeds. GPU, RAM, SSD, cooling, cable management, diagnostics and setup.",
};

const services = [
  { name: "Custom PC build labour", price: getSpecialistPriceLabel("desktop", "custom-pc-build"), time: "1–3 days estimate" },
  { name: "GPU / cooling upgrade", price: getSpecialistPriceLabel("desktop", "gpu-cooling-upgrade"), time: "Parts dependent" },
  { name: "SSD / RAM upgrade", price: getSpecialistPriceLabel("desktop", "ssd-ram-upgrade"), time: "Parts dependent" },
  { name: "No-power diagnostic", price: getSpecialistPriceLabel("desktop", "no-power-repair"), time: "Fault dependent" },
  { name: "Software / OS work", price: getSpecialistPriceLabel("desktop", "software-os-issue"), time: "Scope dependent" },
  { name: "Hardware diagnostics", price: getSpecialistPriceLabel("desktop", "hardware-diagnostics"), time: "Assessment required" },
];

const supported = [
  "Gaming PCs",
  "Streaming PCs",
  "Workstation builds",
  "Quiet office PCs",
  "GPU upgrades",
  "CPU / motherboard swaps",
  "RAM and SSD upgrades",
  "AIO and fan cooling",
  "Windows setup",
  "Performance diagnostics",
];

const guarantees = [
  "Clean cable management",
  "Parts checked for compatibility",
  "Thermals and stability tested",
  "Upgrade advice before spending",
  "Data migration available",
  "Fixed quote before work starts",
];

export default function CustomPcPage() {
  return (
    <>
      <Navbar />

      <main className="pt-24 pb-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="pt-10 pb-16 border-b border-border">
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-primary mb-3">
              Custom PC Builds &amp; Upgrades · Leeds
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-5">
                  Clean custom PC builds and sensible upgrades.
                </h1>
                <p className="text-[15px] text-muted-foreground leading-relaxed mb-6 max-w-md">
                  Gaming PCs, workstation builds, GPU upgrades, SSDs, cooling, cable management and Windows setup. We help you spend money where it actually improves performance.
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
                    <Link href="/contact">Plan a PC Build</Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-lg h-10 px-6 text-[13px] border-border hover:bg-muted">
                    <Link href="/book" className="flex items-center gap-2">
                      Book upgrade <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center lg:justify-end">
                <Image
                  src={serviceImages.customPc.src}
                  alt={serviceImages.customPc.alt}
                  width={serviceImages.customPc.width}
                  height={serviceImages.customPc.height}
                  className="relative max-h-80 w-auto object-contain drop-shadow-[0_16px_48px_rgba(0,0,0,0.45)]"
                  priority
                />
              </div>
            </div>
          </div>

          <div className="py-16 border-b border-border">
            <h2 className="text-xl font-semibold mb-8">Builds &amp; upgrade pricing</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden">
              {services.map(({ name, price, time }) => (
                <div key={name} className="bg-card p-5 hover:bg-surface transition-colors">
                  <p className="text-[13px] font-medium text-foreground mb-1">{name}</p>
                  <p className="text-[13px] font-semibold text-primary">{price}</p>
                  <p className="text-[12px] text-muted-foreground mt-0.5">{time}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="py-16 border-b border-border">
            <h2 className="text-xl font-semibold mb-2">What we handle</h2>
            <p className="text-[13px] text-muted-foreground mb-8">
              Bring your parts, ask us to source parts, or come in with a performance problem and we will map the best upgrade path.
              Labour, components and any operating-system licence are quoted
              separately. Manufacturer warranty remains with the component
              supplier; customer-supplied parts are not covered as parts by
              Origin Repairs.
            </p>
            <div className="flex flex-wrap gap-2">
              {supported.map((item) => (
                <span key={item} className="px-3 py-1.5 rounded-full bg-surface border border-border text-[12px] text-foreground">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-16 text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-3">Building or upgrading?</h2>
            <p className="text-[15px] text-muted-foreground mb-8 max-w-sm mx-auto">
              Tell us what you want the PC to do and we will help shape the right parts list.
            </p>
            <Button asChild className="btn-primary h-10 rounded-lg px-8 text-[13px]">
              <Link href="/contact">Start a PC Build</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
