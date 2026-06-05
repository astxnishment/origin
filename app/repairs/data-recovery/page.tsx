import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Clock, HardDrive } from "lucide-react";

export default function DataRecoveryPage() {
  return (
    <>
      <Navbar />

      <main className="pt-32 pb-24">
        {/* Header */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <Badge className="mb-4 bg-primary/10 text-primary">
            Data Recovery
          </Badge>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
                Don't lose your memories.
              </h1>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Hard drive failed? Phone won't turn on? SSD corrupted? We recover
                data from damaged, broken, and inaccessible devices. Specialist
                equipment. Expert technicians. Confidential.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-blue-700"
                >
                  <Link href="/contact">Discuss Your Case</Link>
                </Button>
              </div>
            </div>

            {/* Warning */}
            <Card className="bg-red-50 border border-red-200">
              <CardContent className="p-8">
                <AlertCircle className="h-8 w-8 text-red-600 mb-4" />
                <h3 className="font-semibold text-red-900 mb-3">Act Quickly</h3>
                <ul className="space-y-2 text-sm text-red-800">
                  <li>• Don't force restart a dead device</li>
                  <li>• Stop using the device immediately</li>
                  <li>• Don't open or disassemble yourself</li>
                  <li>• Bring it in or contact us ASAP</li>
                </ul>
                <p className="text-xs text-red-700 mt-4">
                  The longer a damaged drive operates, the lower recovery chances.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* What We Recover */}
        <section className="border-y border-border bg-secondary/40 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground mb-12">
              What we can recover:
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-white border-border">
                <CardContent className="p-6">
                  <HardDrive className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">
                    Hard Drives
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Mechanical failure, clicking, not detected
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white border-border">
                <CardContent className="p-6">
                  <HardDrive className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">
                    SSDs & Flash Drives
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Corruption, water damage, accidental deletion
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white border-border">
                <CardContent className="p-6">
                  <HardDrive className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">
                    Phones & Tablets
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Water damage, screen shattered, won't start
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white border-border">
                <CardContent className="p-6">
                  <HardDrive className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">
                    External Drives
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Dropped, deleted files, not recognized
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white border-border">
                <CardContent className="p-6">
                  <HardDrive className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">
                    USB & Memory Cards
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Corrupted, formatted by mistake
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white border-border">
                <CardContent className="p-6">
                  <HardDrive className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">
                    Logic Board Issues
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Water damage, electrical damage, firmware corruption
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Success Rate */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <p className="text-5xl font-bold text-primary mb-2">85%+</p>
              <p className="text-foreground font-semibold mb-1">Success Rate</p>
              <p className="text-sm text-muted-foreground">
                On recoverable devices
              </p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold text-primary mb-2">24-48h</p>
              <p className="text-foreground font-semibold mb-1">Turnaround</p>
              <p className="text-sm text-muted-foreground">Most cases</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold text-green-600 mb-2">100%</p>
              <p className="text-foreground font-semibold mb-1">Confidential</p>
              <p className="text-sm text-muted-foreground">Your data is private</p>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="border-t border-border bg-blue-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground mb-12">
              Our process:
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                {
                  step: 1,
                  title: "Assess",
                  desc: "Free evaluation of your device and data recovery chances",
                },
                {
                  step: 2,
                  title: "Quote",
                  desc: "Transparent pricing. No charges if recovery fails.",
                },
                {
                  step: 3,
                  title: "Recover",
                  desc: "Using specialist equipment in clean environment",
                },
                {
                  step: 4,
                  title: "Deliver",
                  desc: "Data on encrypted USB or cloud link. Fully confidential.",
                },
              ].map(({ step, title, desc }) => (
                <Card key={step} className="bg-white border-border">
                  <CardContent className="p-6">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center mb-4">
                      {step}
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-3xl font-bold text-foreground mb-12">Pricing:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="bg-white border-border">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-6">
                  Standard Recovery
                </h3>
                <p className="text-primary text-4xl font-bold mb-4">£149—£299</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Most hard drives & SSDs</li>
                  <li>✓ Deleted file recovery</li>
                  <li>✓ Logical failures</li>
                  <li>✓ 24-48 hour turnaround</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-white border-border border-2 border-primary">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-6">
                  Complex Recovery
                </h3>
                <p className="text-primary text-4xl font-bold mb-4">£299—£599</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Physical damage</li>
                  <li>✓ Water damage</li>
                  <li>✓ Circuit board repair</li>
                  <li>✓ Extended turnaround</li>
                </ul>
              </CardContent>
            </Card>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            No charge if recovery fails. Free assessment.
          </p>
        </section>

        {/* CTA */}
        <section className="border-t border-border py-20 text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Don't give up on your data.
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Contact us now for a free assessment. We'll tell you honestly if
              recovery is possible.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-blue-700"
            >
              <Link href="/contact">Contact Us Now</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
