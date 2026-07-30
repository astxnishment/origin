import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Package, ShieldCheck, Truck } from "lucide-react";
import { BUSINESS, FEATURES } from "@/lib/constants";
import {
  PageContainer,
  PageIntro,
  PageSection,
  SectionHeading,
} from "@/components/layout/PageContainer";

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

      <main className="pb-24 pt-24">
        <PageContainer>
          <PageIntro
            eyebrow="Mail-in repairs"
            title="Ship your device to us for repair."
            className="lg:grid-cols-[minmax(0,1fr)_360px]"
            aside={
              <div className="panel-muted p-5 sm:p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-surface-raised">
                  <Package className="h-5 w-5 text-[color:var(--icon-fg)]" />
                </div>
                <p className="text-sm font-semibold text-foreground">
                  Do not ship before acceptance
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  We will send the current address, packing and return-postage
                  terms after reviewing your request.
                </p>
              </div>
            }
          />
          <PageSection className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px] lg:items-start">
            <div>
              <h2 className="section-title mb-4">Start with a request.</h2>
              <p className="mb-7 max-w-xl text-[15px] leading-7 text-muted-foreground">
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

            <div className="border-l-2 border-primary pl-5">
              <p className="eyebrow mb-2">Before dispatch</p>
              <p className="text-sm leading-6 text-muted-foreground">
                A submitted form does not create a repair reference or confirm
                that a parcel can be accepted. Keep the carrier tracking details
                once we have confirmed the shipment.
              </p>
            </div>
          </PageSection>

          <PageSection>
            <SectionHeading title="How mail-in repair works" />
            <div className="grid grid-cols-1 overflow-hidden rounded-lg border border-border sm:grid-cols-2 lg:grid-cols-4">
              {steps.map(({ title, body }, index) => (
                <div key={title} className="border-b border-border bg-card p-5 sm:border-r lg:min-h-56 lg:border-b-0 lg:last:border-r-0">
                  <p className="mb-3 text-[12px] font-semibold text-primary">0{index + 1}</p>
                  <h3 className="mb-2 text-[15px] font-semibold text-foreground">{title}</h3>
                  <p className="text-[13px] leading-relaxed text-muted-foreground">{body}</p>
                </div>
              ))}
            </div>
          </PageSection>

          <PageSection className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <SectionHeading title="Devices you can send" />
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {devices.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-[13px] text-muted-foreground">
                    <Check className="h-3.5 w-3.5 shrink-0 text-accent" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="divide-y divide-border border-y border-border">
              {[
                { icon: Truck, title: "Carrier terms confirmed first", body: "Outbound risk, insurance, tracking and return postage are explained before dispatch." },
                { icon: ShieldCheck, title: "Quote before repair", body: "We do not begin work until you approve the final price after assessment." },
                { icon: Package, title: "Pack with padding", body: "Remove cases/accessories unless needed for the fault, and protect screens and corners well." },
              ].map(({ icon: Icon, title, body }) => (
                <div key={title} className="py-5">
                  <div className="mb-3 flex items-center gap-2">
                    <Icon className="h-4 w-4 text-[color:var(--icon-fg)]" />
                    <h3 className="text-[14px] font-semibold text-foreground">{title}</h3>
                  </div>
                  <p className="text-[13px] leading-relaxed text-muted-foreground">{body}</p>
                </div>
              ))}
            </div>
          </PageSection>

          <PageSection bordered={false} className="text-center">
            <h2 className="mb-3 text-2xl font-semibold sm:text-3xl">Ready to send it in?</h2>
            <p className="mx-auto mb-8 max-w-sm text-[15px] text-muted-foreground">
              Send a request first. The team will confirm whether the device
              can be accepted and provide current instructions.
            </p>
            <Button asChild className="btn-primary h-10 rounded-lg px-8 text-[13px]">
              <Link href="/book?method=mail-in">Request Mail-in Repair</Link>
            </Button>
          </PageSection>
        </PageContainer>
      </main>

      <Footer />
    </>
  );
}
