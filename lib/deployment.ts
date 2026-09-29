import { CONTACT_ONLY_MODE, SEO } from "@/lib/business-config";

const productionHostname = new URL(SEO.siteUrl).hostname;
const productionOperationsApproved =
  process.env.PRODUCTION_OPERATIONS_ENABLED === "true";

export type DeploymentEnvironment = "production" | "preview" | "development" | "unknown";

/** Hosting stage is explicit: NODE_ENV also equals production for preview builds. */
export function getDeploymentEnvironment(): DeploymentEnvironment {
  // The platform-provided stage wins, so a Vercel preview cannot be promoted
  // (or a production deployment downgraded) using a generic environment value.
  const value = process.env.VERCEL_ENV?.trim() || process.env.DEPLOYMENT_ENV?.trim();
  return value === "production" || value === "preview" || value === "development"
    ? value
    : "unknown";
}

export function isProductionEnvironment(): boolean {
  return getDeploymentEnvironment() === "production";
}

export const IS_PRODUCTION_DEPLOYMENT =
  !CONTACT_ONLY_MODE &&
  isProductionEnvironment() &&
  productionOperationsApproved &&
  productionHostname === "originrepairs.co.uk";

export const INDEXING_ENABLED =
  IS_PRODUCTION_DEPLOYMENT &&
  process.env.SITE_INDEXING_ENABLED === "true";

export const EMAIL_DELIVERY_ENABLED =
  !CONTACT_ONLY_MODE &&
  process.env.EMAILS_ENABLED === "true" &&
  (IS_PRODUCTION_DEPLOYMENT ||
    (!isProductionEnvironment() && process.env.ALLOW_PREVIEW_EMAILS === "true"));

export function areRepairWritesEnabled(): boolean {
  if (CONTACT_ONLY_MODE) return false;
  return (IS_PRODUCTION_DEPLOYMENT && process.env.REPAIR_WRITES_ENABLED === "true") ||
    (!isProductionEnvironment() && process.env.ALLOW_PREVIEW_REPAIR_WRITES === "true");
}

export function isCanonicalHostname(hostname: string): boolean {
  return hostname === productionHostname || hostname === `www.${productionHostname}`;
}
