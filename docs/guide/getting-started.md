# Getting Started

This guide walks through the standard setup for a Vue app: create the client, wrap it with helpers, fetch data, then perform a mutation.

## 1. Register TanStack Query once

```ts [src/main.ts]
import { createApp } from 'vue'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import App from './App.vue'

const app = createApp(App)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
    },
  },
})

app.use(VueQueryPlugin, { queryClient })
app.mount('#app')
```

## 2. Create typed Eden helpers

```ts twoslash [src/lib/eden.ts]
interface User {
  id: number
  name: string
  email: string
}

interface AppClient {
  users: {
    get: () => Promise<{
      data: User[]
      error: null
      status: 200
    }>
    post: (body: { name: string; email: string }) => Promise<{
      data: User
      error: null
      status: 201
    }>
  }
}

declare function createEdenQueryHelpers(client: AppClient): {
  proxy: AppClient
  useQuery(endpoint: AppClient['users']['get']): {
    data: { value: User[] | undefined }
  }
  useMutation(endpoint: AppClient['users']['post']): {
    mutate: (body: { name: string; email: string }) => void
  }
}

declare const client: AppClient
export const eden = createEdenQueryHelpers(client)

const query = eden.useQuery(eden.proxy.users.get)
query.data
//   ^?

const mutation = eden.useMutation(eden.proxy.users.post)
mutation.mutate
//       ^?
```

The `twoslash` marker enables VS Code-style hover information in the docs. Hover `query.data` or `mutation.mutate` in the rendered page to inspect the inferred types.

## 3. Read data in a component

Pass the endpoint reference itself, not the result of calling it.

```vue [src/components/UserList.vue]
<script setup lang="ts">
import { eden } from '../lib/eden'

const { data: users, isLoading, error } = eden.useQuery(eden.proxy.users.get, {
  staleTime: 60_000,
})
</script>

<template>
  <p v-if="isLoading">Loading users...</p>
  <p v-else-if="error">Request failed: {{ error.message }}</p>

  <ul v-else>
    <li v-for="user in users" :key="user.id">
      {{ user.name }} · {{ user.email }}
    </li>
  </ul>
</template>
```

What happens under the hood:

- the route path becomes the query key
- the Eden response is unwrapped automatically
- the component receives the inferred success data type

## 4. Write data with automatic invalidation

```vue [src/components/CreateUser.vue]
<script setup lang="ts">
import { ref } from 'vue'
import { eden } from '../lib/eden'

const name = ref('')
const email = ref('')

const createUser = eden.useMutation(eden.proxy.users.post)

function submit() {
  createUser.mutate(
    { name: name.value, email: email.value },
    {
      onSuccess: () => {
        name.value = ''
        email.value = ''
      },
    },
  )
}
</script>

<template>
  <form @submit.prevent="submit">
    <input v-model="name" placeholder="Name" />
    <input v-model="email" placeholder="Email" />
    <button :disabled="createUser.isPending.value" type="submit">
      {{ createUser.isPending.value ? 'Saving...' : 'Create user' }}
    </button>
  </form>
</template>
```

When the mutation succeeds, all `users.*` queries are invalidated automatically.

## 5. Use parameters when needed

```ts twoslash
type UserDetailsRoute = (params: { id: string }) => Promise<{
  data: { id: string; name: string }
  error: null
  status: 200
}>

declare const route: UserDetailsRoute

route
// ^?
```

In the real helper API, calling `eden.proxy.users.get({ page: 1 })` or `eden.proxy.users[id].profile.get` feeds those params into both the request and the deterministic query key.

## Next steps

- [Queries](/guide/queries) for filters, refs, and TanStack options
- [Mutations](/guide/mutations) for callbacks and optimistic updates
- [Nuxt SSR](/guide/nuxt-ssr) if you want server rendering without plugin boilerplate
