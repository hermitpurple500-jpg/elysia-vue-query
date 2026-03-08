<div align="center">
  <img src="docs/public/logo_v.svg" alt="Elysia Vue Query" width="220" />
  <br /><br />

  <strong>Deterministic, type-safe TanStack Query transport layer for ElysiaJS Eden Treaty.</strong>
  <br />
  Built for Vue 3 and Nuxt — automatic query keys, smart cache invalidation, SSR hydration.

  <br /><br />

  [![NPM Version](https://img.shields.io/npm/v/@elysia-vue-query/vue.svg?style=flat-square&colorA=030712&colorB=f06292)](https://www.npmjs.com/package/@elysia-vue-query/vue)
  [![NPM Downloads](https://img.shields.io/npm/dm/@elysia-vue-query/vue.svg?style=flat-square&colorA=030712&colorB=f06292)](https://www.npmjs.com/package/@elysia-vue-query/vue)
  [![Bundle Size](https://img.shields.io/bundlephobia/minzip/@elysia-vue-query/vue.svg?style=flat-square&colorA=030712&colorB=a855f7)](https://bundlephobia.com/package/@elysia-vue-query/vue)
  [![License](https://img.shields.io/npm/l/@elysia-vue-query/vue.svg?style=flat-square&colorA=030712&colorB=4ade80)](LICENSE)
  [![CI](https://img.shields.io/github/actions/workflow/status/shiina/elysia-vue-query/ci.yml?style=flat-square&colorA=030712&label=CI)](https://github.com/shiina/elysia-vue-query/actions)
  [![Provenance](https://img.shields.io/badge/provenance-verified-f06292?style=flat-square&colorA=030712)](https://docs.npmjs.com/generating-provenance-statements)
</div>

---

## What this is

You have an [ElysiaJS](https://elysiajs.com/) backend. You are importing its type with Eden Treaty. Now you want reactive, cached, SSR-aware data fetching in Vue — without writing query keys by hand, without coupling mutations to invalidation logic, and without losing the types.

`elysia-vue-query` solves exactly that problem.

It wraps your Eden client once. Everything else — `useQuery`, `useMutation`, query keys, cache invalidation, SSR dehydration — falls out automatically, fully typed.

---

## Packages

| Package | Description | Version |
|---|---|---|
| [`@elysia-vue-query/core`](packages/core) | Proxy engine, key builders, serialization | [![npm](https://img.shields.io/npm/v/@elysia-vue-query/core.svg?style=flat-square&colorA=030712&colorB=f06292)](https://www.npmjs.com/package/@elysia-vue-query/core) |
| [`@elysia-vue-query/vue`](packages/vue) | Vue 3 composables — `useQuery`, `useMutation`, `prefetch` | [![npm](https://img.shields.io/npm/v/@elysia-vue-query/vue.svg?style=flat-square&colorA=030712&colorB=f06292)](https://www.npmjs.com/package/@elysia-vue-query/vue) |
| [`@elysia-vue-query/nuxt`](packages/nuxt) | Nuxt module — SSR dehydration + client hydration | [![npm](https://img.shields.io/npm/v/@elysia-vue-query/nuxt.svg?style=flat-square&colorA=030712&colorB=f06292)](https://www.npmjs.com/package/@elysia-vue-query/nuxt) |

---

## How it works

```
Eden client  →  createEdenQueryProxy  →  eden.proxy.users.get
                                                    ↓
                                      buildQueryKey()
                              [EDEN_ROUTE_SYMBOL, 'users', 'get']
                                                    ↓
                                     @tanstack/vue-query cache
```

1. `createEdenQueryHelpers` wraps your Eden client in a transparent `Proxy`.
2. Accessing `eden.proxy.users.get` records the route segments and HTTP method into a `RouteMeta` attached via a symbol.
3. `buildQueryKey` deterministically serializes that metadata — sorted object keys, stripped `undefined` fields — into a stable TanStack query key.
4. When a mutation fires, `buildMutationInvalidationKey` derives a prefix key covering all queries under the same route hierarchy. TanStack's prefix matching handles the rest.

---

## Installation

```sh
bun add @elysia-vue-query/vue @tanstack/vue-query @elysiajs/eden
```

For Nuxt:

```sh
bun add @elysia-vue-query/nuxt @tanstack/vue-query @elysiajs/eden
```

---

## Quick Start — Vue 3

**1. Register the TanStack plugin**

```ts
// main.ts
import { createApp } from 'vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import App from './App.vue'

createApp(App).use(VueQueryPlugin).mount('#app')
```

**2. Create helpers from your Eden client**

```ts
// src/lib/eden.ts
import { treaty } from '@elysiajs/eden'
import { createEdenQueryHelpers } from '@elysia-vue-query/vue'
import type { App } from '../../backend/src'

const client = treaty<App>('http://localhost:3000')
export const eden = createEdenQueryHelpers(client)
```

**3. Use in components**

```vue
<script setup lang="ts">
import { eden } from '@/lib/eden'

// Typed read — query key derived automatically
const { data: users, isPending } = eden.useQuery(eden.proxy.users.get)

// Typed write — invalidates users.* queries on success
const createUser = eden.useMutation(eden.proxy.users.post)
</script>
```

**Queries with params** — reactive refs are supported:

```ts
const page = ref(1)

// Re-fetches automatically when page.value changes
const { data } = eden.useQuery(eden.proxy.users.get({ page, limit: 20 }))
```

---

## Quick Start — Nuxt

**1. Register the module**

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@elysia-vue-query/nuxt'],
})
```

The module creates a `QueryClient`, registers a `VueQueryPlugin`, dehydrates the cache into the Nuxt payload on the server, and hydrates it before the page runs on the client. No manual wiring required.

**2. Create helpers in a composable**

```ts
// composables/eden.ts
import { treaty } from '@elysiajs/eden'
import { createEdenQueryHelpers } from '@elysia-vue-query/vue'
import type { App } from '@playground/api'

const client = treaty<App>('http://localhost:3000')
export const eden = createEdenQueryHelpers(client)
```

**3. Use queries in pages**

```vue
<!-- pages/users.vue -->
<script setup lang="ts">
import { eden } from '~/composables/eden'

const users = eden.useQuery(eden.proxy.users.get)
const createUser = eden.useMutation(eden.proxy.users.post)
</script>
```

**Manual prefetch** for SEO-critical pages:

```vue
<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query'
import { eden } from '~/composables/eden'

const queryClient = useQueryClient()

if (import.meta.server) {
  await eden.prefetch(eden.proxy.posts.get, queryClient)
}

const posts = eden.useQuery(eden.proxy.posts.get)
</script>
```

---

## Query Keys

Keys are derived from the route structure. You never write them manually.

```ts
eden.proxy.users.get
// [EDEN_ROUTE_SYMBOL, 'users', 'get']

eden.proxy.users.get({ page: 1, limit: 20 })
// [EDEN_ROUTE_SYMBOL, 'users', { limit: 20, page: 1 }, 'get']
```

Access the raw key when you need to talk to `queryClient` directly:

```ts
const key = eden.getKey(eden.proxy.users.get)

queryClient.getQueryData(key)
queryClient.setQueryData(key, updater)
```

Prefix-based invalidation for subtree operations:

```ts
import { buildPartialKey } from '@elysia-vue-query/core'

await queryClient.invalidateQueries({
  queryKey: buildPartialKey('users'),
})
```

---

## Cache Invalidation

Mutations automatically invalidate all queries under the same route prefix. A `POST /users` invalidates every cached `GET /users/**` entry.

```ts
const createUser = eden.useMutation(eden.proxy.users.post, {
  // Additional invalidation beyond the automatic prefix
  invalidates: [eden.proxy.posts.get],
  onSuccess(data) {
    console.log('created', data)
  },
})
```

---

## API Reference

Full API documentation is available at [elysia-vue.pages.dev/api/vue](https://elysia-vue.pages.dev/api/vue).

### `createEdenQueryHelpers(client)`

Returns an `eden` object with:

| Method | Description |
|---|---|
| `eden.useQuery(endpoint, options?)` | Reactive TanStack `useQuery` wrapper |
| `eden.useMutation(endpoint, options?)` | Reactive TanStack `useMutation` wrapper with auto-invalidation |
| `eden.prefetch(endpoint, queryClient)` | Server-side prefetch for SSR |
| `eden.getKey(endpoint)` | Returns the deterministic query key |
| `eden.proxy` | Typed proxy for building endpoint references |

### `@elysia-vue-query/core` utilities

| Export | Description |
|---|---|
| `buildQueryKey(meta)` | Builds a full query key from `RouteMeta` |
| `buildMutationInvalidationKey(endpoint)` | Builds a prefix key for mutation invalidation |
| `buildPartialKey(...segments)` | Builds a partial key for subtree invalidation |
| `stableSerialize(obj)` | Deterministic JSON serialization with sorted keys |
| `getRouteMeta(endpoint)` | Extracts `RouteMeta` from a proxy endpoint |
| `EDEN_ROUTE_SYMBOL` | The symbol used as the first segment of every key |

---

## Contributing

```sh
# Install dependencies
bun install

# Build all packages
bun run build

# Run tests
bun run test

# Typecheck
bun run typecheck
```

Releases are managed by [Changesets](https://github.com/changesets/changesets). To propose a change:

```sh
bun run changeset
```

---

## Acknowledgements

This project builds on the work of these projects and people:

<table>
<tr>
<td align="center" width="120">
  <a href="https://elysiajs.com">
    <img src="https://elysiajs.com/assets/elysia.svg" width="40" alt="ElysiaJS" /><br />
    <sub><b>ElysiaJS</b></sub>
  </a>
</td>
<td align="center" width="120">
  <a href="https://nuxt.com">
    <img src="https://nuxt.com/icon.png" width="40" alt="Nuxt" /><br />
    <sub><b>Nuxt</b></sub>
  </a>
</td>
<td align="center" width="120">
  <a href="https://tanstack.com/query">
    <img src="https://tanstack.com/favicon.ico" width="40" alt="TanStack Query" /><br />
    <sub><b>TanStack Query</b></sub>
  </a>
</td>
<td align="center" width="120">
  <a href="https://bun.sh">
    <img src="https://bun.sh/logo.svg" width="40" alt="Bun" /><br />
    <sub><b>Bun</b></sub>
  </a>
</td>
<td align="center" width="120">
  <a href="https://tsdown.dev">
    <img src="https://tsdown.dev/tsdown.svg" width="40" alt="tsdown" /><br />
    <sub><b>tsdown</b></sub>
  </a>
</td>
<td align="center" width="120">
  <a href="https://vitepress.dev">
    <img src="https://vitepress.dev/vitepress-logo-mini.svg" width="40" alt="VitePress" /><br />
    <sub><b>VitePress</b></sub>
  </a>
</td>
</tr>
</table>

**Logo** — designed by [@OukaroMF](https://github.com/OukaroMF), used with permission.

**Documentation theme** — `docs/.vitepress/theme/style.css` is derived from the [ElysiaJS documentation](https://github.com/elysiajs/documentation) source, MIT licensed.

---

<div align="center">
  <sub>MIT License - <a href="https://shiina.xyz">@sakushiina</a></sub>
</div>
