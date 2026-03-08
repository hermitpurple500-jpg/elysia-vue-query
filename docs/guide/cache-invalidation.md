# Cache Invalidation

Mutations automatically invalidate their parent subtree. You can also trigger invalidation manually for fine-grained control.

## Automatic Invalidation (Mutations)

Every `eden.useMutation()` invalidates its parent segments when it succeeds:

```ts
eden.useMutation(eden.proxy.users.post)
// → invalidates [Symbol, 'users']

eden.useMutation(eden.proxy.users.posts.post)
// → invalidates [Symbol, 'users', 'posts']
```

The invalidation key uses **segments only** — no method, no params. So `users.post` invalidates `users.get`, `users.get({page:1})`, and every other query under `users`.

## Manual Invalidation

Use `eden.invalidate()` for explicit cache busting:

```ts
// Invalidate all user queries
await eden.invalidate(eden.proxy.users)

// Invalidate just user posts
await eden.invalidate(eden.proxy.users.posts)
```

For SSR contexts, pass a `queryClient` explicitly:

```ts
await eden.invalidate(eden.proxy.users, queryClient)
```

## Cross-Route Invalidation

When a mutation on one route needs to bust the cache for a different route:

```ts
const createComment = eden.useMutation(eden.proxy.posts.comments.post)

createComment.mutate(commentData, {
  onSuccess: async () => {
    // Also invalidate the posts list
    await eden.invalidate(eden.proxy.posts)
  },
})
```

## Direct `queryClient` Access

Use `getKey()` when you need the raw key for `queryClient` operations:

```ts
const key = eden.getKey(eden.proxy.users.get)

queryClient.removeQueries({ queryKey: key })
queryClient.setQueryData(key, newData)
await queryClient.cancelQueries({ queryKey: key })
```

For subtree operations, `buildPartialKey()` from core gives you a prefix key:

```ts
import { buildPartialKey } from '@elysia-vue-query/core'

const prefix = buildPartialKey('users')
queryClient.invalidateQueries({ queryKey: prefix })
```

::: info
`invalidateQueries` marks matching queries as stale, triggering a refetch for any active ones. `removeQueries` deletes them from the cache entirely.
:::
