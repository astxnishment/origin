import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Common questions about device repairs at Origin Repairs. Pricing, warranty, turnaround times, and what to expect at our Leeds repair shop.",
};
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BUSINESS } from "@/lib/constants";

const categories = [
  {
    name: "Booking",
    faqs: [
      { q: "Do I need an appointment?", a: "Walk-ins are welcome for most repairs. For MacBooks and data recovery, booking ahead ensures a technician is ready for you." },
      { q: "How do I book?", a: "Book online at /book, call us on 07768426754, or simply walk in to 76 Cookridge Street, Leeds." },
      { q: "Can I get a quote without booking?", a: "Yes. Use the instant quote calculator at /quote, or email tech@originrepairs.co.uk with your device details." },
      { q: "What if I need to reschedule?", a: "No problem. Call us and we'll move your appointment. No penalties, no questions asked." },
    ],
  },
  {
    name: "Repairs",
    faqs: [
      { q: "How long do repairs take?", a: "Most screen and battery repairs take 30–60 minutes. Water damage and data recovery take 24–48 hours. We give you an exact time when you book." },
      { q: "Do you use genuine parts?", a: "We use OEM-grade components that meet manufacturer standards. For premium models, we source official parts where possible." },
      { q: "Can you fix water-damaged devices?", a: "Yes. We have specialist equipment for liquid damage recovery. Success depends on severity — we assess for free and explain your options honestly." },
      { q: "Is my data safe?", a: "Always. We never access your personal files. For laptop repairs, we advise on backup options before starting any work." },
    ],
  },
  {
    name: "Warranty",
    faqs: [
      { q: "What warranty do you offer?", a: "Every repair includes a 12-month warranty on parts and labour. If something fails because of our work, we fix it — free, no questions asked." },
      { q: "What if the repair doesn't work?", a: "We'll fix it free under warranty. No conditions, no fine print." },
      { q: "Does the warranty cover accidental damage?", a: "No — the warranty covers failure of our repair work and parts. Accidental damage after leaving the shop isn't covered." },
    ],
  },
  {
    name: "Pricing",
    faqs: [
      { q: "How much does a repair cost?", a: "Prices vary by device and repair type. iPhone screens from £49, Samsung batteries from £45, MacBook repairs from £99. See the pricing page for the full list." },
      { q: "Are there hidden charges?", a: "Never. We give a fixed quote before starting. No diagnostic fees, no assembly charges, no surprises." },
      { q: "Why is it cheaper than Apple or Samsung?", a: "We use OEM-grade parts at fair margins. Same quality — without manufacturer pricing." },
    ],
  },
  {
    name: "Location",
    faqs: [
      { q: "Where are you?", a: `${BUSINESS.address}. We're in Leeds city centre — easy to reach by foot, car, or public transport.` },
      { q: "What are your opening hours?", a: "Mon–Fri: 9am–6pm. Saturday: 10am–4pm. Sunday: Closed." },
      { q: "Is there parking nearby?", a: "Yes. There's street parking on Cookridge Street and a car park at The Light shopping centre a few minutes away." },
    ],
  },
];

export default function FAQPage() {
  return (
    <>
      <Navbar />

      <main className="pt-24 pb-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          {/* Header */}
          <div className="pt-10 pb-16 border-b border-border">
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-primary mb-3">
              FAQ
            </p>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-5 max-w-lg">
              Questions answered.
            </h1>
            <p className="text-[15px] text-muted-foreground max-w-md">
              Everything you need to know about repairs at ORIGIN.
            </p>
          </div>

          {/* FAQ sections */}
          <div className="py-16 space-y-16">
            {categories.map(({ name, faqs }) => (
              <section key={name}>
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-6">
                  {name}
                </h2>
                <Accordion type="single" collapsible className="space-y-0">
                  {faqs.map(({ q, a }, idx) => (
                    <AccordionItem
                      key={q}
                      value={`${name}-${idx}`}
                      className="border-b border-border last:border-0"
                    >
                      <AccordionTrigger className="text-[14px] font-medium text-foreground hover:text-primary text-left py-4">
                        {q}
                      </AccordionTrigger>
                      <AccordionContent className="text-[13px] text-muted-foreground leading-relaxed pb-4">
                        {a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            ))}
          </div>

          {/* Still have questions */}
          <div className="border-t border-border pt-16 text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-3">Still have questions?</h2>
            <p className="text-[15px] text-muted-foreground mb-8 max-w-sm mx-auto">
              Get in touch — we&apos;re happy to help before you book.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-xl h-10 px-6 text-[13px]">
                <Link href="/contact">Contact Us</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl h-10 px-6 text-[13px] border-border hover:bg-muted">
                <a href={`tel:${BUSINESS.phone}`}>{BUSINESS.phone}</a>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
