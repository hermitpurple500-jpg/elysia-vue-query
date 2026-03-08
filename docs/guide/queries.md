# Queries

`eden.useQuery()` wraps TanStack's `useQuery` and fills in the two parts that are easy to get wrong by hand: the query key and the request function.

## Basic read

```vue [UserList.vue]
<script setup lang="ts">
import { eden } from "../lib/eden";

const { data: users, isLoading, error } = eden.useQuery(eden.proxy.users.get);
</script>
```

That single line gives you:

- a deterministic query key derived from the endpoint path
- Eden response unwrapping
- inferred success and error types

## Parameterized queries

Call the endpoint with params when the request needs them.

```ts
const users = eden.useQuery(eden.proxy.users.get({ page: 1, limit: 20 }));
```

The params participate in the query key after stable serialization, so `{ limit: 20, page: 1 }` and `{ page: 1, limit: 20 }` produce the same key.

## Reactive params

Refs can be embedded directly in the proxy access path. When the ref changes, the query recomputes.

```vue [UserProfile.vue]
<script setup lang="ts">
import { ref } from "vue";
import { eden } from "../lib/eden";

const userId = ref("123");
const profile = eden.useQuery(eden.proxy.users[userId].profile.get);
</script>
```

This is especially useful for route params, tab state, or controlled filters.

## TanStack options still apply

You keep the normal TanStack Query controls. Only `queryKey` and `queryFn` are reserved internally.

```ts
const users = eden.useQuery(eden.proxy.users.get, {
  staleTime: 5 * 60 * 1000,
  retry: 2,
  gcTime: 10 * 60 * 1000,
  refetchOnWindowFocus: false,
});
```

## Conditional queries

Use `enabled` exactly as you would with raw TanStack Query.

```vue [UserPosts.vue]
<script setup lang="ts">
import { computed } from "vue";
import { eden } from "../lib/eden";

const selectedUserId = computed(() => "1");

const posts = eden.useQuery(eden.proxy.users[selectedUserId].posts.get, {
  enabled: computed(() => !!selectedUserId.value),
});
</script>
```

## Placeholder and polling patterns

```ts
eden.useQuery(eden.proxy.users.get, {
  placeholderData: (previousData) => previousData,
});

eden.useQuery(eden.proxy.stats.get, {
  refetchInterval: 5_000,
});
```

## Type inspection example

```ts twoslash
interface User {
  id: number;
  name: string;
}

declare const result: {
  data: { value: User[] | undefined };
  error: { value: Error | null };
};

result.data.value;
//     ^?
```

The live docs can show hover info for these snippets. This is useful when you want to document inferred component types instead of manually restating them in prose.

## Mental model

Use `eden.useQuery()` when you want the runtime guarantees of TanStack Query and the type guarantees of Eden Treaty without writing the same request wrapper on every route.
