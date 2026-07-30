import { SEO } from "@/lib/business-config";

const productionHostname = new URL(SEO.siteUrl).hostname;
const vercelEnvironment = process.env.VERCEL_ENV;
const productionOperationsApproved =
  process.env.PRODUCTION_OPERATIONS_ENABLED === "true";

export const IS_PRODUCTION_DEPLOYMENT =
  vercelEnvironment === "production" &&
  productionOperationsApproved &&
  productionHostname === "originrepairs.co.uk";

export const INDEXING_ENABLED =
  IS_PRODUCTION_DEPLOYMENT &&
  process.env.SITE_INDEXING_ENABLED === "true";

export const EMAIL_DELIVERY_ENABLED =
  process.env.EMAILS_ENABLED === "true" &&
  (IS_PRODUCTION_DEPLOYMENT ||
    process.env.ALLOW_PREVIEW_EMAILS === "true");

export function isCanonicalHostname(hostname: string): boolean {
  return hostname === productionHostname || hostname === `www.${productionHostname}`;
}
