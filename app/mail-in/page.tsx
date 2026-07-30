import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Package, ShieldCheck, Truck } from "lucide-react";
import { BUSINESS, FEATURES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Mail-in Device Repair UK | Origin Repairs Leeds",
  description:
    "Request mail-in assessment for a phone, tablet, laptop, console or custom PC. Shipping instructions and the quote process are confirmed before dispatch.",
};

const steps = [
  {
    title: "Request mail-in repair",
    body: "Tell us what device you want to send and what is wrong. This is a request, not acceptance of the parcel or repair.",
  },
  {
    title: "Wait for acceptance",
    body: "The team confirms whether mail-in is appropriate and sends the current packing, address and postage instructions.",
  },
  {
    title: "Pack and send",
    body: "After acceptance, follow the supplied instructions, use suitable padding and keep the carrier tracking details.",
  },
  {
    title: "Assessment first",
    body: "Once it arrives, we inspect it and confirm the exact quote before any repair work starts.",
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
  if (!FEATURES.mailInEnabled) notFound();

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
                Not local to Leeds? Request a mail-in assessment for your
                phone, tablet, laptop, console or PC. Wait for acceptance and
                current shipping instructions before sending anything.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild className="btn-primary h-10 rounded-lg px-6 text-[13px]">
                  <Link href="/book?method=mail-in" className="flex items-center gap-2">
                    Request Mail-in Repair <ArrowRight className="h-3.5 w-3.5" />
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
              <p className="mb-2 text-[13px] font-semibold text-foreground">
                Do not ship before acceptance
              </p>
              <p className="mt-5 text-[12px] leading-relaxed text-muted-foreground">
                A submitted form does not create a repair reference or confirm
                that a parcel can be accepted. The team will send the current
                address, packing and return-postage terms after reviewing the
                request.
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
                { icon: Truck, title: "Carrier terms confirmed first", body: "Outbound risk, insurance, tracking and return postage are explained before dispatch." },
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
              Send a request first. The team will confirm whether the device
              can be accepted and provide current instructions.
            </p>
            <Button asChild className="btn-primary h-10 rounded-lg px-8 text-[13px]">
              <Link href="/book?method=mail-in">Request Mail-in Repair</Link>
            </Button>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
