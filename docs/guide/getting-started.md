# Getting Started

A walkthrough for adding elysia-vue-query to a Vue 3 app with an Elysia backend.

## Prerequisites

- [Bun](https://bun.sh) or Node.js 18+
- An [Elysia](https://elysiajs.com) server
- A Vue 3 app with [VueQueryPlugin](https://tanstack.com/query/latest/docs/vue/overview) installed

## 1. Install

::: code-group

```bash [bun]
bun add @elysia-vue-query/vue @tanstack/vue-query @elysiajs/eden
```

```bash [pnpm]
pnpm add @elysia-vue-query/vue @tanstack/vue-query @elysiajs/eden
```

```bash [npm]
npm install @elysia-vue-query/vue @tanstack/vue-query @elysiajs/eden
```

:::

`@elysia-vue-query/core` comes along as a dependency — you don't install it separately.

## 2. Export your server type

Eden Treaty needs the inferred type of your Elysia app. Export it from wherever you define your server:

```ts
// server.ts
import { Elysia, t } from 'elysia'

const app = new Elysia()
  .get('/users', () => db.users.findMany(), {
    response: t.Array(t.Object({
      id: t.Number(),
      name: t.String(),
      email: t.String(),
    })),
  })
  .post('/users', ({ body }) => db.users.create(body), {
    body: t.Object({
      name: t.String(),
      email: t.String({ format: 'email' }),
    }),
  })
  .listen(3000)

export type App = typeof app // ← this is the important line
```

## 3. Set up Vue Query

If you haven't already:

```ts
// main.ts
import { createApp } from 'vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import App from './App.vue'

createApp(App)
  .use(VueQueryPlugin, {
    queryClientConfig: {
      defaultOptions: { queries: { staleTime: 5_000 } },
    },
  })
  .mount('#app')
```

## 4. Create the helpers

One file, used everywhere:

```ts
// lib/eden.ts
import { createEdenQueryHelpers } from '@elysia-vue-query/vue'
import { treaty } from '@elysiajs/eden'
import type { App } from '../server'

const client = treaty<App>('http://localhost:3000')
export const eden = createEdenQueryHelpers(client)
```

## 5. Query and mutate

```vue
<script setup lang="ts">
import { eden } from '../lib/eden'

const { data: users, isLoading, error } = eden.useQuery(eden.proxy.users.get)

const createUser = eden.useMutation(eden.proxy.users.post)

function handleSubmit(name: string, email: string) {
  createUser.mutate({ name, email })
  // users.get refetches automatically after this succeeds
}
</script>

<template>
  <div v-if="isLoading">Loading...</div>
  <div v-else-if="error">{{ error.message }}</div>
  <ul v-else>
    <li v-for="user in users" :key="user.id">
      {{ user.name }} — {{ user.email }}
    </li>
  </ul>

  <button
    @click="handleSubmit('Alice', 'alice@example.com')"
    :disabled="createUser.isPending.value"
  >
    Add User
  </button>
</template>
```

## What's next

- [Query Keys](/guide/query-keys) — how they're generated and why they're stable
- [Mutations](/guide/mutations) — automatic invalidation in detail
- [SSR](/guide/ssr) — prefetching for Nuxt
- [API Reference](/api/vue) — full function signatures
