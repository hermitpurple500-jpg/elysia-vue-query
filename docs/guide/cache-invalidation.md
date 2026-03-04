# Cache Invalidation

Mutations automatically invalidate their parent subtree. You can also invalidate manually.

## Automatic (mutations)

Every `eden.useMutation()` invalidates its parent segments when it succeeds:

```ts
eden.useMutation(eden.proxy.users.post)
// → invalidates [Symbol, 'users']

eden.useMutation(eden.proxy.users.posts.post)
// → invalidates [Symbol, 'users', 'posts']
```

The invalidation key uses segments only — no method, no params. So `users.post` invalidates `users.get`, `users.get({page:1})`, and every other query under `users`.

## Manual

```ts
await eden.invalidate(eden.proxy.users)       // all user queries
await eden.invalidate(eden.proxy.users.posts)  // just user posts
```

For SSR, pass a `queryClient` explicitly:

```ts
await eden.invalidate(eden.proxy.users, queryClient)
```

## Direct queryClient access

Use `getKey()` when you need the raw key for queryClient operations:

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
