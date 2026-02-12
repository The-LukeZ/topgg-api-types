import { defineConfig } from "tsdown";

export default defineConfig({
  exports: true, // Enable exports field
  outDir: "dist",
  entry: {
    index: "src/index.ts", // re-export latest
    v0: "src/v0/index.ts",
    v1: "src/v1/index.ts",
    "v1/validators": "src/v1/validators.ts",
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
