import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@src": r("./src"),
      "@utils": r("./src/utils"),
      "@v0": r("./src/v0"),
      "@v1": r("./src/v1"),
    },
  },
});
