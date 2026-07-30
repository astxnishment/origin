import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FullCalculator from "@/components/FullCalculator";
import {
  PageContainer,
  PageIntro,
} from "@/components/layout/PageContainer";

export const metadata: Metadata = {
  title: "Repair Quote — Leeds",
  description:
    "Get an estimate for phone, tablet, laptop, console, custom PC, liquid damage, motherboard and data recovery work in Leeds.",
};

export default function QuotePage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen pb-16 pt-16 md:pb-24 md:pt-[72px]">
        <PageContainer>
          <PageIntro
            eyebrow="Repair quote"
            title="Tell us what's broken."
            description="Phones, tablets, laptops, consoles, custom PCs, liquid damage, data recovery and board-level work. Choose a device for an estimate."
          />

          <div className="py-8 sm:py-12">
            <Suspense fallback={null}>
              <FullCalculator />
            </Suspense>
          </div>
        </PageContainer>
      </main>

      <Footer />
    </>
  );
}
