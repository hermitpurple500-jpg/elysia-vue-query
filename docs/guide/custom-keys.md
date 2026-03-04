# Custom Key Patterns

Most of the time you won't need these. But when you do — optimistic updates, cross-route invalidation, manual cache reads — here's how.

## Exact vs. partial keys

`getKey()` gives you the exact key for one query. `buildPartialKey()` gives you a prefix that matches everything under a route.

```ts
import { buildPartialKey } from '@elysia-vue-query/core'

// exact — one query
const key = eden.getKey(eden.proxy.users.get)
queryClient.getQueryData(key)

// partial — all queries under 'users'
const prefix = buildPartialKey('users')
queryClient.invalidateQueries({ queryKey: prefix })
```

## queryClient operations

```ts
const key = eden.getKey(eden.proxy.users.get)

queryClient.setQueryData(key, (old) => [...(old ?? []), newUser])  // optimistic
await queryClient.cancelQueries({ queryKey: key })                 // cancel
queryClient.removeQueries({ queryKey: key })                       // evict
```

## Cross-route invalidation

A mutation on one route sometimes needs to bust the cache for another route. Use `invalidate()` in the `onSuccess` callback:

```ts
const createComment = eden.useMutation(eden.proxy.posts.comments.post)

createComment.mutate(commentData, {
  onSuccess: async () => {
    await eden.invalidate(eden.proxy.posts)
  },
})
```

## Raw keys

You can build eden-shaped keys manually with `EDEN_ROUTE_SYMBOL`:

```ts
import { EDEN_ROUTE_SYMBOL } from '@elysia-vue-query/core'

const key = [EDEN_ROUTE_SYMBOL, 'users', 'get'] as const
queryClient.invalidateQueries({ queryKey: key })
```

::: warning
Manual keys bypass type safety and serialization. Use `getKey()` or `buildPartialKey()` when you can.
:::
