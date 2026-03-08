# @elysia-vue-query/vue

Vue 3 bindings for elysia-vue-query -- type-safe TanStack Query integration with Elysia Eden Treaty.

[![Version](https://npmx.dev/api/registry/badge/version/@elysia-vue-query/vue?labelColor=030712&color=f06292)](https://npmx.dev/package/@elysia-vue-query/vue)
[![License](https://npmx.dev/api/registry/badge/license/@elysia-vue-query/vue?labelColor=030712&color=4ade80)](https://npmx.dev/package/@elysia-vue-query/vue)
[![Downloads](https://npmx.dev/api/registry/badge/downloads/@elysia-vue-query/vue?labelColor=030712&color=f06292)](https://npmx.dev/package/@elysia-vue-query/vue)

---

## Role in the Monorepo

This is the primary package most Vue applications install. It provides `createEdenQueryHelpers`, a factory that wraps an Eden Treaty client and returns a complete set of query helpers:

| Helper | Description |
|--------|-------------|
| `useQuery` | TanStack `useQuery` with automatic key derivation and Eden response unwrapping |
| `useMutation` | TanStack `useMutation` with automatic subtree cache invalidation |
| `prefetch` | Prefetch data for SSR hydration via `prefetchQuery` |
| `invalidate` | Invalidate all queries matching a route subtree |
| `getKey` | Extract the deterministic query key for manual operations |
| `proxy` | The enhanced proxy used to reference endpoints |

## Install

```bash
bun add @elysia-vue-query/vue @tanstack/vue-query @elysiajs/eden
```

## Quick Start

```ts
// lib/eden.ts
import { createEdenQueryHelpers } from '@elysia-vue-query/vue'
import { treaty } from '@elysiajs/eden'
import type { App } from '../server'

const client = treaty<App>('http://localhost:3000')
export const eden = createEdenQueryHelpers(client)
```

```vue
<script setup lang="ts">
import { eden } from '../lib/eden'

const { data: users, isLoading } = eden.useQuery(eden.proxy.users.get)
const createUser = eden.useMutation(eden.proxy.users.post)
</script>
```

## Documentation

Full API reference, usage patterns, and examples:
**[elysia-vue-query.github.io/elysia-vue-query/api/vue](https://elysia-vue.pages.dev/api/vue)**

## License

[MIT](../../LICENSE)
