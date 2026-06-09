import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { serviceImages } from "@/lib/serviceImages";

export const metadata: Metadata = {
  title: "Data Recovery Leeds | Phone, Laptop, SSD",
  description: "Professional data recovery in Leeds. Recover lost files from phones, laptops, SSDs and hard drives. Free diagnostic. No data, no fee. 76 Cookridge Street.",
};

const recoveryTypes = [
  { name: "Phone data recovery", price: "£149–£299", time: "24–48 hrs", desc: "Deleted files, broken screen, water damage" },
  { name: "Laptop / SSD recovery", price: "£199–£399", time: "48–72 hrs", desc: "Corrupted drive, accidental deletion, OS failure" },
  { name: "Hard drive recovery", price: "£249–£499", time: "3–7 days", desc: "Mechanical failure, logical corruption, file system errors" },
  { name: "RAID recovery", price: "£299–£599", time: "5–10 days", desc: "RAID 0/1/5 arrays, NAS devices, server storage" },
  { name: "Memory card recovery", price: "£99–£199", time: "24–48 hrs", desc: "SD cards, microSD, CF cards" },
  { name: "Emergency recovery", price: "POA", time: "Same day", desc: "Critical business data, urgent deadlines" },
];

const process = [
  { step: "1", title: "Free assessment", desc: "We evaluate the damage and give you a fixed quote. No charge if we can't recover." },
  { step: "2", title: "Recovery attempt", desc: "Our technicians work with specialist tools to extract and reconstruct your data." },
  { step: "3", title: "Verification", desc: "You review the recovered files before we charge anything." },
  { step: "4", title: "Secure transfer", desc: "Data returned on encrypted storage device. Your privacy protected." },
];

const guarantees = [
  "No recovery — no fee",
  "High success rate on logical failures",
  "Encrypted data handling",
  "Free initial assessment",
  "Same-day emergency service",
  "All storage types covered",
];

export default function DataRecoveryPage() {
  return (
    <>
      <Navbar />

      <main className="pt-24 pb-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          {/* Header */}
          <div className="pt-10 pb-16 border-b border-border">
            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-primary mb-3">
              Data Recovery · Leeds
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-5">
                  Lost data doesn&apos;t have to mean lost forever.
                </h1>
                <p className="text-[15px] text-muted-foreground leading-relaxed mb-6 max-w-md">
                  Professional data recovery from phones, laptops, hard drives, and SSDs. Free initial assessment. No recovery means no charge.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
                  {guarantees.map((g) => (
                    <li key={g} className="flex items-center gap-2 text-[13px] text-muted-foreground">
                      <Check className="h-3.5 w-3.5 text-accent shrink-0" />
                      {g}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-xl h-10 px-6 text-[13px]">
                    <Link href="/contact">Get Free Assessment</Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-xl h-10 px-6 text-[13px] border-border hover:bg-muted">
                    <Link href="/book" className="flex items-center gap-2">
                      Book appointment <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
              {/* Hero image */}
              <div className="flex items-center justify-center lg:justify-end">
                <div className="relative">
                  <div className="absolute inset-0 -m-8 rounded-full bg-blue-500/6 blur-3xl pointer-events-none" />
                  <Image
                    src={serviceImages.dataRecovery.src}
                    alt={serviceImages.dataRecovery.alt}
                    width={360}
                    height={360}
                    className="relative object-contain max-h-64 w-auto drop-shadow-[0_16px_48px_rgba(59,130,246,0.2)]"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Urgency notice */}
          <div className="py-8 border-b border-border">
            <div className="rounded-xl bg-card border border-border p-6 flex gap-4">
              <div className="w-1 rounded-full bg-primary shrink-0" />
              <div>
                <p className="text-[13px] font-semibold text-foreground mb-1">Act quickly to maximise recovery chances</p>
                <p className="text-[13px] text-muted-foreground">
                  If your device has failed, stop using it immediately. Further use can overwrite recoverable data. Call us now for emergency assessment: <a href="tel:+447768426754" className="text-primary">07768 426 754</a>
                </p>
              </div>
            </div>
          </div>

          {/* Recovery types */}
          <div className="py-16 border-b border-border">
            <h2 className="text-xl font-semibold mb-8">Recovery services &amp; pricing</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-xl overflow-hidden">
              {recoveryTypes.map(({ name, price, time, desc }) => (
                <div key={name} className="bg-card p-6 hover:bg-surface transition-colors">
                  <p className="text-[13px] font-semibold text-foreground mb-1">{name}</p>
                  <p className="text-[13px] font-semibold text-primary mb-1">{price}</p>
                  <p className="text-[12px] text-muted-foreground mb-2">{time}</p>
                  <p className="text-[12px] text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Process */}
          <div className="py-16 border-b border-border">
            <h2 className="text-xl font-semibold mb-10">Our recovery process</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {process.map(({ step, title, desc }) => (
                <div key={step}>
                  <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-[12px] font-semibold text-foreground mb-4">
                    {step}
                  </div>
                  <h3 className="text-[14px] font-semibold text-foreground mb-1.5">{title}</h3>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="pt-16 text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-3">Don&apos;t give up on your data.</h2>
            <p className="text-[15px] text-muted-foreground mb-8 max-w-sm mx-auto">
              Free assessment. No recovery, no fee. Call us or book online.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-xl h-10 px-6 text-[13px]">
                <Link href="/contact">Start Free Assessment</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl h-10 px-6 text-[13px] border-border hover:bg-muted">
                <a href="tel:+447768426754">07768 426 754</a>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
