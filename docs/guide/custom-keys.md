# Custom Key Patterns

Most of the time you won't need these. But when you do — optimistic updates, cross-route invalidation, manual cache reads — here's how.

## Exact vs. Partial Keys

`getKey()` gives you the **exact** key for one query. `buildPartialKey()` gives you a **prefix** that matches everything under a route.

```ts
import { buildPartialKey } from '@elysia-vue-query/core'

// Exact — one specific query
const key = eden.getKey(eden.proxy.users.get)
queryClient.getQueryData(key)

// Partial — all queries under 'users'
const prefix = buildPartialKey('users')
queryClient.invalidateQueries({ queryKey: prefix })
```

## `queryClient` Operations

Common patterns using exact keys:

```ts
const key = eden.getKey(eden.proxy.users.get)

// Optimistic update
queryClient.setQueryData(key, (old) => [...(old ?? []), newUser])

// Cancel in-flight queries
await queryClient.cancelQueries({ queryKey: key })

// Evict from cache
queryClient.removeQueries({ queryKey: key })

// Read cached data
const cachedUsers = queryClient.getQueryData(key)
```

## Cross-Route Invalidation

A mutation on one route sometimes needs to bust the cache for another route. Use `invalidate()` in the `onSuccess` callback:

```ts
const createComment = eden.useMutation(eden.proxy.posts.comments.post)

createComment.mutate(commentData, {
  onSuccess: async () => {
    // Invalidate posts list (different route)
    await eden.invalidate(eden.proxy.posts)
  },
})
```

## Raw Keys

You can build eden-shaped keys manually with `EDEN_ROUTE_SYMBOL`:

```ts
import { EDEN_ROUTE_SYMBOL } from '@elysia-vue-query/core'

const key = [EDEN_ROUTE_SYMBOL, 'users', 'get'] as const
queryClient.invalidateQueries({ queryKey: key })
```

::: warning
Manual keys bypass type safety and serialization. Use `getKey()` or `buildPartialKey()` whenever possible.
:::
