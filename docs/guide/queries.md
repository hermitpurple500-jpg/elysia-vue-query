# Queries

`eden.useQuery()` wraps TanStack's `useQuery`. You pass it an endpoint, and it handles the key and the response unwrapping.

## Basic usage

```vue
<script setup lang="ts">
import { eden } from '../lib/eden'

const { data: users, isLoading, error } = eden.useQuery(eden.proxy.users.get)
// data type is inferred from your Elysia endpoint definition
</script>

<template>
  <div v-if="isLoading">Loading...</div>
  <div v-else-if="error">{{ error.message }}</div>
  <ul v-else>
    <li v-for="user in users" :key="user.id">{{ user.name }}</li>
  </ul>
</template>
```

## Parameters

Call the endpoint to pass params. They become part of the query key:

```ts
const { data } = eden.useQuery(
  eden.proxy.users.get({ page: 1, limit: 20 })
)
// key: [Symbol, 'users', { limit: 20, page: 1 }, 'get']
```

## TanStack options

Everything except `queryKey` and `queryFn` is passed through:

```ts
const { data } = eden.useQuery(eden.proxy.users.get, {
  staleTime: 5 * 60 * 1000,
  refetchOnWindowFocus: false,
  enabled: isAuthenticated.value,
  retry: 3,
})
```

## What happens to Eden's response

Eden returns `{ data, error, status }`. You never see this — the adapter unwraps it:

- Success → `data` is returned to TanStack as the query result
- Failure (`error !== null`) → the error is thrown, landing in the `error` ref

## Dependent queries

Standard Vue Query patterns work:

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { eden } from '../lib/eden'

const { data: user } = eden.useQuery(eden.proxy.users({ id: '1' }).get)

const { data: posts } = eden.useQuery(
  eden.proxy.users({ id: '1' }).posts.get,
  { enabled: computed(() => !!user.value) }
)
</script>
```
