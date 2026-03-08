# Query Keys

TanStack Query caches by key. `elysia-vue-query` generates those keys from the route structure so you do not have to hand-maintain string arrays.

## Basic shape

```ts
eden.proxy.users.get
// => [EDEN_ROUTE_SYMBOL, 'users', 'get']
```

When params are present, they are inserted before the method:

```ts
eden.proxy.users.get({ page: 1, limit: 20 })
// => [EDEN_ROUTE_SYMBOL, 'users', { limit: 20, page: 1 }, 'get']
```

## Why this is stable

- every key starts with `EDEN_ROUTE_SYMBOL`
- object params are serialized with sorted keys
- `undefined` object fields are removed
- equal requests produce equal keys even if object field order differs

## Nested routes

```ts
eden.proxy.users.posts.comments.get
// => [EDEN_ROUTE_SYMBOL, 'users', 'posts', 'comments', 'get']
```

## Manual key access

Use `getKey()` when you need to talk to `queryClient` directly.

```ts
const key = eden.getKey(eden.proxy.users.get)

queryClient.getQueryData(key)
queryClient.setQueryData(key, newData)
```

## Prefix keys

For subtree invalidation or other prefix-matching operations, use `buildPartialKey()` from core.

```ts
import { buildPartialKey } from '@elysia-vue-query/core'

queryClient.invalidateQueries({
  queryKey: buildPartialKey('users'),
})
```

## Related guides

- [Cache Invalidation](/guide/cache-invalidation)
- [Serialization](/guide/serialization)
- [Custom Key Patterns](/guide/custom-keys)
