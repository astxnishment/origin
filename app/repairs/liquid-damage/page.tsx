import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PageContainer } from "@/components/layout/PageContainer";
import {
  ServiceFinalCTA,
  ServiceHero,
  ServiceRepairList,
} from "@/components/layout/ServicePage";
import { serviceImages } from "@/lib/serviceImages";
import { getSpecialistPriceLabel } from "@/lib/serviceCatalogue";
import { BUSINESS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Liquid Damage Repair Leeds | Phones, Laptops, Consoles & PCs",
  description:
    "Liquid damage repair in Leeds for phones, tablets, laptops, consoles and custom PCs. Internal assessment, corrosion cleaning and board-level repair available.",
};

const liquidRepairs = [
  { name: "Phone liquid damage", price: getSpecialistPriceLabel("phone", "liquid-damage-repair"), time: "1–5 days estimate", note: "Internal inspection, cleaning and repair options for all phone brands." },
  { name: "Tablet liquid damage", price: getSpecialistPriceLabel("tablet", "liquid-damage-repair"), time: "1–5 days estimate", note: "iPad, Galaxy Tab and other tablets." },
  { name: "Laptop liquid damage", price: getSpecialistPriceLabel("laptop", "liquid-damage-repair"), time: "2–7 days estimate", note: "MacBook, Windows, gaming and business laptops." },
  { name: "Console liquid damage", price: getSpecialistPriceLabel("console", "liquid-damage-repair"), time: "1–5 days estimate", note: "PlayStation, Xbox, Nintendo Switch and handhelds." },
  { name: "Desktop / custom PC", price: getSpecialistPriceLabel("desktop", "liquid-damage-repair"), time: "2–7 days estimate", note: "Internal cleaning and component-level assessment for desktop systems." },
  { name: "Corrosion / board-level repair", price: "Assessment required", time: "Condition dependent", note: "The quote reflects the cleaning, components and board work actually required." },
];

const process = [
  { step: "01", title: "Power it down", body: "Disconnect power where it is safe to do so and avoid charging the device." },
  { step: "02", title: "Internal assessment", body: "We inspect the device for liquid paths, residue, corrosion and damaged components." },
  { step: "03", title: "Quote and consent", body: "Cleaning, parts and board-level work are itemised and agreed before repair." },
  { step: "04", title: "Clean and repair", body: "Approved work is completed, tested and explained when the device is returned." },
];

const features = [
  "All device families and liquid types",
  "Internal corrosion inspection",
  "Board-level repair available",
  "Quote agreed before work",
];

export default function LiquidDamagePage() {
  return (
    <>
      <Navbar />
      <main className="pb-16 pt-16 md:pb-24 md:pt-[72px]">
        <PageContainer>
          <ServiceHero
            eyebrow="Liquid damage repair · Leeds"
            title="Power it down. Bring it in."
            description="We assess liquid-damaged phones, tablets, laptops, consoles and custom PCs. The inspection determines whether the device needs cleaning, replacement parts or board-level repair."
            features={features}
            image={serviceImages.liquidDamage.src}
            imageAlt={serviceImages.liquidDamage.alt}
            imageWidth={serviceImages.liquidDamage.width}
            imageHeight={serviceImages.liquidDamage.height}
            imageClassName="max-h-[470px] max-w-[560px] sm:scale-105"
            primaryAction={{ label: "Request an Assessment", href: "/contact" }}
            secondaryAction={{ label: "Book a Drop-off", href: "/book" }}
          />

          <div className="border-b border-border py-7">
            <p className="text-sm font-semibold text-foreground">
              Do not charge or power the device on
            </p>
            <p className="mt-1 max-w-3xl text-[13px] leading-5 text-muted-foreground">
              Disconnect power where safe, avoid heat and do not put the device
              in rice. Call the team on{" "}
              <a href={BUSINESS.phoneHref} className="text-foreground underline">
                {BUSINESS.phoneDisplay}
              </a>{" "}
              for the quickest next step.
            </p>
          </div>

          <ServiceRepairList
            title="Liquid damage services and pricing"
            description="Liquid can affect several areas at once. We inspect the internal condition first and confirm the repair scope before work begins."
            repairs={liquidRepairs}
          />

          <section className="section-standard border-b border-border">
            <h2 className="section-title">The liquid damage process.</h2>
            <div className="mt-8 grid border-y border-border md:grid-cols-4">
              {process.map((item, index) => (
                <div
                  key={item.step}
                  className={`py-6 md:px-5 ${
                    index > 0
                      ? "border-t border-border md:border-l md:border-t-0"
                      : ""
                  }`}
                >
                  <p className="font-mono text-xs text-muted-foreground">
                    {item.step}
                  </p>
                  <h3 className="mt-5 text-base font-semibold">{item.title}</h3>
                  <p className="mt-2 text-[13px] leading-5 text-muted-foreground">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <ServiceFinalCTA
            title="Tell us what was spilled."
            description="Let us know the device, liquid involved and when it happened so the team can arrange the right assessment."
            primaryAction={{ label: "Request an Assessment", href: "/contact" }}
            secondaryAction={{ label: "Call the Team", href: BUSINESS.phoneHref }}
          />
        </PageContainer>
      </main>
      <Footer />
    </>
  );
}
