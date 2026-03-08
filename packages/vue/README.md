# @elysia-vue-query/vue

Vue 3 bindings for elysia-vue-query -- type-safe TanStack Query integration with Elysia Eden Treaty.

[![npm](https://img.shields.io/npm/v/@elysia-vue-query/vue?style=flat-square)](https://www.npmjs.com/package/@elysia-vue-query/vue)
[![License](https://img.shields.io/github/license/elysia-vue-query/elysia-vue-query?style=flat-square)](https://opensource.org/licenses/MIT)

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
