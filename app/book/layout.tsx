import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Repair — Leeds",
  description: "Book your device repair online at Origin Repairs. Choose your device, select a time slot, and we'll confirm within the hour. Same-day appointments available.",
};

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
