import { pageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/AuthShell";
import LoginForm from "@/app/login/LoginForm";
import { FEATURES } from "@/lib/constants";
import { CONTACT_ONLY_MODE } from "@/lib/business-config";
import { getCustomerSession, normaliseNextPath } from "@/lib/server/auth";

export const metadata: Metadata = pageMetadata("/login", {
  title: "Customer Account",
  description: "Secure customer account access for Origin Repairs.",
  robots: {
    index: false,
    follow: false,
  },
});

const errorMessages: Record<string, string> = {
  expired:
    "That sign-in link has expired or is no longer valid. Request a new one.",
  unavailable: "Customer account access is temporarily unavailable.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  if (CONTACT_ONLY_MODE) redirect("/contact");
  if (!FEATURES.customerAccountsEnabled) redirect("/");

  const query = await searchParams;
  const nextPath = normaliseNextPath(query.next);
  const session = await getCustomerSession();
  if (session) redirect(nextPath);

  return (
    <AuthShell>
      <LoginForm
        nextPath={nextPath}
        initialError={query.error ? errorMessages[query.error] : undefined}
      />
    </AuthShell>
  );
}
