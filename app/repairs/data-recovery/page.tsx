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
  title: "Data Recovery Leeds | Phones, SSDs & Hard Drives",
  description:
    "Data recovery in Leeds for phones, tablets, laptops, desktops, SSDs and hard drives. Assessment first, with the recovery route and price agreed before work.",
};

const recoveryTypes = [
  { name: "Phone data recovery", price: getSpecialistPriceLabel("phone", "data-recovery"), time: "2–7 days estimate", note: "Assessment-led recovery for phones that cannot access important data." },
  { name: "Tablet data recovery", price: getSpecialistPriceLabel("tablet", "data-recovery"), time: "2–7 days estimate", note: "For iPad, Galaxy Tab and other tablet storage faults." },
  { name: "Laptop / desktop recovery", price: getSpecialistPriceLabel("laptop", "data-recovery"), time: "3–10 days estimate", note: "Mac, Windows and custom PC storage recovery." },
  { name: "SSD / hard-drive assessment", price: getSpecialistPriceLabel("data-recovery", "data-recovery"), time: "2–10 days estimate", note: "Complex physical media may need a separately quoted specialist laboratory." },
];

const process = [
  { step: "01", title: "Assess the media", body: "We inspect the device or drive and identify the safest recovery route." },
  { step: "02", title: "Consent and scope", body: "Cost, data access and any specialist referral are agreed first." },
  { step: "03", title: "Recovery attempt", body: "Work proceeds within the agreed scope. Recovery outcomes cannot be guaranteed." },
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
            eyebrow="Data recovery · Leeds"
            title="Recover what matters."
            description="Phones, tablets, laptops, desktops, SSDs and hard drives are assessed first. We explain the available recovery route, likely timeframe and cost before work begins."
            features={guarantees}
            image={serviceImages.dataRecovery.src}
            imageAlt={serviceImages.dataRecovery.alt}
            imageWidth={serviceImages.dataRecovery.width}
            imageHeight={serviceImages.dataRecovery.height}
            imageClassName="max-h-[450px] max-w-[540px] sm:scale-105"
            primaryAction={{ label: "Request an Assessment", href: "/contact" }}
            secondaryAction={{ label: "Book a Drop-off", href: "/book" }}
          />

          <div className="border-b border-border py-7">
            <p className="text-sm font-semibold text-foreground">
              Stop using the storage where possible
            </p>
            <p className="mt-1 max-w-3xl text-[13px] leading-5 text-muted-foreground">
              Further use or new writes may reduce recovery chances. Contact the
              team on{" "}
              <a href={BUSINESS.phoneHref} className="text-foreground underline">
                {BUSINESS.phoneDisplay}
              </a>{" "}
              before attempting repairs or recovery software.
            </p>
          </div>

          <ServiceRepairList
            title="Recovery services and pricing"
            description="Recovery is an attempt rather than a guaranteed outcome. The assessment determines the safest available next step."
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
            description="Describe the device or drive, the failure and which data matters so the team can explain the assessment."
            primaryAction={{ label: "Request an Assessment", href: "/contact" }}
            secondaryAction={{ label: "Call the Team", href: BUSINESS.phoneHref }}
          />
        </PageContainer>
      </main>
      <Footer />
    </>
  );
}
