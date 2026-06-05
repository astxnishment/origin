import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Shield, Zap, Award } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="pt-32 pb-24">
        {/* Header */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <Badge className="mb-4 bg-primary/10 text-primary">About Us</Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 max-w-4xl">
            Professional device repair.
            <br />
            <span className="text-primary">Honest service. Fair prices.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Origin Repairs was founded on a simple belief: device repair should
            be done properly, transparently, and fairly. No upselling. No
            hidden fees. Just expert service you can trust.
          </p>
        </section>

        {/* Our Values */}
        <section className="border-y border-border bg-secondary/40 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground mb-12">
              Our values:
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  icon: Shield,
                  title: "Trust",
                  desc: "We're honest about what's wrong and how much it costs. Fixed quote before we start.",
                },
                {
                  icon: Zap,
                  title: "Speed",
                  desc: "Respect your time. 90% of repairs same-day. No unnecessary delays.",
                },
                {
                  icon: Award,
                  title: "Quality",
                  desc: "OEM-grade parts, proper techniques, certified technicians. No shortcuts.",
                },
                {
                  icon: CheckCircle,
                  title: "Accountability",
                  desc: "12-month warranty on every repair. If it goes wrong, we fix it free.",
                },
              ].map(({ icon: Icon, title, desc }) => (
                <Card key={title} className="bg-white border-border">
                  <CardContent className="p-8">
                    <Icon className="h-8 w-8 text-primary mb-4" />
                    <h3 className="text-xl font-bold text-foreground mb-3">
                      {title}
                    </h3>
                    <p className="text-muted-foreground">{desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-3xl font-bold text-foreground mb-8">Our story:</h2>
          <div className="prose prose-invert max-w-3xl">
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Origin Repairs started in {BUSINESS.founded} because we saw a gap in
              the market. Too many repair shops were treating devices as a quick
              cash grab. Cut corners. Misleading quotes. Upsells that customers
              didn't need.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              We decided to do it differently. Fair prices. Expert technicians.
              Real warranty. No BS.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Over {new Date().getFullYear() - BUSINESS.founded} years, we've built a reputation on
              honest service. 10,000+ devices repaired. 4.8-star rating. Customers
              who come back. That's what we're proud of.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-border bg-blue-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-4xl font-bold text-primary mb-2">10,000+</p>
                <p className="text-foreground font-semibold">Devices repaired</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Since {BUSINESS.founded}
                </p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary mb-2">4.8 ⭐</p>
                <p className="text-foreground font-semibold">Google Rating</p>
                <p className="text-xs text-muted-foreground mt-1">
                  1,200+ reviews
                </p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary mb-2">60 min</p>
                <p className="text-foreground font-semibold">Avg Turnaround</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Most repairs
                </p>
              </div>
              <div>
                <p className="text-4xl font-bold text-green-600 mb-2">12mo</p>
                <p className="text-foreground font-semibold">Warranty</p>
                <p className="text-xs text-muted-foreground mt-1">
                  On everything
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            Visit us in Leeds:
          </h2>
          <Card className="bg-white border-border">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <p className="text-lg font-semibold text-foreground mb-3">
                    📍 Location
                  </p>
                  <p className="text-muted-foreground mb-6">
                    {BUSINESS.address}
                    <br />
                    {BUSINESS.postcode}
                  </p>

                  <p className="text-lg font-semibold text-foreground mb-3">
                    ⏰ Hours
                  </p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>Monday–Friday: 9am–6pm</li>
                    <li>Saturday: 10am–4pm</li>
                    <li>Sunday: Closed</li>
                  </ul>
                </div>

                <div>
                  <p className="text-lg font-semibold text-foreground mb-3">
                    📞 Contact
                  </p>
                  <p className="text-muted-foreground mb-1">
                    <a
                      href={`tel:${BUSINESS.phone}`}
                      className="text-primary hover:underline font-medium"
                    >
                      {BUSINESS.phone}
                    </a>
                  </p>
                  <p className="text-muted-foreground mb-6">
                    <a
                      href={`mailto:${BUSINESS.email}`}
                      className="text-primary hover:underline font-medium"
                    >
                      {BUSINESS.email}
                    </a>
                  </p>

                  <p className="text-lg font-semibold text-foreground mb-3">
                    ⭐ Reviews
                  </p>
                  <p className="text-muted-foreground">
                    <a
                      href={BUSINESS.googleReviewUrl}
                      className="text-primary hover:underline font-medium"
                    >
                      Google: 4.8★ (1,200+ reviews)
                    </a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <section className="border-t border-border py-20 text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Ready to experience honest repair service?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Book online, call us, or drop in. We're in Leeds city centre.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-blue-700"
              >
                <Link href="/book">Book a Repair</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2">
                <a href={`tel:${BUSINESS.phone}`}>{BUSINESS.phone}</a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
