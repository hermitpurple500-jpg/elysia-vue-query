# @elysia-vue-query/core

Framework-agnostic primitives for bridging Eden Treaty with TanStack Query.

[![Version](https://npmx.dev/api/registry/badge/version/@elysia-vue-query/core?labelColor=030712&color=f06292)](https://npmx.dev/package/@elysia-vue-query/core)
[![License](https://npmx.dev/api/registry/badge/license/@elysia-vue-query/core?labelColor=030712&color=4ade80)](https://npmx.dev/package/@elysia-vue-query/core)
[![Types](https://npmx.dev/api/registry/badge/types/@elysia-vue-query/core?labelColor=030712&color=3b82f6)](https://npmx.dev/package/@elysia-vue-query/core)

---

## Role in the Monorepo

This package provides the foundational layer that all framework-specific bindings depend on:

- **Proxy enhancer** -- Wraps an Eden Treaty client in a recursive `Proxy` that tracks route segments, HTTP methods, and parameters via `Symbol` branding.
- **Query key builder** -- Constructs deterministic, hierarchical key tuples from branded proxy references.
- **Stable serialization** -- Sorts object keys alphabetically and strips `undefined` values, ensuring identical parameters always produce identical cache keys.
- **Symbol namespacing** -- `EDEN_ROUTE_SYMBOL` prevents collisions with any other TanStack Query keys in the application.

You typically do not install this package directly. It is included as a dependency of `@elysia-vue-query/vue` and `@elysia-vue-query/nuxt`.

## Install

```bash
bun add @elysia-vue-query/core
```

## Exports

| Export | Description |
|--------|-------------|
| `EDEN_ROUTE_SYMBOL` | Unique symbol used to namespace all Eden query keys |
| `createEdenQueryProxy(client)` | Wraps an Eden client in a segment-tracking proxy |
| `getRouteMeta(enhanced)` | Extracts `RouteMeta` from a branded proxy |
| `buildQueryKey(enhanced)` | Builds the canonical query key tuple |
| `buildMutationInvalidationKey(enhanced)` | Builds a partial key for subtree invalidation |
| `buildPartialKey(...segments)` | Manually constructs a partial key |
| `stableSerialize(input)` | Deterministic serialization for cache key params |

## Documentation

Full API reference and usage guide:
**[Docs](https://elysia-vue.pages.dev/api/core)**

## License

[MIT](../../LICENSE)
