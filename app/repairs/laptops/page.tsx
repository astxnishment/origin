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
  getVisibleModels,
} from "@/lib/serviceCatalogue";

export const metadata: Metadata = {
  title: "Laptop Repair Leeds | MacBook, Windows, Gaming Laptops",
  description:
    "All kinds of laptop repair in Leeds: MacBook, Dell, HP, Lenovo, ASUS, Acer, Surface and gaming laptops. Screens, batteries, keyboards, liquid damage and board repair.",
};

const repairTypes = [
  { name: "Screen replacement", price: getStartingPriceLabel({ category: "laptop", repairTypeIds: ["screen-replacement"] }), time: "Model and part dependent" },
  { name: "Battery replacement", price: getStartingPriceLabel({ category: "laptop", repairTypeIds: ["battery-replacement"] }), time: "Model dependent" },
  { name: "Keyboard / trackpad", price: getSpecialistPriceLabel("laptop", "keyboard-trackpad-repair"), time: "1–3 days estimate" },
  { name: "Liquid damage", price: getSpecialistPriceLabel("laptop", "liquid-damage-repair"), time: "2–7 days estimate" },
  { name: "Logic board repair", price: getSpecialistPriceLabel("laptop", "motherboard-logic-board"), time: "2–7 days estimate" },
  { name: "No power repair", price: getSpecialistPriceLabel("laptop", "no-power-repair"), time: "2–7 days estimate" },
  { name: "SSD / RAM upgrade", price: getSpecialistPriceLabel("laptop", "ssd-ram-upgrade"), time: "Parts dependent" },
  { name: "Overheating / fan service", price: getSpecialistPriceLabel("laptop", "overheating-fan-service"), time: "Fault dependent" },
];

const brands = [
  "MacBook Air",
  "MacBook Pro",
  "Dell XPS",
  "Dell Inspiron",
  "HP Spectre",
  "HP Pavilion",
  "Lenovo ThinkPad",
  "Lenovo IdeaPad",
  "Surface Laptop",
  "Surface Pro",
  "ASUS ZenBook",
  "ASUS ROG",
  "Acer Swift",
  "Acer Nitro",
  "MSI Gaming",
  "Razer Blade",
];

const guarantees = [
  "MacBook and Windows laptops",
  "Board-level repairs available",
  "Repair-specific warranty shown",
  "Price agreed before repair",
];

const macbookModels = getVisibleModels("Apple", "laptop");

export default function LaptopRepairsPage() {
  return (
    <>
      <Navbar />
      <main className="pb-16 pt-16 md:pb-24 md:pt-[72px]">
        <PageContainer>
          <ServiceHero
            eyebrow="Laptop repairs · Leeds"
            title="All kinds of laptop repair."
            description="MacBook, Windows, gaming, business and 2-in-1 laptops. Complex faults are assessed and quoted before repair work starts."
            features={guarantees}
            image={serviceImages.macbook.src}
            imageAlt={serviceImages.macbook.alt}
            imageWidth={serviceImages.macbook.width}
            imageHeight={serviceImages.macbook.height}
            imageClassName="max-h-[430px] max-w-[620px]"
            primaryAction={{ label: "Get an Instant Quote", href: "/quote" }}
            secondaryAction={{ label: "Book Laptop Repair", href: "/book" }}
          />

          <div className="border-b border-border py-7">
            <p className="text-sm font-semibold text-foreground">
              Back up before repair
            </p>
            <p className="mt-1 max-w-3xl text-[13px] leading-5 text-muted-foreground">
              Back up important data where possible. Personal file access is
              limited to agreed diagnostic or recovery work and requires
              consent.
            </p>
          </div>

          <ServiceRepairList
            title="Laptop repair pricing"
            description="Parts, labour and repair time depend on the exact laptop and confirmed fault."
            repairs={repairTypes}
          />

          <ServiceTags
            title="Laptop models and ranges"
            description={`${macbookModels.length} MacBook models are published in the quote catalogue, alongside the Windows and gaming ranges below.`}
            items={[...macbookModels, ...brands.filter((item) => !item.startsWith("MacBook"))]}
          />

          <ServiceFinalCTA
            title="Ready to get your laptop fixed?"
            description="Choose your model for an estimate or request an assessment for a complex fault."
            primaryAction={{ label: "Get a Laptop Quote", href: "/quote" }}
            secondaryAction={{ label: "Book a Repair", href: "/book" }}
          />
        </PageContainer>
      </main>
      <Footer />
    </>
  );
}
