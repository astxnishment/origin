import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PageContainer } from "@/components/layout/PageContainer";
import {
  ServiceFinalCTA,
  ServiceHero,
  ServiceRepairList,
  ServiceTags,
} from "@/components/layout/ServicePage";
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
];

export default function CustomPcPage() {
  return (
    <>
      <Navbar />
      <main className="pb-16 pt-16 md:pb-24 md:pt-[72px]">
        <PageContainer>
          <ServiceHero
            eyebrow="Custom PCs · Leeds"
            title="Clean builds. Sensible upgrades."
            description="Gaming PCs, workstations, GPU upgrades, SSDs, cooling, cable management and Windows setup, planned around the performance you actually need."
            features={guarantees}
            image={serviceImages.customPc.src}
            imageAlt={serviceImages.customPc.alt}
            imageWidth={serviceImages.customPc.width}
            imageHeight={serviceImages.customPc.height}
            imageClassName="max-h-[500px] max-w-[500px]"
            primaryAction={{ label: "Plan a PC Build", href: "/contact" }}
            secondaryAction={{ label: "Book an Upgrade", href: "/book" }}
          />

          <ServiceRepairList
            title="Build and upgrade pricing"
            description="Labour, components and any operating-system licence are quoted separately."
            repairs={services}
          />

          <ServiceTags
            title="What we handle"
            description="Bring your own parts, ask us to source them, or describe the performance problem and we will map the most sensible route."
            items={supported}
          />

          <ServiceFinalCTA
            title="Building or upgrading?"
            description="Tell us what the PC needs to do and we will help shape the right parts list."
            primaryAction={{ label: "Start a PC Build", href: "/contact" }}
            secondaryAction={{ label: "Book an Upgrade", href: "/book" }}
          />
        </PageContainer>
      </main>
      <Footer />
    </>
  );
}
