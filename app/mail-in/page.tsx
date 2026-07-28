import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Package, ShieldCheck, Truck } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Mail-in Device Repair UK | Origin Repairs Leeds",
  description:
    "Ship your phone, tablet, laptop, console or custom PC to Origin Repairs for assessment and repair. Tracked postal repairs with fixed quote approval before work starts.",
};

const steps = [
  {
    title: "Book mail-in repair",
    body: "Tell us what device you are sending and what is wrong. We will reply with the next steps and your repair reference.",
  },
  {
    title: "Pack it safely",
    body: "Use tracked postage, padding, and include your name, phone number, return address and repair reference inside the parcel.",
  },
  {
    title: "We assess first",
    body: "Once it arrives, we inspect it and confirm the exact quote before any repair work starts.",
  },
  {
    title: "Repair and return",
    body: "After approval and payment, we repair, test and ship the device back using tracked delivery.",
  },
];

const devices = [
  "iPhone and Android phones",
  "iPad and Android tablets",
  "MacBook and Windows laptops",
  "PlayStation, Xbox and Nintendo Switch",
  "Custom PCs and gaming PCs",
  "Liquid damage and data recovery cases",
];

export default function MailInRepairPage() {
  return (
    <>
      <Navbar />

      <main className="pt-24 pb-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <section className="grid grid-cols-1 gap-12 border-b border-border py-10 lg:grid-cols-[1fr_380px] lg:items-center">
            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-primary">
                Mail-in Repairs
              </p>
              <h1 className="mb-5 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
                Ship your device to us for repair.
              </h1>
              <p className="mb-8 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                Not local to Leeds? Send your phone, tablet, laptop, console or PC to Origin Repairs.
                We assess it, confirm the price, repair after approval, then return it tracked.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild className="btn-primary h-10 rounded-lg px-6 text-[13px]">
                  <Link href="/book?method=mail-in" className="flex items-center gap-2">
                    Start Mail-in Repair <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-10 rounded-lg border-border px-6 text-[13px] hover:bg-muted">
                  <a href={`tel:${BUSINESS.phone}`}>Call {BUSINESS.phoneDisplay}</a>
                </Button>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-surface">
                <Package className="h-5 w-5 text-[color:var(--icon-fg)]" />
              </div>
              <p className="mb-2 text-[13px] font-semibold text-foreground">Ship to</p>
              <address className="not-italic text-[15px] font-semibold leading-relaxed text-foreground">
                Origin Repairs
                <br />
                76 Cookridge Street
                <br />
                Leeds, LS2 8GL
                <br />
                United Kingdom
              </address>
              <p className="mt-5 text-[12px] leading-relaxed text-muted-foreground">
                Book first so we can match your parcel to your repair. Use tracked postage and keep
                your tracking number until the repair is complete.
              </p>
            </div>
          </section>

          <section className="border-b border-border py-16">
            <h2 className="mb-8 text-xl font-semibold">How mail-in repair works</h2>
            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl bg-border sm:grid-cols-2 lg:grid-cols-4">
              {steps.map(({ title, body }, index) => (
                <div key={title} className="bg-card p-5">
                  <p className="mb-3 text-[12px] font-semibold text-primary">0{index + 1}</p>
                  <h3 className="mb-2 text-[15px] font-semibold text-foreground">{title}</h3>
                  <p className="text-[13px] leading-relaxed text-muted-foreground">{body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 gap-10 border-b border-border py-16 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-xl font-semibold">Devices you can send</h2>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {devices.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-[13px] text-muted-foreground">
                    <Check className="h-3.5 w-3.5 shrink-0 text-accent" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {[
                { icon: Truck, title: "Tracked postage both ways", body: "We recommend insured tracked shipping. Return postage is confirmed with your quote." },
                { icon: ShieldCheck, title: "Quote before repair", body: "We do not begin work until you approve the final price after assessment." },
                { icon: Package, title: "Pack with padding", body: "Remove cases/accessories unless needed for the fault, and protect screens and corners well." },
              ].map(({ icon: Icon, title, body }) => (
                <div key={title} className="rounded-xl border border-border bg-card p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <Icon className="h-4 w-4 text-[color:var(--icon-fg)]" />
                    <h3 className="text-[14px] font-semibold text-foreground">{title}</h3>
                  </div>
                  <p className="text-[13px] leading-relaxed text-muted-foreground">{body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="pt-16 text-center">
            <h2 className="mb-3 text-2xl font-semibold sm:text-3xl">Ready to send it in?</h2>
            <p className="mx-auto mb-8 max-w-sm text-[15px] text-muted-foreground">
              Start with a mail-in booking and we will send the repair reference and shipping instructions.
            </p>
            <Button asChild className="btn-primary h-10 rounded-lg px-8 text-[13px]">
              <Link href="/book?method=mail-in">Book Mail-in Repair</Link>
            </Button>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
