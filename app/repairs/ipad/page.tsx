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
import { FEATURES } from "@/lib/constants";
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
  { name: "Screen / display replacement", repairKeys: ["display-assembly-replacement", "screen-replacement"], time: "Model and part dependent", note: "Display options vary by model and are explained before repair." },
  { name: "Battery replacement", repairKeys: ["battery-replacement"], time: "60–90 minutes", note: "Battery health is assessed before replacement." },
  { name: "Charging port repair", repairKeys: ["charging-port-replacement", "charging-port-repair"], time: "About 60 minutes", note: "USB-C or Lightning faults are assessed first." },
  { name: "Camera repair", repairKeys: ["rear-camera-replacement", "camera-repair"], time: "About 60 minutes", note: "Front or rear camera repair where supported." },
  { name: "Liquid damage assessment", repairKeys: ["liquid-damage-diagnostics", "liquid-damage-diagnostic"], time: "Assessment required", note: "Inspection determines cleaning, parts or board-level work." },
  { name: "Speaker repair", repairKeys: ["speaker-earpiece-replacement", "speaker-repair"], time: "45–90 minutes", note: "Speaker and microphone faults are confirmed first." },
].map((repair) => ({
  name: repair.name,
  time: repair.time,
  note: repair.note,
  price: repairPrice(repair.repairKeys),
}));

const process = [
  { step: "01", title: "Request", body: "Send the model and fault details." },
  { step: "02", title: "Assess", body: "We confirm the fault, part and price." },
  { step: "03", title: "Repair", body: "The approved work is completed." },
  { step: "04", title: "Check", body: "Relevant functions and warranty are confirmed." },
];

const iPadModels = getVisibleModels("Apple", "tablet").filter((model) =>
  model.startsWith("iPad")
);

const guarantees = [
  "Price agreed before repair",
  "Part options explained first",
  "Repair-specific warranty shown",
  "Leeds drop-off and mail-in",
];

const faqs = [
  {
    q: "Do I need an appointment for iPad repair?",
    a: FEATURES.walkInsEnabled
      ? "Walk-ins are enabled, but contacting the team first is sensible for parts-dependent or complex work."
      : "Walk-in availability is not currently published. Request a time or contact the team before travelling.",
  },
  {
    q: "Will I lose my data?",
    a: "Back up the device before repair whenever possible. Routine hardware work does not normally require access to personal files.",
  },
  {
    q: "Do you use genuine Apple parts?",
    a: "The quote identifies the available compatible, refurbished-original or genuine service-part option where supported.",
  },
  {
    q: "What if the repair does not fix the problem?",
    a: WARRANTY_NOTICE,
  },
  {
    q: "My iPad got wet. Can it be repaired?",
    a: "Power it off and do not charge it. Liquid damage requires inspection, and neither repair nor data recovery can be guaranteed.",
  },
];

export default function IPadRepairPage() {
  return (
    <>
      <Navbar />
      <main className="pb-16 pt-16 md:pb-24 md:pt-[72px]">
        <PageContainer>
          <ServiceHero
            eyebrow="iPad repairs · Leeds"
            title="iPad repair, clearly quoted."
            description="Screen, battery, charging port, camera and liquid-damage work for the models in our catalogue, with the part type, price and warranty shown before approval."
            features={guarantees}
            image={serviceImages.ipad.src}
            imageAlt={serviceImages.ipad.alt}
            imageWidth={serviceImages.ipad.width}
            imageHeight={serviceImages.ipad.height}
            imageClassName="max-h-[470px] max-w-[590px]"
            primaryAction={{ label: "Get an iPad Quote", href: "/quote" }}
            secondaryAction={{ label: "Book iPad Repair", href: "/book" }}
          />

          <ServiceRepairList
            title="iPad repair pricing"
            description="These catalogue estimates use an iPad Air 5 as a representative model. Select your exact model for current part options."
            repairs={repairTypes}
          />

          <ServiceTags
            title="Supported iPad models"
            items={[...iPadModels, "Older models — ask us"]}
          />

          <section className="section-standard border-b border-border">
            <h2 className="section-title">How it works.</h2>
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

          <section className="section-compact border-b border-border">
            <h2 className="section-title text-[clamp(1.5rem,2.2vw,2rem)]">
              iPad repair questions
            </h2>
            <div className="mt-8 divide-y divide-border border-y border-border">
              {faqs.map((item) => (
                <div
                  key={item.q}
                  className="grid gap-2 py-5 md:grid-cols-[0.8fr_1.2fr] md:gap-10"
                >
                  <h3 className="text-[14px] font-semibold">{item.q}</h3>
                  <p className="text-[13px] leading-5 text-muted-foreground">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <ServiceFinalCTA
            title="Request an iPad repair."
            description="Tell us the model and fault so the team can confirm availability and the right assessment."
            primaryAction={{ label: "Get an iPad Quote", href: "/quote" }}
            secondaryAction={{ label: "Book a Repair", href: "/book" }}
          />
        </PageContainer>
      </main>
      <Footer />
    </>
  );
}
