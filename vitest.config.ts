import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@elysia-vue-query/core': fileURLToPath(new URL('./packages/core/src/index.ts', import.meta.url)),
      '@elysia-vue-query/vue': fileURLToPath(new URL('./packages/vue/src/index.ts', import.meta.url)),
    },
  },
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          include: ['packages/*/src/**/*.test.ts'],
          exclude: ['packages/nuxt/**'],
          environment: 'node',
          typecheck: {
            enabled: true,
          },
        },
      },
      {
        resolve: {
          alias: {
            '@elysia-vue-query/core': fileURLToPath(new URL('./packages/core/src/index.ts', import.meta.url)),
            '@elysia-vue-query/vue': fileURLToPath(new URL('./packages/vue/src/index.ts', import.meta.url)),
          },
        },
        test: {
          name: 'e2e',
          include: ['e2e/**/*.test.ts'],
          exclude: ['e2e/nuxt.test.ts'],
          environment: 'node',
          testTimeout: 30_000,
          hookTimeout: 30_000,
        },
      },
    ],
  },
})
