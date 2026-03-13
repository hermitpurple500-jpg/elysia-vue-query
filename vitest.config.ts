import { fileURLToPath } from "node:url";
import { defineConfig } from "vite-plus";

const alias = {
  "@elysia-vue-query/core": fileURLToPath(new URL("./packages/core/src/index.ts", import.meta.url)),
  "@elysia-vue-query/vue": fileURLToPath(new URL("./packages/vue/src/index.ts", import.meta.url)),
};

export default defineConfig({
  test: {
    projects: [
      {
        resolve: { alias },
        test: {
          name: "unit",
          include: ["packages/*/src/**/*.test.ts"],
          exclude: ["packages/nuxt/**"],
          environment: "node",
          typecheck: {
            enabled: true,
          },
        },
      },
      {
        resolve: { alias },
        test: {
          name: "e2e",
          include: ["e2e/**/*.test.ts"],
          exclude: ["e2e/nuxt.test.ts"],
          environment: "node",
          testTimeout: 30_000,
          hookTimeout: 30_000,
        },
      },
    ],
  },
});
