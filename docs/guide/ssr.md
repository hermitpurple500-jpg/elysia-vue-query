# SSR & Prefetching

`eden.prefetch()` exists for frameworks where you want TanStack Query cache population on the server before hydration.

```ts
await eden.prefetch(eden.proxy.users.get, queryClient);
```

If the same key is used on the client, hydration becomes a cache hit instead of a second network request.

## Recommended path: Nuxt module

If you are on Nuxt, use `@elysia-vue-query/nuxt`. It sets up the QueryClient and hydration lifecycle for you.

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ["@elysia-vue-query/nuxt"],
});
```

See [Nuxt SSR](/guide/nuxt-ssr) for the full flow.

## Manual prefetch flow

When you are not using the Nuxt module, the pattern is still straightforward:

1. Create a `QueryClient` for the server request.
2. Call `eden.prefetch()` for every route you want in the initial payload.
3. Dehydrate the QueryClient into the rendered HTML.
4. Hydrate it on the client before the app starts issuing reads.

```ts [server-entry.ts]
import { QueryClient, dehydrate } from "@tanstack/vue-query";

const queryClient = new QueryClient();

await eden.prefetch(eden.proxy.users.get, queryClient);

const payload = dehydrate(queryClient);
```

## Parameterized prefetch

```ts
await eden.prefetch(eden.proxy.users.get({ page: 1 }), queryClient);
await eden.prefetch(eden.proxy.users["42"].profile.get, queryClient);
```

The same deterministic key generation applies on the server, so the client reads line up automatically.

## Page-level Nuxt example

```vue [pages/users.vue]
<script setup lang="ts">
import { useQueryClient } from "@tanstack/vue-query";
import { eden } from "~/composables/eden";

const queryClient = useQueryClient();

if (import.meta.server) {
  await eden.prefetch(eden.proxy.users.get, queryClient);
}

const users = eden.useQuery(eden.proxy.users.get);
</script>
```

## Hydration timeline

```text
server request
  -> prefetch query
  -> TanStack cache populated
  -> dehydrate cache into payload

client boot
  -> hydrate TanStack cache
  -> useQuery reads the existing entry
  -> no duplicate fetch unless data is stale
```

That is the entire contract. `elysia-vue-query` does not replace TanStack hydration; it feeds TanStack the right keys and request functions.
