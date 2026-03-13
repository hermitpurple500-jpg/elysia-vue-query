import { defineConfig } from "vite-plus/pack";

export default defineConfig({
  entry: ["./src/index.ts"],
  format: ["esm", "cjs"],
  dts: { sourcemap: true },
  clean: true,
  treeshake: true,
  sourcemap: true,
  deps: {
    neverBundle: ["vue", "@tanstack/vue-query", "@elysia-vue-query/core"],
  },
  publint: "ci-only",
  attw: "ci-only",
  failOnWarn: "ci-only",
});
