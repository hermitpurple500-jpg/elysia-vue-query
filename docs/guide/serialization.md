# Serialization

TanStack Query matches keys with structural equality, so `{ z: 1, a: 2 }` and `{ a: 2, z: 1 }` produce different cache entries. elysia-vue-query solves this by sorting object keys deterministically before they become part of a query key.

You don't need to do anything — this happens automatically.

## `stableSerialize()`

Sorts keys alphabetically, strips `undefined` properties, and recurses into nested objects and arrays.

```ts
import { stableSerialize } from '@elysia-vue-query/core'

stableSerialize({ z: 1, a: 2 })           // → { a: 2, z: 1 }
stableSerialize({ b: 1, a: undefined })    // → { b: 1 }
stableSerialize({ n: { c: 3, a: 1 } })    // → { n: { a: 1, c: 3 } }
```

## What's allowed

Primitives (`string`, `number`, `boolean`, `null`), plain objects, and arrays pass through. `undefined` is stripped from object properties.

`Date`, `Set`, `Map`, and `Function` all throw a `TypeError` — convert them to primitives first:

```ts
stableSerialize(new Date())
// TypeError: Cannot serialize value of type Date for query key.
//   Convert to a primitive (e.g., .toISOString()) before passing.
```

These errors fire at key-construction time, not when the query runs, so you catch them early.
