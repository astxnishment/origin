import Link from "next/link";
import { LockKeyhole, ShieldCheck, Wrench } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PageContainer } from "@/components/layout/PageContainer";

const benefits = [
  {
    icon: ShieldCheck,
    title: "No password to remember",
    text: "Access is verified through a private link sent to your email.",
  },
  {
    icon: Wrench,
    title: "Repair details together",
    text: "Use the same email address you give us when requesting a repair.",
  },
];

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pb-16 pt-16 md:pt-[72px]">
        <PageContainer
          size="form"
          className="grid min-h-[calc(100vh-8rem)] items-center gap-8 py-8 sm:gap-10 sm:py-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(360px,0.75fr)] lg:gap-20 lg:py-16"
        >
          <section>
            <div className="icon-circle mb-6 h-11 w-11">
              <LockKeyhole className="h-5 w-5" />
            </div>
            <p className="eyebrow">Customer account</p>
            <h1 className="page-title mt-3 max-w-[10ch]">
              Your repairs, one secure sign-in.
            </h1>
            <p className="body-large mt-5 max-w-[42ch] text-muted-foreground">
              Enter your email and we will send you a secure link to access
              your Origin Repairs account.
            </p>

            <div className="mt-9 hidden max-w-xl gap-5 sm:grid sm:grid-cols-2 lg:grid-cols-1">
              {benefits.map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex gap-3.5">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--icon-fg)]" />
                  <div>
                    <p className="text-sm font-semibold">{title}</p>
                    <p className="mt-1 max-w-[34ch] text-[13px] leading-5 text-muted-foreground">
                      {text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section
            aria-label="Account sign in"
            className="panel p-5 sm:p-7"
          >
            {children}
            <p className="mt-5 text-center text-[11px] leading-5 text-muted-foreground">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="underline underline-offset-4">
                terms
              </Link>{" "}
              and acknowledge our{" "}
              <Link href="/privacy" className="underline underline-offset-4">
                privacy policy
              </Link>
              .
            </p>
          </section>
        </PageContainer>
      </main>
      <Footer />
    </>
  );
}
