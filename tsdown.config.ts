import { defineConfig } from "tsdown";

export default defineConfig({
  exports: true, // Enable exports field
  outDir: "dist",
  entry: {
    index: "src/index.ts", // re-export latest
    v0: "src/v0/index.ts",
    v1: "src/v1/index.ts",
    "v1/validators": "src/v1/validators.ts",
    "v0/validators": "src/v0/validators.ts",
    "v1/client": "src/v1/client.ts",
    "v0/client": "src/v0/client.ts",
    "v1/oauth": "src/v1/oauthClient.ts",
    "v1/routes": "src/v1/routes.ts",
    "v0/routes": "src/v0/routes.ts",
    "v1/webhook": "src/v1/webhook.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  platform: "neutral",
  alias: {
    "@src": "./src",
    "@utils": "./src/utils",
    "@v0": "./src/v0",
    "@v1": "./src/v1",
  },
  sourcemap: true,
});
