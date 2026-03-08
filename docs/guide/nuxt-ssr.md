# Nuxt SSR & Hydration

Nuxt is the most opinionated integration path, so the package ships a dedicated module for it.

## What the module solves

Without the module, you have to:

- create and register a `QueryClient`
- dehydrate it during server rendering
- hydrate it on the client
- ensure all pages and composables share the same cache instance

`@elysia-vue-query/nuxt` handles that wiring for you.

## Install

```sh
bun add @elysia-vue-query/nuxt
```

## Register it

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ["@elysia-vue-query/nuxt"],
});
```

## Create helpers in a composable

```ts [composables/eden.ts]
import { treaty } from "@elysiajs/eden";
import { createEdenQueryHelpers } from "@elysia-vue-query/vue";
import type { App } from "@playground/api";

const client = treaty<App>("http://localhost:3000");
export const eden = createEdenQueryHelpers(client);
```

## Use queries in pages

```vue [pages/users.vue]
<script setup lang="ts">
import { eden } from "~/composables/eden";

const users = eden.useQuery(eden.proxy.users.get);
const createUser = eden.useMutation(eden.proxy.users.post);
</script>
```

## Why this avoids double fetching

On the server, Nuxt renders the page with a QueryClient that already contains prefetched results. The module dehydrates that cache into the Nuxt payload. On the client, it hydrates before the page re-runs the same query key, so TanStack can serve the cached entry.

## When to still prefetch manually

Use `eden.prefetch()` when:

- a page must be fully rendered with data on first response
- you want SEO-sensitive content in the initial HTML
- you want to warm the cache for expensive requests

```vue [pages/posts.vue]
<script setup lang="ts">
import { useQueryClient } from "@tanstack/vue-query";
import { eden } from "~/composables/eden";

const queryClient = useQueryClient();

if (import.meta.server) {
  await eden.prefetch(eden.proxy.posts.get, queryClient);
}

const posts = eden.useQuery(eden.proxy.posts.get);
</script>
```

## Practical rule

For Nuxt, start with the module. Add manual `prefetch()` only to pages where first-render completeness matters.
