# Query Keys

TanStack Query's caching revolves around keys. elysia-vue-query makes them automatic.

## How it works

When you write `eden.proxy.users.get`, a recursive Proxy records each property access. The resulting key:

```
[EDEN_ROUTE_SYMBOL, 'users', 'get']
 ──────┬─────────   ──┬──   ──┬──
   collision-proof   route   HTTP
   namespace         segment  method
```

Add params and they get inserted before the method:

```ts
eden.proxy.users.get({ page: 1, limit: 20 })
// → [Symbol('eden_route'), 'users', { limit: 20, page: 1 }, 'get']
//                                    ↑ keys sorted, always
```

## Stable param serialization

Object keys are sorted alphabetically so the same logical query always hits the same cache entry:

```ts
// identical keys — order doesn't matter
eden.proxy.users.get({ z: 1, a: 2 })
eden.proxy.users.get({ a: 2, z: 1 })
// both → [Symbol, 'users', { a: 2, z: 1 }, 'get']
```

`undefined` values are stripped. Non-serializable types (`Date`, `Set`, `Map`, `Function`) throw a `TypeError` at key-construction time so you catch the mistake early.

## Symbol namespacing

The first element is a `unique symbol` — not a string. This means eden keys can never collide with any other query keys, even if something else in your app also queries `['users']`.

## Nested routes

Deep paths produce multi-segment keys:

```ts
eden.proxy.users.posts.comments.get
// → [Symbol, 'users', 'posts', 'comments', 'get']
```

## Partial key matching

TanStack Query matches keys by prefix. This is what makes invalidation work:

```
Key prefix: [Symbol, 'users']
  ✓  [Symbol, 'users', 'get']
  ✓  [Symbol, 'users', { page: 1 }, 'get']
  ✓  [Symbol, 'users', 'posts', 'get']
  ✗  [Symbol, 'posts', 'get']
```

## Extracting keys

For manual queryClient operations, use `getKey()`:

```ts
const key = eden.getKey(eden.proxy.users.get)
queryClient.getQueryData(key)
queryClient.setQueryData(key, newData)
```

Or `buildPartialKey()` from the core package for prefix-matching:

```ts
import { buildPartialKey } from '@elysia-vue-query/core'

queryClient.invalidateQueries({
  queryKey: buildPartialKey('users')
})
