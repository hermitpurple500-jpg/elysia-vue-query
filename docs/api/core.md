# Core API

The core package contains the framework-agnostic primitives that power the Vue helpers.

## `EDEN_ROUTE_SYMBOL`

```ts
import { EDEN_ROUTE_SYMBOL } from '@elysia-vue-query/core'
```

Every generated query key starts with this unique symbol. That makes collisions with unrelated query keys effectively impossible.

## `createEdenQueryProxy(client)`

```ts
function createEdenQueryProxy<TClient>(client: TClient): TClient
```

Wraps the Eden client in a recursive proxy that records:

- route segments
- HTTP method
- serialized params

Examples of what gets tracked:

| Access pattern | Recorded metadata |
| --- | --- |
| `proxy.users` | `segments: ['users']` |
| `proxy.users.posts` | `segments: ['users', 'posts']` |
| `proxy.users.get` | `segments: ['users']`, `method: 'get'` |
| `proxy.users.get({ page: 1 })` | `segments: ['users']`, `method: 'get'`, `params: { page: 1 }` |

## `getRouteMeta(enhanced)`

```ts
function getRouteMeta(enhanced: unknown): RouteMeta | undefined
```

Extracts the branded metadata from a proxied endpoint. Returns `undefined` for non-enhanced values.

## `buildQueryKey(enhanced)`

```ts
function buildQueryKey(enhanced: unknown): EdenQueryKey
```

Constructs the canonical key shape:

```text
[EDEN_ROUTE_SYMBOL, ...segments, serializedParams?, method?]
```

Examples:

```ts
buildQueryKey(proxy.users.get)
buildQueryKey(proxy.users.get({ page: 1, limit: 20 }))
buildQueryKey(proxy.users.posts.comments.get)
```

## `buildMutationInvalidationKey(enhanced)`

```ts
function buildMutationInvalidationKey(
  enhanced: unknown,
): readonly [typeof EDEN_ROUTE_SYMBOL, ...string[]]
```

Builds a prefix key for invalidation. It intentionally excludes method and params.

```ts
buildMutationInvalidationKey(proxy.users.post)
// => [EDEN_ROUTE_SYMBOL, 'users']
```

## `buildPartialKey(...segments)`

```ts
function buildPartialKey(...segments: string[]): readonly [typeof EDEN_ROUTE_SYMBOL, ...string[]]
```

Use this when you want custom invalidation logic while staying inside the same symbol namespace.

## `stableSerialize(input)`

```ts
function stableSerialize(input: unknown): SerializedParam | undefined
```

This serializer is what makes equal param objects produce equal query keys.

### Rules

- object keys are sorted recursively
- `undefined` object fields are removed
- arrays keep order
- primitives pass through unchanged
- unsupported runtime values such as `Date`, `Map`, `Set`, and functions throw

### Why it matters

Without stable serialization, route params that are semantically equal could still miss the cache because of object key ordering differences.
