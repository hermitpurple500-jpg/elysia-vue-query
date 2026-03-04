# Core API

Framework-agnostic primitives. You usually won't import these directly — the vue package re-exports what you need.

## `EDEN_ROUTE_SYMBOL`

```ts
import { EDEN_ROUTE_SYMBOL } from '@elysia-vue-query/core'
```

A `unique symbol` used to namespace all eden query keys. Prevents collisions with any other query keys in your application.

```ts
const key = buildQueryKey(proxy.users.get)
key[0] === EDEN_ROUTE_SYMBOL // true
```

Also exported as `routeSymbol` (alias).

---

## `createEdenQueryProxy(client)`

```ts
function createEdenQueryProxy<TClient>(client: TClient): TClient
```

Wraps an Eden Treaty client in a recursive Proxy that tracks route segment access, HTTP methods, and parameters via Symbol branding.

### Parameters

| Param | Type | Description |
|-------|------|-------------|
| `client` | `TClient` | An Eden Treaty client instance |

### Returns

`TClient` — enhanced with internal Symbol metadata for key generation.

### Behavior

| Access Pattern | Tracked As |
|---------------|------------|
| `proxy.users` | Segment: `'users'` |
| `proxy.users.posts` | Segments: `['users', 'posts']` |
| `proxy.users.get` | Segments: `['users']`, Method: `'get'` |
| `proxy.users.get({ page: 1 })` | Segments: `['users']`, Method: `'get'`, Params: `{ page: 1 }` |

### HTTP Methods

The following property names are recognized as HTTP methods:
`get`, `post`, `put`, `patch`, `delete`, `head`, `options`

---

## `getRouteMeta(enhanced)`

```ts
function getRouteMeta(enhanced: unknown): RouteMeta | undefined
```

Extracts route metadata from a Symbol-branded proxy.

### Parameters

| Param | Type | Description |
|-------|------|-------------|
| `enhanced` | `unknown` | A proxy-enhanced value |

### Returns

`RouteMeta | undefined` — returns `undefined` for non-proxy values.

```ts
const meta = getRouteMeta(proxy.users.get)
// → { segments: ['users'], method: 'get' }

const metaWithParams = getRouteMeta(proxy.users.get({ page: 1 }))
// → { segments: ['users'], method: 'get', params: { page: 1 } }

getRouteMeta('not a proxy')
// → undefined
```

---

## `buildQueryKey(enhanced)`

```ts
function buildQueryKey(enhanced: unknown): EdenQueryKey
```

Constructs the canonical query key tuple from a branded proxy.

### Key Format

```
[EDEN_ROUTE_SYMBOL, ...segments, serializedParams?, method?]
```

### Examples

```ts
buildQueryKey(proxy.users.get)
// → [Symbol, 'users', 'get']

buildQueryKey(proxy.users.get({ page: 1, limit: 20 }))
// → [Symbol, 'users', { limit: 20, page: 1 }, 'get']

buildQueryKey(proxy.users.posts.comments.get)
// → [Symbol, 'users', 'posts', 'comments', 'get']
```

### Throws

`Error` if the input doesn't have valid route metadata.

---

## `buildMutationInvalidationKey(enhanced)`

```ts
function buildMutationInvalidationKey(enhanced: unknown): readonly [typeof EDEN_ROUTE_SYMBOL, ...string[]]
```

Constructs a partial key for subtree invalidation — **segments only**, no method or params.

```ts
buildMutationInvalidationKey(proxy.users.post)
// → [Symbol, 'users']

buildMutationInvalidationKey(proxy.users.posts.post)
// → [Symbol, 'users', 'posts']
```

This key matches all queries under the same route prefix via TanStack's `partialDeepEqual`.

---

## `buildPartialKey(...segments)`

```ts
function buildPartialKey(...segments: string[]): readonly [typeof EDEN_ROUTE_SYMBOL, ...string[]]
```

Manually construct a partial key for custom invalidation patterns.

```ts
buildPartialKey('users')
// → [Symbol, 'users']

buildPartialKey('users', 'posts')
// → [Symbol, 'users', 'posts']
```

---

## `stableSerialize(input)`

```ts
function stableSerialize(input: unknown): SerializedParam | undefined
```

Deterministic serialization for query key params.

### Behavior

- Sorts object keys alphabetically (recursive)
- Filters `undefined` values from objects
- Passes through primitives (`string`, `number`, `boolean`, `null`)
- Processes arrays element-by-element (preserves order)
- Throws `TypeError` on `Date`, `Set`, `Map`, `Function`

### Examples

```ts
stableSerialize({ z: 1, a: 2 })       // → { a: 2, z: 1 }
stableSerialize({ b: 1, a: undefined }) // → { b: 1 }
stableSerialize(undefined)             // → undefined
stableSerialize(42)                    // → 42
stableSerialize([3, 1, 2])            // → [3, 1, 2]
stableSerialize(new Date())           // TypeError!
```
