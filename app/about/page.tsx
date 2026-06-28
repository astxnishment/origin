import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { BUSINESS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About — Leeds Device Repair Specialists",
  description: "Origin Repairs — a Leeds-based device repair specialist founded in 2018. Honest pricing, quality parts, 12-month warranty on every repair.",
};

const values = [
  { title: "Honesty", desc: "Fixed quotes. No surprises. No upselling. You're told the full picture before anything starts." },
  { title: "Speed", desc: "Most common repairs completed same day. Screen replacements, batteries, charging ports — done while you wait." },
  { title: "Quality", desc: "OEM-grade parts and experienced technicians. 12-month warranty on eligible repairs, because we stand behind our work." },
  { title: "Accountability", desc: "Something not right? We make it right. Our warranty means what it says." },
];

const stats = [
  { value: "2018", label: "Founded in Leeds" },
  { value: "Same Day", label: "Most repairs" },
  { value: "12 mo.", label: "Warranty standard" },
  { value: "Free", label: "Diagnostics always" },
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
                Founded in Leeds in {BUSINESS.founded}, ORIGIN was built on a simple idea: device repair should be fast, honest, and professional. No generic kiosk experience. No opaque pricing. Just technically excellent work, done right.
              </p>
            </div>
          </div>

          {/* Story */}
          <div className="py-16 border-b border-border">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div className="space-y-4 text-[15px] text-muted-foreground leading-relaxed">
                <p>
                  We started because we were frustrated with the state of repair services. Hidden charges. Cheap parts. Technicians who&apos;d rather replace than repair. We knew there was a better way.
                </p>
                <p>
                  We&apos;ve built a reputation in Leeds for being the team you can actually trust — whether it&apos;s a cracked iPhone screen or a catastrophic data loss situation.
                </p>
                <p>
                  Every technician we hire meets a rigorous standard. Every part we use is OEM-grade or better. Every repair comes with a 12-month warranty, because we stand behind our work.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-px bg-border rounded-xl overflow-hidden">
                {stats.map(({ value, label }) => (
                  <div key={label} className="bg-card p-8 flex flex-col justify-center">
                    <p className="text-3xl font-semibold text-foreground mb-1">{value}</p>
                    <p className="text-[13px] text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
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
            <h2 className="text-2xl sm:text-3xl font-semibold mb-3">Come in and meet us.</h2>
            <p className="text-[15px] text-muted-foreground mb-8 max-w-sm mx-auto">
              Walk-ins welcome. Or book a time that suits you.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="btn-primary h-10 rounded-lg px-6 text-[13px]">
                <Link href="/book">Book a Repair</Link>
              </Button>
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
