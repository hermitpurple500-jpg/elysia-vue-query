<div align="center">

# elysia-vue-query

Wire [Eden Treaty](https://elysiajs.com/eden/treaty/overview) to [@tanstack/vue-query](https://tanstack.com/query/latest/docs/vue/overview). Forget the glue code.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vue](https://img.shields.io/badge/Vue-3.5+-4FC08D?style=flat-square&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-5+-FF4154?style=flat-square)](https://tanstack.com/query)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

</div>

---

## Why?

Eden Treaty gives you a typed client. TanStack Query gives you caching. But connecting them means hand-rolling query keys, unwrapping `{ data, error }` responses, and tracking which routes to invalidate after mutations.

This library does all of that for you:

```ts
import { createEdenQueryHelpers } from '@elysia-vue-query/vue'
import { treaty } from '@elysiajs/eden'
import type { App } from './server'

const client = treaty<App>('http://localhost:3000')
const eden = createEdenQueryHelpers(client)

// In your component setup:
const { data, isLoading } = eden.useQuery(eden.proxy.users.get)
```

- **Zero manual query keys** — derived from your route path + params
- **Response unwrapping** — Eden's `{ data, error, status }` normalised to TanStack's shape
- **Hierarchical invalidation** — mutations at `users.posts.post` invalidate `['users', 'posts']`
- **Full type inference** — `data`, `error`, and mutation payloads inferred from your Elysia endpoints

---

## Packages

| Package | Description | npm |
|---------|-------------|-----|
| [`@elysia-vue-query/core`](./packages/core) | Framework-agnostic primitives: Symbol branding, Proxy enhancer, stable serialization, query key builder | [![npm](https://img.shields.io/npm/v/@elysia-vue-query/core?style=flat-square)](https://www.npmjs.com/package/@elysia-vue-query/core) |
| [`@elysia-vue-query/vue`](./packages/vue) | Vue 3 bindings: `createEdenQueryHelpers` factory with `useQuery`, `useMutation`, `prefetch`, `invalidate`, `getKey` | [![npm](https://img.shields.io/npm/v/@elysia-vue-query/vue?style=flat-square)](https://www.npmjs.com/package/@elysia-vue-query/vue) |

---

## Quick Start

### 1. Install

```bash
bun add @elysia-vue-query/vue @tanstack/vue-query
```

### 2. Setup Vue Query

```ts
// main.ts
import { createApp } from 'vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import App from './App.vue'

createApp(App).use(VueQueryPlugin).mount('#app')
```

### 3. Create Your Eden Query Helpers

```ts
// lib/eden.ts
import { createEdenQueryHelpers } from '@elysia-vue-query/vue'
import { treaty } from '@elysiajs/eden'
import type { App } from '../server'

const client = treaty<App>('http://localhost:3000')

export const eden = createEdenQueryHelpers(client)
```

### 4. Use in Components

```vue
<script setup lang="ts">
import { eden } from '../lib/eden'

const { data: users, isLoading } = eden.useQuery(eden.proxy.users.get)
</script>

<template>
  <div v-if="isLoading">Loading...</div>
  <ul v-else>
    <li v-for="user in users" :key="user.id">{{ user.name }}</li>
  </ul>
</template>
```

---

## API Reference

### `createEdenQueryHelpers(client)`

Creates the full set of query helpers from an Eden Treaty client.

```ts
const eden = createEdenQueryHelpers(client)
```

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| `proxy` | `TClient` | Enhanced proxy that tracks route segments for key generation |
| `useQuery` | `(endpoint, options?) => UseQueryReturnType` | TanStack `useQuery` wired to an Eden endpoint |
| `useMutation` | `(endpoint, options?) => UseMutationReturnType` | TanStack `useMutation` with automatic subtree invalidation |
| `prefetch` | `(endpoint, queryClient?) => Promise<void>` | Prefetch data for SSR hydration via `prefetchQuery` |
| `invalidate` | `(endpoint, queryClient?) => Promise<void>` | Invalidate all queries matching the endpoint's route subtree |
| `getKey` | `(endpoint) => EdenQueryKey` | Extract the stable, deterministic query key tuple |

---

### `useQuery`

```ts
const { data, isLoading, error } = eden.useQuery(eden.proxy.users.get)

// With params
const { data } = eden.useQuery(
  eden.proxy.users.get({ page: 1, limit: 10 })
)

// With TanStack Query options
const { data } = eden.useQuery(eden.proxy.users.get, {
  staleTime: 5 * 60 * 1000,
  refetchOnWindowFocus: false,
})
```

**Eden response normalization:** Eden returns `{ data: T | null, error: E | null, status: number }`.  
`useQuery` automatically unwraps this — returns `data` on success, throws `error` on failure.

---

### `useMutation`

```ts
const createUser = eden.useMutation(eden.proxy.users.post)

// In an event handler:
createUser.mutate({ name: 'Alice', email: 'alice@example.com' })
```

**Automatic subtree invalidation:** After a successful mutation, all queries matching the route's parent segments are invalidated. A mutation at `users.post` invalidates `['users']`, automatically refetching any `users.get` queries.

---

### `prefetch`

Prefetch data for seamless SSR hydration (Nuxt, etc.):

```ts
// In a Nuxt plugin or middleware
await eden.prefetch(eden.proxy.users.get, queryClient)
```

---

### `invalidate`

Manually invalidate queries by route:

```ts
// Invalidate all user queries
await eden.invalidate(eden.proxy.users)

// Invalidate specific sub-route
await eden.invalidate(eden.proxy.users.posts)
```

---

### `getKey`

Extract the deterministic query key for manual TanStack Query operations:

```ts
const key = eden.getKey(eden.proxy.users.get)
// => [Symbol('eden_route'), 'users', 'get']

const keyWithParams = eden.getKey(
  eden.proxy.users.get({ page: 1 })
)
// => [Symbol('eden_route'), 'users', { page: 1 }, 'get']
```

---

## Architecture

Query keys follow a canonical shape:

```
[EDEN_ROUTE_SYMBOL, ...segments, serializedParams?, method?]
```

- `EDEN_ROUTE_SYMBOL` namespaces eden keys so they never collide with yours
- Segments enable hierarchical partial matching for invalidation
- Params are deterministically serialised (sorted keys, no `undefined`)
- Methods come last for narrowest matching

Parameters go through `stableSerialize` which sorts keys, strips `undefined`, and throws on non-serialisable types (Date, Set, Map, Function) at key-construction time.

---

## Development

```bash
bun install          # install
bun run build        # build all packages
bun run test         # run tests
bun run typecheck    # typecheck all packages
```

---

## License

MIT — [Saku Shiina](mailto:shiinasaku@proton.me)
