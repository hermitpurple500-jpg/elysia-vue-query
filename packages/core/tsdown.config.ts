import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts'],
  format: ['esm', 'cjs'],
  dts: { sourcemap: true },
  clean: true,
  treeshake: true,
  sourcemap: true,
  publint: 'ci-only',
  attw: 'ci-only',
  failOnWarn: 'ci-only',
})
