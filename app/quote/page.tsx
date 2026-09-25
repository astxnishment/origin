import { pageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FullCalculator from "@/components/FullCalculator";
import {
  PageContainer,
  PageIntro,
} from "@/components/layout/PageContainer";

export const metadata: Metadata = pageMetadata("/quote", {
  title: "Repair Quote — Leeds",
  description:
    "Get an estimate for phone, tablet, laptop, console, custom PC, liquid damage, motherboard and data recovery work in Leeds.",
});

export default async function QuotePage({ searchParams }: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const singleValue = (key: string) => typeof params[key] === "string" ? params[key] : undefined;
  const prefill = {
    device: singleValue("device"),
    brand: singleValue("brand"),
    category: singleValue("category"),
    repair: singleValue("repair"),
  };
  return (
    <>
      <Navbar />

      <main id="main-content" tabIndex={-1} className="min-h-screen pb-16 pt-16 md:pb-24 md:pt-[72px]">
        <PageContainer>
          <PageIntro
            eyebrow="Repair quote"
            title="Tell us what's broken."
            description="Phones, tablets, laptops, consoles, custom PCs, liquid damage, data recovery and board-level work. Choose a device for an estimate."
          />

          <div className="py-8 sm:py-12">
            <FullCalculator key={JSON.stringify(prefill)} prefill={prefill} />
          </div>
        </PageContainer>
      </main>

      <Footer />
    </>
  );
}
