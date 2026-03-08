# Serialization

Params become part of the query key, so they need a deterministic representation.

## What `stableSerialize()` does

```ts
import { stableSerialize } from "@elysia-vue-query/core";

stableSerialize({ z: 1, a: 2 });
// => { a: 2, z: 1 }

stableSerialize({ b: 1, a: undefined });
// => { b: 1 }
```

## Rules

- plain object keys are sorted recursively
- arrays keep their order
- `undefined` fields inside objects are removed
- `string`, `number`, `boolean`, and `null` pass through

## Unsupported values

These throw at key-construction time:

- `Date`
- `Set`
- `Map`
- functions

```ts
stableSerialize(new Date());
// TypeError: Non-serializable value at "root": [object Date]
```

Convert those values to primitives before passing them as route params.

```ts
eden.proxy.logs.get({ since: new Date().toISOString() });
```
