import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us — Leeds",
  description: "Get in touch with Origin Repairs. Call, email or visit us at 76 Cookridge Street, Leeds LS2 8GL. We respond within the hour during business hours.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
