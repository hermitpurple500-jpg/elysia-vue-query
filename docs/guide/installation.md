# Installation

::: code-group

```bash [bun]
bun add @elysia-vue-query/vue @tanstack/vue-query @elysiajs/eden
```

```bash [pnpm]
pnpm add @elysia-vue-query/vue @tanstack/vue-query @elysiajs/eden
```

```bash [npm]
npm install @elysia-vue-query/vue @tanstack/vue-query @elysiajs/eden
```

:::

You only install `@elysia-vue-query/vue` — the core package comes along for free.

## Peer dependencies

Make sure these are in your project:

| Package | Version |
|---------|--------|
| `vue` | `>= 3.5` |
| `@tanstack/vue-query` | `>= 5.0` |
| `@elysiajs/eden` | `>= 1.0` |

## TypeScript

Requires TypeScript 5.7+ with strict mode and `"moduleResolution": "bundler"`. Both ESM (`.mjs` / `.d.mts`) and CJS (`.cjs` / `.d.cts`) are shipped.
