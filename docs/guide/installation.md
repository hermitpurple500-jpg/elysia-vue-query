# Installation

This package is designed to feel native in Bun-based Vue and Nuxt projects, but the runtime packages work with any package manager.

## Choose the package

Use `@elysia-vue-query/vue` when you manage `VueQueryPlugin` yourself.

::: code-group

```sh [bun]
bun add @elysia-vue-query/vue @tanstack/vue-query @elysiajs/eden
```

```sh [pnpm]
pnpm add @elysia-vue-query/vue @tanstack/vue-query @elysiajs/eden
```

```sh [npm]
npm install @elysia-vue-query/vue @tanstack/vue-query @elysiajs/eden
```

```sh [yarn]
yarn add @elysia-vue-query/vue @tanstack/vue-query @elysiajs/eden
```

:::

Use `@elysia-vue-query/nuxt` when you want Nuxt to handle QueryClient setup and SSR hydration.

::: code-group

```sh [bun]
bun add @elysia-vue-query/nuxt
```

```sh [pnpm]
pnpm add @elysia-vue-query/nuxt
```

```sh [npm]
npm install @elysia-vue-query/nuxt
```

```sh [yarn]
yarn add @elysia-vue-query/nuxt
```

:::

`@elysia-vue-query/core` is pulled in automatically as a dependency. You usually do not install it directly.

## Compatibility

| Package | Version |
| --- | --- |
| `vue` | `>= 3.5` |
| `@tanstack/vue-query` | `>= 5` |
| `@elysiajs/eden` | `>= 1` |
| `typescript` | `>= 5.7` |

## TypeScript baseline

Use strict mode and Bun or Vite-style module resolution so Eden and TanStack generics resolve cleanly.

```json [tsconfig.json]
{
  "compilerOptions": {
    "strict": true,
    "moduleResolution": "bundler"
  }
}
```

## Vue setup checklist

1. Install the three runtime packages.
2. Register `VueQueryPlugin` once at app startup.
3. Create an Eden Treaty client.
4. Wrap that client with `createEdenQueryHelpers`.

```ts [src/main.ts]
import { createApp } from 'vue'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import App from './App.vue'

const app = createApp(App)
const queryClient = new QueryClient()

app.use(VueQueryPlugin, { queryClient })
app.mount('#app')
```

## Nuxt setup checklist

Register the module and start using the helpers from a composable.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@elysia-vue-query/nuxt'],
})
```

The Nuxt module:

- registers `VueQueryPlugin` with a fresh `QueryClient`
- dehydrates query state after SSR
- hydrates that state on the client
- auto-imports `createEdenQueryHelpers` from `@elysia-vue-query/vue`

## Bun-first workflow

If your repo uses Bun workspaces, the shortest install path is still the best one:

```sh
bun add @elysia-vue-query/vue @tanstack/vue-query @elysiajs/eden
```

That is enough to start authoring the examples shown in the next guide.

## Next step

Continue to [Getting Started](/guide/getting-started) for the first end-to-end setup.
