# Why Elysia Vue Query?

This library exists to remove repetitive server-state glue code from Vue applications that already use Elysia and Eden Treaty.

## The baseline problem

Eden Treaty gives you a typed client. TanStack Query gives you caching, retries, and invalidation. The missing layer is the repeated code that joins them:

```ts
const users = useQuery({
  queryKey: ["users", "list"],
  queryFn: async () => {
    const response = await client.users.get();
    if (response.error) {
      throw response.error;
    }
    return response.data;
  },
});
```

This is workable once. It is fragile when repeated across a real app because you keep rewriting:

- query keys
- request wrappers
- error unwrapping
- post-mutation invalidation rules

## What this package changes

```ts
const eden = createEdenQueryHelpers(client);

const users = eden.useQuery(eden.proxy.users.get);
const createUser = eden.useMutation(eden.proxy.users.post);
```

The repeated parts become runtime behavior instead of copy-pasted convention.

## Design goals

### Deterministic cache identity

The route path, method, and params become the query key. Equal requests generate equal keys without manual naming.

### End-to-end type inference

Success data, error payloads, and mutation variables are inferred directly from the Eden endpoint signature.

### Predictable invalidation

Writes invalidate by route subtree. A successful `users.post` invalidates the `users` family instead of requiring handwritten `invalidateQueries()` calls.

### Nuxt-ready SSR

The Nuxt module handles QueryClient registration, dehydration, and hydration so SSR behavior is aligned with TanStack Query instead of side-stepping it.

## When it is a good fit

Use it when:

- your backend is already typed with Elysia
- your frontend uses Vue 3 or Nuxt
- you want TanStack Query semantics without authoring query keys manually

It is less valuable if you are not using Eden Treaty or if your data layer does not rely on TanStack Query.
