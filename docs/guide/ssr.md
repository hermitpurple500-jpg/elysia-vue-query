# SSR & Prefetching

`eden.prefetch()` populates the TanStack Query cache on the server. When the client hydrates, `useQuery` finds the data already there — no extra fetch.

```ts
await eden.prefetch(eden.proxy.users.get, queryClient)
```

## Nuxt setup

### Plugin

```ts
// plugins/vue-query.ts
import {
  VueQueryPlugin,
  QueryClient,
  hydrate,
  dehydrate,
} from '@tanstack/vue-query'
import type { DehydratedState } from '@tanstack/vue-query'

export default defineNuxtPlugin((nuxt) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 5_000 } },
  })

  nuxt.vueApp.use(VueQueryPlugin, { queryClient })

  if (import.meta.server) {
    nuxt.hooks.hook('app:rendered', () => {
      nuxt.payload['vue-query'] = dehydrate(queryClient)
    })
  }

  if (import.meta.client) {
    nuxt.hooks.hook('app:created', () => {
      hydrate(queryClient, nuxt.payload['vue-query'] as DehydratedState)
    })
  }
})
```

### Page-level prefetch

```vue
<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query'
import { eden } from '~/lib/eden'

const queryClient = useQueryClient()

if (import.meta.server) {
  await eden.prefetch(eden.proxy.users.get, queryClient)
}

const { data: users } = eden.useQuery(eden.proxy.users.get)
</script>
```

### Route middleware

```ts
// middleware/prefetch-users.ts
export default defineNuxtRouteMiddleware(async () => {
  if (!import.meta.server) return
  const queryClient = useQueryClient()
  await eden.prefetch(eden.proxy.users.get, queryClient)
})
```

## Parameterized prefetch

```ts
await eden.prefetch(eden.proxy.users({ id: '1' }).get, queryClient)
await eden.prefetch(eden.proxy.users.get({ page: 1, limit: 20 }), queryClient)
```

## How hydration works

```
Server                          Client
  │                               │
  ├─ prefetch(users.get)          │
  ├─ cache populated              │
  ├─ dehydrate → payload          │
  │                               │
  ├──── HTML + payload ──────────►│
  │                               ├─ hydrate(payload)
  │                               ├─ useQuery(users.get)
  │                               └─ cache hit, no fetch
```

TanStack Query handles the serialization and hydration. elysia-vue-query just calls `prefetchQuery` with the right key and function.
