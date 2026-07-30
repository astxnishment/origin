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
      <main className="pb-16 pt-16 md:pb-24 md:pt-[72px]">
        <PageContainer>
          <ServiceHero
            eyebrow="Phone repairs · Leeds"
            title="Phone repairs for every major model."
            description="iPhone, Samsung Galaxy, Google Pixel and other Android phones. Screens, batteries, charging ports, liquid damage and board-level faults."
            features={guarantees}
            image={serviceImages.phones.src}
            imageAlt={serviceImages.phones.alt}
            imageWidth={serviceImages.phones.width}
            imageHeight={serviceImages.phones.height}
            imageClassName="max-h-[500px] max-w-[620px]"
            primaryAction={{ label: "Get an Instant Quote", href: "/quote" }}
            secondaryAction={{ label: "Book Phone Repair", href: "/book" }}
          />

          <ServiceRepairList
            title="Phone repair pricing"
            description="Starting prices are shown. The final price depends on the model, selected part and confirmed fault."
            repairs={repairTypes}
          />

          <ServiceTags title="Brands we repair" items={brands} />

          <ServiceFinalCTA
            title="Not sure what phone or fault you have?"
            description="Send the model and fault symptoms so the team can confirm the right assessment."
            primaryAction={{ label: "Ask for a Quote", href: "/contact" }}
            secondaryAction={{ label: "Book a Repair", href: "/book" }}
          />
        </PageContainer>
      </main>
      <Footer />
    </>
  );
}
