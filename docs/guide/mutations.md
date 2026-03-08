# Mutations

`eden.useMutation()` keeps the TanStack mutation lifecycle but removes the manual request wrapper and the most common invalidation bookkeeping.

## Basic write

```vue [CreateUser.vue]
<script setup lang="ts">
import { eden } from "../lib/eden";

const createUser = eden.useMutation(eden.proxy.users.post);

function create() {
  createUser.mutate({
    name: "Alice",
    email: "alice@example.com",
  });
}
</script>
```

The mutation variable type comes from the endpoint body type. The success result comes from the endpoint response type.

## Automatic subtree invalidation

Successful writes invalidate the route subtree, not just the exact mutation key.

```ts
eden.useMutation(eden.proxy.users.post);
// success => invalidate [EDEN_ROUTE_SYMBOL, 'users']

eden.useMutation(eden.proxy.users.posts.post);
// success => invalidate [EDEN_ROUTE_SYMBOL, 'users', 'posts']
```

That means a `POST /users` invalidates reads like:

- `eden.proxy.users.get`
- `eden.proxy.users.get({ page: 1 })`
- `eden.proxy.users['42'].profile.get`

## Standard callbacks still work

```ts
const createUser = eden.useMutation(eden.proxy.users.post);

createUser.mutate(
  { name: "Alice", email: "alice@example.com" },
  {
    onSuccess: (user) => {
      console.log("created", user.id);
    },
    onError: (error) => {
      console.error(error.message);
    },
  },
);
```

## Optimistic updates

For optimistic UI, pair the helper with `useQueryClient()` just as you would in TanStack Query.

```vue [DeleteUser.vue]
<script setup lang="ts">
import { useQueryClient } from "@tanstack/vue-query";
import { eden } from "../lib/eden";

const queryClient = useQueryClient();
const usersKey = eden.getKey(eden.proxy.users.get);
const deleteUser = eden.useMutation(eden.proxy.users.delete);

function remove(userId: number) {
  const previous = queryClient.getQueryData(usersKey);

  queryClient.setQueryData(usersKey, (old: Array<{ id: number }> = []) =>
    old.filter((user) => user.id !== userId),
  );

  deleteUser.mutate(
    { id: userId },
    {
      onError: () => queryClient.setQueryData(usersKey, previous),
    },
  );
}
</script>
```

## Manual invalidation when routes differ

If a mutation on one route affects a different route family, call `eden.invalidate()` in `onSuccess`.

```ts
const createComment = eden.useMutation(eden.proxy.posts.comments.post);

createComment.mutate(commentData, {
  onSuccess: async () => {
    await eden.invalidate(eden.proxy.posts);
  },
});
```

## Type inspection example

```ts twoslash
declare const createUser: {
  mutate: (
    variables: { name: string; email: string },
    options?: {
      onSuccess?: (data: { id: number; name: string; email: string }) => void;
    },
  ) => void;
};

createUser.mutate;
//         ^?
```

The docs use this format to make the mutation surface inspectable without leaving the browser.
