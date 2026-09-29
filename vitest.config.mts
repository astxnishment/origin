import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    env: { NEXT_PUBLIC_TRACKING_ENABLED: "false", NEXT_PUBLIC_MAIL_IN_ENABLED: "false" },
    include: ["tests/unit/**/*.test.ts"],
    clearMocks: true,
  },
});
