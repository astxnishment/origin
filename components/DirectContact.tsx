import { MessageCircle, Phone } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/PageContainer";
import { BUSINESS } from "@/lib/constants";

type DirectContactProps = { title?: string; description?: string };

export function DirectContactPanel({
  title = "Let’s talk about your repair.",
  description = "Call or message us on WhatsApp with your device model and the problem. We’ll confirm the next step with you. Online booking and website messaging are not available yet.",
}: DirectContactProps) {
  return (
    <section className="panel bg-card p-6 sm:p-10">
      <h2 className="section-title">{title}</h2>
      <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">{description}</p>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button asChild className="btn-primary h-12 px-5">
          <a href={BUSINESS.phoneHref}><Phone className="mr-2 h-4 w-4" aria-hidden="true" />Call {BUSINESS.phoneDisplay}</a>
        </Button>
        <Button asChild className="btn-secondary h-12 px-5">
          <a href={`https://wa.me/${BUSINESS.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="mr-2 h-4 w-4" aria-hidden="true" />Message on WhatsApp
          </a>
        </Button>
      </div>
      <p className="mt-5 text-sm text-muted-foreground">Please arrange your visit with us before travelling.</p>
    </section>
  );
}

export function DirectContactPage({ title, description }: DirectContactProps) {
  return <><Navbar /><main id="main-content" tabIndex={-1} className="pb-24 pt-28">
    <PageContainer size="narrow" className="py-8 sm:py-12">
      <p className="eyebrow">Origin Repairs · Leeds</p>
      <h1 className="page-title mb-8 mt-3">{title ?? "Contact the team."}</h1>
      <DirectContactPanel description={description} />
    </PageContainer>
  </main><Footer /></>;
}
