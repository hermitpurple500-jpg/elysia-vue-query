# Mutations

`eden.useMutation()` wires up TanStack's `useMutation` and invalidates related queries after a successful call.

## Basic usage

```vue
<script setup lang="ts">
import { eden } from '../lib/eden'

const createUser = eden.useMutation(eden.proxy.users.post)

function handleSubmit() {
  createUser.mutate({ name: 'Alice', email: 'alice@example.com' })
}
</script>

<template>
  <button @click="handleSubmit" :disabled="createUser.isPending.value">
    {{ createUser.isPending.value ? 'Creating...' : 'Create User' }}
  </button>
  <p v-if="createUser.isError.value">{{ createUser.error.value?.message }}</p>
</template>
```

The mutation variable type (`{ name: string; email: string }`) comes straight from your Elysia body schema.

## How invalidation works

After a successful mutation, the library computes an invalidation key from the route segments (no method, no params):

```
eden.useMutation(eden.proxy.users.post)
→ success → invalidateQueries({ queryKey: [Symbol, 'users'] })
```

That prefix matches every `users.*` query — `users.get`, `users.get({ page: 1 })`, etc. Active queries refetch automatically.

You don't write the invalidation logic. You don't name the key. It just works because the mutation and the queries share the same route prefix.

## Callbacks

All TanStack mutation callbacks work (except `mutationFn`, which is managed):

```ts
createUser.mutate(
  { name: 'Alice', email: 'alice@example.com' },
  {
    onSuccess: (data) => router.push(`/users/${data.id}`),
    onError: (err) => toast.error(err.message),
  }
)
```

## Optimistic updates

Combine with queryClient for instant UI feedback:

```vue
<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query'
import { eden } from '../lib/eden'

const queryClient = useQueryClient()
const usersKey = eden.getKey(eden.proxy.users.get)
const deleteUser = eden.useMutation(eden.proxy.users.delete)

function handleDelete(userId: number) {
  const previous = queryClient.getQueryData(usersKey)
  queryClient.setQueryData(usersKey, (old: any[]) =>
    old?.filter(u => u.id !== userId)
  )
  deleteUser.mutate(
    { id: userId },
    { onError: () => queryClient.setQueryData(usersKey, previous) }
  )
}
</script>
```

## Response handling

Like queries, Eden's `{ data, error }` is unwrapped. The `data` from your endpoint is what shows up in `onSuccess`. If `error` is non-null, it's thrown and lands in `onError`.
