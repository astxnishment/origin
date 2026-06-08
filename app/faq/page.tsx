import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { BUSINESS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Origin Repairs Leeds",
  description:
    "Common questions about device repairs at Origin Repairs. Pricing, warranty, turnaround times, walk-ins, data safety, and what to expect at our Leeds repair shop.",
};

const categories = [
  {
    name: "Booking & Appointments",
    faqs: [
      {
        q: "Do I need an appointment?",
        a: "Walk-ins are welcome for most repairs — screen replacements, battery swaps, charging ports, and general diagnostics. For MacBook repairs and data recovery, calling or booking ahead ensures a technician has the right parts ready and enough time set aside for you.",
      },
      {
        q: "How do I book?",
        a: "You can book online at originrepairs.co.uk/book, call us on 07768 426754, or simply walk in to 76 Cookridge Street, Leeds during opening hours. We'll confirm your slot by email within the hour.",
      },
      {
        q: "Can I get a quote without booking?",
        a: "Yes. Use the instant quote calculator at originrepairs.co.uk/quote for an estimate, or email tech@originrepairs.co.uk with your device details. The calculator gives a realistic price range — the exact figure is confirmed after a free assessment of your device.",
      },
      {
        q: "What if I need to reschedule?",
        a: "No problem at all. Call us on 07768 426754 and we'll move your appointment. There are no cancellation fees or penalties — we just ask for a bit of notice so we can offer the slot to someone else.",
      },
    ],
  },
  {
    name: "Repairs & Parts",
    faqs: [
      {
        q: "How long do repairs take?",
        a: "Most screen replacements take 45–60 minutes. Battery replacements are typically 30 minutes. Charging port repairs and camera work are usually done within an hour. Water damage and data recovery take longer — typically 24–48 hours — because they need careful drying and component-level diagnosis. We give you an estimated time when you bring the device in.",
      },
      {
        q: "Do you use genuine parts?",
        a: "We use OEM-grade components that meet manufacturer quality standards. For most repairs this means high-quality aftermarket parts that match the original in brightness, colour accuracy, and durability. For some repairs we can source official Apple or Samsung parts — just ask when you book and we'll advise on availability and any price difference.",
      },
      {
        q: "Can you fix water-damaged devices?",
        a: "Yes. Bring the device in as soon as possible — do not try to charge it. We use specialist equipment to dry and clean the internals, then diagnose which components have been affected. We'll assess it for free and explain your options honestly before any work begins. Success depends on how long the device was submerged and the severity of corrosion.",
      },
      {
        q: "Is my data safe during repair?",
        a: "Completely. We do not access, copy, or transfer your personal files during any repair. For laptop and data recovery jobs, we'll always advise you to back up beforehand if at all possible. We handle every device as if it contained private information — because it does.",
      },
      {
        q: "What if you cannot fix my device?",
        a: "We'll tell you honestly. There is no charge for a diagnostic assessment if we cannot carry out a repair. We'll explain what we found, what options exist — including manufacturer repair or replacement — and return your device in the same condition it arrived.",
      },
    ],
  },
  {
    name: "Warranty",
    faqs: [
      {
        q: "What warranty do you offer?",
        a: "Every eligible repair includes a 12-month warranty on both parts and labour. If a fault related to our repair work reappears within 12 months, we'll fix it free of charge — no questions asked.",
      },
      {
        q: "What does the warranty cover?",
        a: "The warranty covers the specific repair we carried out and the parts we installed. If the screen we fitted develops a fault, or the battery we replaced fails prematurely due to a defect, that's covered. It does not cover new accidental damage (drops, liquid) after the repair, or faults unrelated to our work.",
      },
      {
        q: "Does the warranty cover accidental damage after the repair?",
        a: "No. If you drop the phone and crack the new screen, that's a new repair — not a warranty claim. The warranty covers failure of our repair work or the parts we supplied. It does not cover physical damage caused after leaving the shop.",
      },
    ],
  },
  {
    name: "Pricing",
    faqs: [
      {
        q: "How much does a repair cost?",
        a: "Prices depend on the device and repair type. As a guide: iPhone screen replacements start from around £75 for older models and go up to £250 for the latest Pro models. Samsung screen repairs range from around £60 to £190. Battery replacements are typically £40–£90. Use the quote calculator for your specific device, or walk in for a free assessment.",
      },
      {
        q: "Are there hidden charges?",
        a: "Never. We agree a fixed price with you before any work starts. The price we quote is the price you pay — no assembly fees, no diagnostic charges (unless you decline the repair on a device that needs extended bench time), no surprises.",
      },
      {
        q: "Why is it cheaper than going to Apple or Samsung?",
        a: "Manufacturer repair centres and authorised service providers charge premium rates that include large overheads and brand margins. We use OEM-grade parts at fairer prices, with lower overheads as a local business. You get the same quality repair at a significantly lower cost.",
      },
      {
        q: "Do you charge for the initial assessment?",
        a: "No. We assess your device for free and tell you exactly what needs fixing and what it will cost — before you commit to anything. If you decide not to proceed, you walk away without paying a penny.",
      },
    ],
  },
  {
    name: "Location & Hours",
    faqs: [
      {
        q: "Where are you located?",
        a: "We're at 76 Cookridge Street, Leeds, LS2 8GL — in Leeds city centre, a short walk from Leeds Train Station and easy to reach from Headingley, Hyde Park, Woodhouse, Burley, Chapel Allerton, and across the LS postcodes.",
      },
      {
        q: "What are your opening hours?",
        a: "Monday to Friday: 9am–6pm. Saturday: 10am–4pm. Sunday: Closed. We're usually open on bank holidays but call ahead to check.",
      },
      {
        q: "Is there parking nearby?",
        a: "Yes. There is street parking available on Cookridge Street and surrounding roads. The Light shopping centre car park is a 3-minute walk and has good rates. We're also directly accessible by bus, and Leeds Train Station is about a 10-minute walk.",
      },
    ],
  },
];

