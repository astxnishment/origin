import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us — Leeds",
  description: "Contact Origin Repairs about a device, published estimate or repair assessment in Leeds. Response times vary with workload.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
