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
  title: "Liquid Damage & Data Recovery Leeds | Phones, Laptops, Consoles",
  description:
    "Liquid damage repair and data recovery in Leeds for phones, tablets, laptops, consoles, SSDs and hard drives. Assessment first, fixed quote before work.",
};

const recoveryTypes = [
  { name: "Liquid-damage diagnostic", price: "Assessment required", time: "Condition dependent", note: "Inspection separates cleaning, parts and board-level work." },
  { name: "Logical data recovery", price: getSpecialistPriceLabel("data-recovery", "data-recovery"), time: "2–10 days estimate", note: "File-system and software-level recovery attempts." },
  { name: "Device board recovery", price: getSpecialistPriceLabel("phone", "data-recovery"), time: "2–7 days estimate", note: "Assessment-led work for a device that does not power on." },
  { name: "Drive assessment", price: getSpecialistPriceLabel("data-recovery", "data-recovery"), time: "Media dependent", note: "SSD, hard-drive and removable-media condition is checked first." },
  { name: "Specialist laboratory referral", price: "Quoted by specialist", time: "Confirmed after assessment", note: "Physical drive or complex media work may require a specialist." },
];

const process = [
  { step: "01", title: "Assessment first", body: "We evaluate the damage and explain the likely recovery route." },
  { step: "02", title: "Consent and scope", body: "Cost, data access and any specialist referral are agreed first." },
  { step: "03", title: "Recovery attempt", body: "Work proceeds within the agreed scope; no outcome is promised." },
  { step: "04", title: "Transfer or return", body: "Recovered data and return arrangements are agreed with you." },
];

const guarantees = [
  "Assessment before recovery work",
  "Data access requires consent",
  "Price agreed before work",
  "Specialist referral explained first",
];

export default function DataRecoveryPage() {
  return (
    <>
      <Navbar />
      <main className="pb-16 pt-16 md:pb-24 md:pt-[72px]">
        <PageContainer>
          <ServiceHero
            eyebrow="Liquid damage & data recovery · Leeds"
            title="Assessment before recovery."
            description="Phones, tablets, laptops, consoles, SSDs and hard drives are inspected first. Some need cleaning, some need parts and some need board-level recovery."
            features={guarantees}
            image={serviceImages.dataRecoveryLiquidDamage.src}
            imageAlt={serviceImages.dataRecoveryLiquidDamage.alt}
            imageWidth={serviceImages.dataRecoveryLiquidDamage.width}
            imageHeight={serviceImages.dataRecoveryLiquidDamage.height}
            imageClassName="max-h-[470px] max-w-[520px] scale-110"
            primaryAction={{ label: "Request an Assessment", href: "/contact" }}
            secondaryAction={{ label: "Book a Drop-off", href: "/book" }}
          />

          <div className="border-b border-border py-7">
            <p className="text-sm font-semibold text-foreground">
              Power the device down where safe
            </p>
            <p className="mt-1 max-w-3xl text-[13px] leading-5 text-muted-foreground">
              Further use or writes may reduce recovery chances. Contact the
              team on{" "}
              <a href={BUSINESS.phoneHref} className="text-foreground underline">
                {BUSINESS.phoneDisplay}
              </a>{" "}
              before attempting another repair.
            </p>
          </div>

          <ServiceRepairList
            title="Recovery services and pricing"
            description="Recovery is an attempt rather than a guaranteed outcome. The assessment determines the safest next step."
            repairs={recoveryTypes}
          />

          <section className="section-standard border-b border-border">
            <h2 className="section-title">The recovery process.</h2>
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
            title="Tell us what happened."
            description="Describe the device, the failure and which data matters so the team can explain the assessment."
            primaryAction={{ label: "Request an Assessment", href: "/contact" }}
            secondaryAction={{ label: "Call the Team", href: BUSINESS.phoneHref }}
          />
        </PageContainer>
      </main>
      <Footer />
    </>
  );
}
