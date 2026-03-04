# @elysia-vue-query/vue

**Vue 3 bindings for elysia-vue-query — type-safe TanStack Query integration with Elysia Eden Treaty.**

## Install

```bash
bun add @elysia-vue-query/vue @tanstack/vue-query
```

## Setup

### 1. Configure Vue Query

```ts
// main.ts
import { createApp } from 'vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import App from './App.vue'

createApp(App).use(VueQueryPlugin).mount('#app')
```

### 2. Create Eden Query Helpers

```ts
// lib/eden.ts
import { createEdenQueryHelpers } from '@elysia-vue-query/vue'
import { treaty } from '@elysiajs/eden'
import type { App } from '../server'

const client = treaty<App>('http://localhost:3000')

export const eden = createEdenQueryHelpers(client)
```

## API

### `createEdenQueryHelpers(client)`

Factory function that returns the full query helper object.

```ts
const eden = createEdenQueryHelpers(client)
```

Returns: `EdenQueryHelpers<TClient>`

---

### `eden.useQuery(endpoint, options?)`

Wraps TanStack's `useQuery` with automatic key generation and Eden response unwrapping.

```vue
<script setup lang="ts">
import { eden } from '../lib/eden'

// Simple query
const { data, isLoading, error } = eden.useQuery(eden.proxy.users.get)

// With parameters (deterministic keys)
const { data: page } = eden.useQuery(
  eden.proxy.users.get({ page: 1, limit: 20 })
)

// With TanStack Query options
const { data: cached } = eden.useQuery(eden.proxy.users.get, {
  staleTime: 5 * 60 * 1000,
  refetchOnWindowFocus: false,
})
</script>
```

**Response normalization:** Eden returns `{ data: T | null, error: E | null, status: number }`. The wrapper automatically returns `data` on success and throws `error` on failure — matching TanStack Query's expected behavior.

---

### `eden.useMutation(endpoint, options?)`

Wraps TanStack's `useMutation` with automatic subtree cache invalidation.

```vue
<script setup lang="ts">
import { eden } from '../lib/eden'

const createUser = eden.useMutation(eden.proxy.users.post)

function handleSubmit(formData: { name: string; email: string }) {
  createUser.mutate(formData)
}
</script>
```

**Automatic invalidation:** After a successful mutation, all queries matching the route's parent segments are invalidated via TanStack's partial key matching. A `.post` at `users` invalidates all `users.*` queries.

---

### `eden.prefetch(endpoint, queryClient?)`

Prefetch data using TanStack's `prefetchQuery` for SSR hydration:

```ts
// Nuxt plugin, middleware, or server-side setup
await eden.prefetch(eden.proxy.users.get, queryClient)
```

---

### `eden.invalidate(endpoint, queryClient?)`

Manually invalidate all queries matching a route subtree:

```ts
// Invalidate everything under 'users'
await eden.invalidate(eden.proxy.users)

// Invalidate only 'users.posts' subtree
await eden.invalidate(eden.proxy.users.posts)
```

---

### `eden.getKey(endpoint)`

Extract the stable, deterministic query key for manual TanStack operations:

```ts
const key = eden.getKey(eden.proxy.users.get)
// Use with queryClient.getQueryData(key), setQueryData, etc.
```

---

### `eden.proxy`

The enhanced proxy wrapping your Eden client. Use it to reference endpoints:

```ts
eden.proxy.users.get            // GET /users
eden.proxy.users.post           // POST /users
eden.proxy.users.get({ page: 1 }) // GET /users?page=1
eden.proxy.posts.comments.get   // GET /posts/comments
```

## Type Inference

All `data`, `error`, and mutation variable types are inferred directly from your Elysia endpoint definitions — no manual generics needed:

```ts
// If your Elysia server defines:
// app.get('/users', () => [{ id: 1, name: 'Alice' }])

const { data } = eden.useQuery(eden.proxy.users.get)
//      ^? Ref<{ id: number; name: string }[] | undefined>
```

## Types

```ts
interface EdenQueryHelpers<TClient> {
  readonly proxy: TClient
  useQuery(endpoint, options?): UseQueryReturnType
  useMutation(endpoint, options?): UseMutationReturnType
  prefetch(endpoint, queryClient?): Promise<void>
  invalidate(endpoint, queryClient?): Promise<void>
  getKey(endpoint): EdenQueryKey
}

interface EdenUseQueryOptions<TData, TError>
  extends Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'> {}

interface EdenUseMutationOptions<TData, TError, TVariables>
  extends Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'> {}
```

## License

MIT — [Saku Shiina](mailto:shiinasaku@proton.me)
