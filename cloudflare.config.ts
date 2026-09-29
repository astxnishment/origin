import { bindings, defineConfig, defineWorker } from "cf/config";
import { cloudflareEnvironment } from "./scripts/cloudflare-environment.mjs";

export default defineConfig({
  accountId: "e8c9093e274f99948f5fdd6a9769559e",
  worker: defineWorker({
    name: "origin-repairs",
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-09-29",
    compatibilityFlags: ["nodejs_compat"],
    assets: { notFoundHandling: "none" },
    workersDev: true,
    domains: ["originrepairs.com", "www.originrepairs.com"],
    previewUrls: false,
    observability: {
      enabled: true,
      redactQueryString: true,
      logs: { enabled: true },
      traces: { enabled: true, headSamplingRate: 0.1 },
    },
    env: {
      ASSETS: bindings.assets(),
      ...Object.fromEntries(Object.entries(cloudflareEnvironment).map(([key, value]) => [key, bindings.text(value)])),
    },
  }),
});
