import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BUSINESS, FAQS } from "@/lib/constants";

const categories = [
  {
    name: "Booking & Appointments",
    faqs: [
      {
        q: "Do I need an appointment?",
        a: "Walk-ins welcome! For complex repairs (MacBooks, data recovery), booking ahead ensures a technician is available.",
      },
      {
        q: "How do I book a repair?",
        a: "Three ways: (1) Book online at /book, (2) Call us at 07768426754, (3) Walk into our Leeds store.",
      },
      {
        q: "Can I get a quote without booking?",
        a: "Yes—use our instant quote calculator at /quote, or email us at tech@originrepairs.co.uk.",
      },
      {
        q: "What if I need to cancel?",
        a: "No problem. If you need to reschedule, call us or use the booking confirmation email.",
      },
    ],
  },
  {
    name: "Repair Details",
    faqs: [
      {
        q: "How long does repair actually take?",
        a: "Most screen and battery repairs take 30-60 minutes. Water damage and data recovery take 24-48 hours. We'll give you an exact time when you book.",
      },
      {
        q: "Do you use genuine parts?",
        a: "Yes. We use OEM-grade components that meet manufacturer standards. For premium repairs, we source official parts.",
      },
      {
        q: "Can you fix water-damaged devices?",
        a: "We have specialized equipment for liquid damage recovery. Success depends on severity. We assess it free and explain your options.",
      },
      {
        q: "Will my data be safe?",
        a: "Absolutely. We never access your personal files without permission. We only repair what's needed.",
      },
    ],
  },
  {
    name: "Warranty & Support",
    faqs: [
      {
        q: "What warranty do you offer?",
        a: "Every repair includes a 12-month warranty on parts and labour. If anything goes wrong, we fix it free.",
      },
      {
        q: "What if the repair doesn't work?",
        a: "We'll fix it free under warranty. No questions asked. No hidden conditions.",
      },
      {
        q: "Is the warranty really no questions asked?",
        a: "Yes. If our work fails, we stand behind it.",
      },
      {
        q: "Do you offer extended warranty?",
        a: "Not currently, but our 12-month warranty is comprehensive. Contact us if you need something specific.",
      },
    ],
  },
  {
    name: "Pricing",
    faqs: [
      {
        q: "How much does repair cost?",
        a: "Prices vary by device and repair. iPhone screens from £49-£149, Samsung batteries from £45-£65, MacBook repairs from £99-£299. See our pricing page for details.",
      },
      {
        q: "Will there be hidden charges?",
        a: "No. We give a fixed quote before starting. No diagnostics fees, no assembly charges.",
      },
      {
        q: "Can I get a quote before visiting?",
        a: "Yes—use our online quote calculator at /quote, or call us with details of your device.",
      },
      {
        q: "Do you offer student/senior discounts?",
        a: "Not standard discounts, but we're fair on pricing. Ask when you book.",
      },
    ],
  },
  {
    name: "Getting to Us",
    faqs: [
      {
        q: "Where are you located?",
        a: `${BUSINESS.address}, ${BUSINESS.postcode}. We're in Leeds city centre, easy to access by car or public transport.`,
      },
      {
        q: "What are your hours?",
        a: "Mon–Fri: 9am–6pm | Sat: 10am–4pm | Sun: Closed",
      },
      {
        q: "Is there parking?",
        a: "Yes—street parking available. Kirkgate Market has a car park nearby.",
      },
      {
        q: "How do I contact you?",
        a: `Phone: 07768426754 | Email: tech@originrepairs.co.uk | Visit: ${BUSINESS.address}`,
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <>
      <Navbar />

      <main className="pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-20 text-center">
            <Badge className="mb-4 bg-primary/10 text-primary">FAQ</Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Questions answered.
            </h1>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about repairs at Origin.
            </p>
          </div>

          {/* FAQ Sections */}
          <div className="space-y-16">
            {categories.map(({ name, faqs }) => (
              <section key={name}>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  {name}
                </h2>
                <Accordion type="single" collapsible className="space-y-2">
                  {faqs.map(({ q, a }, idx) => (
                    <AccordionItem
                      key={q}
                      value={`${name}-${idx}`}
                      className="border-border bg-white rounded-lg px-6"
                    >
                      <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary py-4">
                        {q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-4">
                        {a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            ))}
          </div>

          {/* Still have questions */}
          <div className="border-t border-border mt-20 pt-20 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Still have questions?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Get in touch—we're here to help. Call us, email, or stop by our
              Leeds location.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-blue-700">
                <Link href="/contact">Contact Us</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2"
              >
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
