import type { Metadata } from "next";
import Image from "next/image";
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
  title: "Console Repair Leeds | PlayStation, Xbox, Nintendo",
  description:
    "Game console repair in Leeds for PlayStation, Xbox, Nintendo Switch and handheld consoles. HDMI ports, no power, overheating, liquid damage and board-level repair.",
};

const repairTypes = [
  { name: "HDMI port repair", price: getSpecialistPriceLabel("console", "hdmi-port-repair"), time: "1–3 days estimate" },
  { name: "USB-C / charging port", price: getSpecialistPriceLabel("console", "charging-port"), time: "1–3 days estimate" },
  { name: "No power repair", price: getSpecialistPriceLabel("console", "no-power-repair"), time: "1–5 days estimate" },
  { name: "Overheating / fan service", price: getSpecialistPriceLabel("console", "overheating-fan-service"), time: "Fault dependent" },
  { name: "Liquid damage repair", price: getSpecialistPriceLabel("console", "liquid-damage-repair"), time: "Assessment required" },
  { name: "Board-level repair", price: getSpecialistPriceLabel("console", "motherboard-logic-board"), time: "1–5 days estimate" },
  { name: "Software / update issue", price: getSpecialistPriceLabel("console", "software-os-issue"), time: "Scope dependent" },
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
  { name: "PlayStation", note: "PS5 and PS4", image: serviceImages.playstation },
  { name: "Xbox", note: "Series X/S and Xbox One", image: serviceImages.xbox },
  { name: "Nintendo Switch", note: "Switch, OLED and Lite", image: serviceImages.nintendoSwitch },
];

const guarantees = [
  "HDMI and USB-C port repair",
  "No power and board-level faults",
  "Overheating and fan service",
  "Liquid damage assessment",
];

export default function ConsoleRepairsPage() {
  return (
    <>
      <Navbar />
      <main className="pb-16 pt-16 md:pb-24 md:pt-[72px]">
        <PageContainer>
          <ServiceHero
            eyebrow="Console repairs · Leeds"
            title="PlayStation, Xbox and Nintendo repair."
            description="HDMI faults, no power, overheating, storage upgrades, liquid damage and board-level repairs, inspected and quoted before work starts."
            features={guarantees}
            image={serviceImages.console.src}
            imageAlt={serviceImages.console.alt}
            imageWidth={serviceImages.console.width}
            imageHeight={serviceImages.console.height}
            imageClassName="max-h-[450px] max-w-[620px]"
            primaryAction={{ label: "Get a Console Quote", href: "/quote" }}
            secondaryAction={{ label: "Book Console Repair", href: "/book" }}
          />

          <section className="section-compact border-b border-border">
            <h2 className="section-title text-[clamp(1.5rem,2.2vw,2rem)]">
              Console families
            </h2>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {consoleFamilies.map(({ name, note, image }) => (
                <div
                  key={name}
                  className="interactive-card flex min-h-52 flex-col items-center justify-between p-5 text-center"
                >
                  <div className="flex h-32 w-full items-center justify-center">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={image.width}
                      height={image.height}
                      sizes="(max-width: 639px) 200px, 28vw"
                      className="max-h-32 max-w-[90%] object-contain drop-shadow-[0_16px_32px_rgba(0,0,0,0.25)]"
                    />
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold">{name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{note}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <ServiceRepairList
            title="Console repair pricing"
            description="Complex power, liquid and board-level faults are assessed before a final price is agreed."
            repairs={repairTypes}
          />

          <ServiceTags
            title="Consoles supported"
            description="Ask about other modern consoles and handheld gaming devices even when they are not listed."
            items={consoles}
          />

          <ServiceFinalCTA
            title="Get the console assessed."
            description="Tell us the model and symptoms so we can confirm the likely diagnostic and repair route."
            primaryAction={{ label: "Ask About a Fault", href: "/contact" }}
            secondaryAction={{ label: "Book a Repair", href: "/book" }}
          />
        </PageContainer>
      </main>
      <Footer />
    </>
  );
}
