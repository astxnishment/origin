import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { BUSINESS, FEATURES } from "@/lib/constants";
import { WARRANTY_NOTICE } from "@/lib/warranty";

export const metadata: Metadata = {
  title: "About — Leeds Device Repair Specialists",
  description:
    "Learn how Origin Repairs approaches device assessment, repair quotes, parts choices and warranty terms in Leeds.",
};

const values = [
  {
    title: "Clear approval",
    desc: "The proposed work and price are explained before a repair begins.",
  },
  {
    title: "Appropriate repair",
    desc: "The assessment determines whether a component-level repair, replacement part or specialist referral is appropriate.",
  },
  {
    title: "Parts choices",
    desc: "Available compatible, refurbished-original or genuine service-part options are identified accurately before selection.",
  },
  {
    title: "Documented warranty",
    desc: WARRANTY_NOTICE,
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="pt-24 pb-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          {/* Header */}
          <div className="pt-10 pb-16 border-b border-border">
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-primary mb-3">
              About ORIGIN
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">
              <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
                The repair shop that doesn&apos;t feel like one.
              </h1>
              <p className="text-[15px] text-muted-foreground leading-relaxed">
                Origin Repairs is an independent Leeds device-repair business.
                We assess the fault, explain the available repair and part
                options, and agree the price before authorised work begins.
              </p>
            </div>
          </div>

          {/* Story */}
          <div className="py-16 border-b border-border">
            <div className="max-w-3xl space-y-4 text-[15px] text-muted-foreground leading-relaxed">
              <p>
                Our published catalogue covers phones, tablets, laptops, game
                consoles, custom PCs, liquid-damage assessment and data-recovery
                work. Device condition and parts availability can affect the
                final repair plan.
              </p>
              <p>
                Some straightforward repairs can be completed quickly, while
                board-level, liquid-damage and data-recovery work requires
                inspection. The estimate shown with a repair is not presented
                as a guaranteed completion time.
              </p>
              <p>{WARRANTY_NOTICE}</p>
            </div>
          </div>

          {/* Values */}
          <div className="py-16 border-b border-border">
            <h2 className="text-xl font-semibold mb-10">What we stand for</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border rounded-xl overflow-hidden">
              {values.map(({ title, desc }) => (
                <div key={title} className="bg-card p-7 hover:bg-surface transition-colors">
                  <h3 className="text-[14px] font-semibold text-foreground mb-2">{title}</h3>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact details */}
          <div className="py-16 border-b border-border">
            <h2 className="text-xl font-semibold mb-8">Find us</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Location</p>
                <a
                  href={BUSINESS.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-[14px] text-foreground transition-colors hover:text-primary"
                >
                  <address className="not-italic">
                    76 Cookridge Street<br />
                    Leeds, LS2 8GL
                  </address>
                </a>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Hours</p>
                <div className="text-[14px] text-foreground space-y-0.5">
                  <p>Mon–Fri: 9am–6pm</p>
                  <p>Sat: 10am–4pm</p>
                  <p className="text-muted-foreground">Sun: Closed</p>
                </div>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Contact</p>
                <div className="text-[14px] space-y-1">
                  <a href={`tel:${BUSINESS.phone}`} className="block text-foreground hover:text-primary transition-colors">
                    {BUSINESS.phoneDisplay}
                  </a>
                  <a href={`mailto:${BUSINESS.email}`} className="block text-foreground hover:text-primary transition-colors">
                    {BUSINESS.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="pt-16 text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-3">
              Discuss your repair.
            </h2>
            <p className="text-[15px] text-muted-foreground mb-8 max-w-sm mx-auto">
              {FEATURES.walkInsEnabled
                ? "Walk-ins are currently available, or request a time in advance."
                : "Contact us first or send a repair request so we can confirm the next step."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {FEATURES.bookingEnabled && (
                <Button asChild className="btn-primary h-10 rounded-lg px-6 text-[13px]">
                  <Link href="/book">Request a Repair</Link>
                </Button>
              )}
              <Button asChild variant="outline" className="rounded-xl h-10 px-6 text-[13px] border-border hover:bg-muted">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