// Build JSON-LD FAQ schema from the same data
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: categories.flatMap(({ faqs }) =>
    faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    }))
  ),
};

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Navbar />

      <main className="pt-24 pb-24">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          {/* Header */}
          <div className="pt-10 pb-14 border-b border-border">
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-primary mb-3">
              FAQ
            </p>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-5 max-w-lg">
              Questions answered.
            </h1>
            <p className="text-[15px] text-muted-foreground max-w-md">
              Everything you need to know about repairs at Origin. Can&apos;t find what you&apos;re
              looking for?{" "}
              <a href={`tel:${BUSINESS.phone}`} className="text-primary hover:underline">
                Call us
              </a>
              .
            </p>
          </div>

          {/* FAQ sections — <details>/<summary> works without JS and renders answers in HTML */}
          <div className="py-14 space-y-14">
            {categories.map(({ name, faqs }) => (
              <section key={name}>
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-6">
                  {name}
                </h2>

                <div className="space-y-0 divide-y divide-border border-t border-border">
                  {faqs.map(({ q, a }) => (
                    <details
                      key={q}
                      className="group py-0"
                    >
                      <summary className="flex items-center justify-between gap-4 py-4 cursor-pointer list-none select-none hover:text-primary transition-colors">
                        <span className="text-[14px] font-medium text-foreground group-hover:text-primary transition-colors">
                          {q}
                        </span>
                        {/* Chevron — rotates open/closed via CSS */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                          className="h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </summary>
                      <div className="pb-5 pr-8">
                        <p className="text-[13px] text-muted-foreground leading-relaxed">{a}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Still have questions */}
          <div className="border-t border-border pt-14 text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-3">Still have questions?</h2>
            <p className="text-[15px] text-muted-foreground mb-8 max-w-sm mx-auto">
              Get in touch — we&apos;re happy to answer before you book.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                asChild
                className="bg-primary hover:bg-primary/90 text-white rounded-xl h-10 px-6 text-[13px]"
              >
                <Link href="/contact">Send a message</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-xl h-10 px-6 text-[13px] border-border hover:bg-muted"
              >
                <a href={`tel:${BUSINESS.phone}`}>Call {BUSINESS.phoneDisplay}</a>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
