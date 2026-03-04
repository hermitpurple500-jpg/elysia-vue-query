# @elysia-vue-query/core

**Framework-agnostic primitives for bridging Eden Treaty with TanStack Query.**

This package provides the foundational building blocks — Symbol branding, recursive Proxy enhancer, stable serialization, and query key construction — that power the `@elysia-vue-query/vue` bindings.

> You typically don't install this directly. It's included as a dependency of `@elysia-vue-query/vue`.

## Install

```bash
bun add @elysia-vue-query/core
```

## Exports

### `EDEN_ROUTE_SYMBOL`

A `unique symbol` used to namespace all Eden query keys. Prevents collisions with any other TanStack Query keys in your application.

```ts
import { EDEN_ROUTE_SYMBOL } from '@elysia-vue-query/core'
```

### `createEdenQueryProxy(client)`

Wraps an Eden Treaty client in a recursive Proxy that tracks route segment access, HTTP methods, and parameters via Symbol branding.

```ts
import { createEdenQueryProxy } from '@elysia-vue-query/core'

const proxy = createEdenQueryProxy(client)
// proxy.users.get → tracks ['users'] + method 'get'
// proxy.users.posts.get({ page: 1 }) → tracks ['users', 'posts'] + method 'get' + params { page: 1 }
```

**Proxy behavior:**
- Property access records route segments
- HTTP method names (`get`, `post`, `put`, `patch`, `delete`, `head`, `options`) are captured as method metadata
- Function calls capture params
- `Object.defineProperty` preserves original `name` and `length` on method proxies

### `getRouteMeta(enhanced)`

Extracts `RouteMeta` from a Symbol-branded proxy. Returns `undefined` for non-proxy values.

```ts
import { getRouteMeta } from '@elysia-vue-query/core'

const meta = getRouteMeta(proxy.users.get)
// → { segments: ['users'], method: 'get' }
```

### `buildQueryKey(enhanced)`

Constructs the canonical query key tuple from a branded proxy:

```ts
import { buildQueryKey } from '@elysia-vue-query/core'

buildQueryKey(proxy.users.get)
// → [EDEN_ROUTE_SYMBOL, 'users', 'get']

buildQueryKey(proxy.users.get({ page: 1 }))
// → [EDEN_ROUTE_SYMBOL, 'users', { page: 1 }, 'get']
```

### `buildMutationInvalidationKey(enhanced)`

Constructs a partial key for subtree invalidation — segments only, no method or params:

```ts
import { buildMutationInvalidationKey } from '@elysia-vue-query/core'

buildMutationInvalidationKey(proxy.users.post)
// → [EDEN_ROUTE_SYMBOL, 'users']
```

### `buildPartialKey(...segments)`

Manually construct a partial key for custom invalidation patterns:

```ts
import { buildPartialKey } from '@elysia-vue-query/core'

buildPartialKey('users', 'posts')
// → [EDEN_ROUTE_SYMBOL, 'users', 'posts']
```

### `stableSerialize(input)`

Deterministic serialization for query key params:

- Sorts object keys alphabetically
- Filters out `undefined` values
- Throws `TypeError` on non-serializable values (Date, Set, Map, Function)
- Returns `undefined` for `undefined` input

```ts
import { stableSerialize } from '@elysia-vue-query/core'

stableSerialize({ z: 1, a: 2 })       // → { a: 2, z: 1 }
stableSerialize({ b: 1, a: undefined }) // → { b: 1 }
stableSerialize(new Date())            // → TypeError!
```

## Types

```ts
type SerializedParam =
  | string | number | boolean | null
  | readonly SerializedParam[]
  | { readonly [key: string]: SerializedParam }

interface RouteMeta {
  readonly segments: readonly string[]
  readonly method?: string
  readonly params?: SerializedParam
}

type EdenQueryKey = readonly [typeof EDEN_ROUTE_SYMBOL, ...string[], ...[SerializedParam?, string?]]
```

## License

MIT — [Saku Shiina](mailto:shiinasaku@proton.me)
