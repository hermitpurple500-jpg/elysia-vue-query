# Vue Helpers API

The main package you'll interact with.

## `createEdenQueryHelpers(client)`

```ts
function createEdenQueryHelpers<TClient>(client: TClient): EdenQueryHelpers<TClient>
```

Factory function that creates the full set of query helpers from an Eden Treaty client.

### Parameters

| Param | Type | Description |
|-------|------|-------------|
| `client` | `TClient` | An Eden Treaty client instance |

### Returns

`EdenQueryHelpers<TClient>` with the following properties:

| Property | Description |
|----------|-------------|
| `proxy` | Enhanced proxy wrapping your Eden client |
| `useQuery` | TanStack `useQuery` with auto key + response unwrap |
| `useMutation` | TanStack `useMutation` with auto invalidation |
| `prefetch` | SSR-compatible `prefetchQuery` wrapper |
| `invalidate` | Manual subtree cache invalidation |
| `getKey` | Extract the deterministic query key |

---

## `eden.proxy`

The enhanced proxy wrapping your Eden client. Use it to reference endpoints:

```ts
eden.proxy.users.get            // GET /users
eden.proxy.users.post           // POST /users
eden.proxy.users.get({ page: 1 }) // GET /users?page=1
eden.proxy.posts.get            // GET /posts
```

---

## `eden.useQuery(endpoint, options?)`

```ts
function useQuery<TEndpoint>(
  endpoint: TEndpoint | MaybeRef<TEndpoint>,
  options?: EdenUseQueryOptions<TData, TError>,
): UseQueryReturnType<TData, TError>
```

Wraps TanStack's `useQuery` with automatic key generation and Eden response normalization.

### Parameters

| Param | Type | Description |
|-------|------|-------------|
| `endpoint` | `TEndpoint \| MaybeRef<TEndpoint>` | A proxy endpoint or ref to one |
| `options` | `EdenUseQueryOptions` | TanStack Query options (except `queryKey`, `queryFn`) |

### Returns

`UseQueryReturnType<TData, TError>` — standard TanStack Query return with `data`, `isLoading`, `error`, etc.

### Example

```vue
<script setup lang="ts">
const { data, isLoading, error } = eden.useQuery(eden.proxy.users.get, {
  staleTime: 60_000,
  enabled: isAuthenticated,
})
</script>
```

---

## `eden.useMutation(endpoint, options?)`

```ts
function useMutation<TEndpoint>(
  endpoint: TEndpoint | MaybeRef<TEndpoint>,
  options?: EdenUseMutationOptions<TData, TError, TVariables>,
): UseMutationReturnType<TData, TError, TVariables, unknown>
```

Wraps TanStack's `useMutation` with automatic subtree cache invalidation.

### Parameters

| Param | Type | Description |
|-------|------|-------------|
| `endpoint` | `TEndpoint \| MaybeRef<TEndpoint>` | A proxy endpoint (typically `.post`, `.put`, `.delete`) |
| `options` | `EdenUseMutationOptions` | TanStack Mutation options (except `mutationFn`) |

### Invalidation Behavior

After a successful mutation, all queries matching the route's parent segments are invalidated.

```ts
eden.useMutation(eden.proxy.users.post)
// Success → invalidates [Symbol, 'users']

eden.useMutation(eden.proxy.users.posts.post)
// Success → invalidates [Symbol, 'users', 'posts']
```

### Example

```vue
<script setup lang="ts">
const createUser = eden.useMutation(eden.proxy.users.post)

createUser.mutate(
  { name: 'Alice', email: 'alice@example.com' },
  {
    onSuccess: (data) => console.log('Created:', data.id),
    onError: (err) => console.error(err),
  }
)
</script>
```

---

## `eden.prefetch(endpoint, queryClient?)`

```ts
function prefetch<TEndpoint>(
  endpoint: TEndpoint,
  queryClient?: QueryClient,
): Promise<void>
```

Prefetch data using TanStack's `prefetchQuery` for SSR hydration.

### Parameters

| Param | Type | Description |
|-------|------|-------------|
| `endpoint` | `TEndpoint` | A proxy endpoint |
| `queryClient` | `QueryClient` | Optional — uses `useQueryClient()` if not provided |

### Example

```ts
// Server-side (Nuxt, etc.)
await eden.prefetch(eden.proxy.users.get, queryClient)
```

---

## `eden.invalidate(endpoint, queryClient?)`

```ts
function invalidate(
  endpoint: unknown,
  queryClient?: QueryClient,
): Promise<void>
```

Invalidate all queries matching the endpoint's route subtree.

### Parameters

| Param | Type | Description |
|-------|------|-------------|
| `endpoint` | `unknown` | A proxy endpoint (any depth) |
| `queryClient` | `QueryClient` | Optional — uses `useQueryClient()` if not provided |

### Example

```ts
// Invalidate all user-related queries
await eden.invalidate(eden.proxy.users)

// Invalidate only user posts
await eden.invalidate(eden.proxy.users.posts)
```

---

## `eden.getKey(endpoint)`

```ts
function getKey(endpoint: unknown): EdenQueryKey
```

Extract the stable, deterministic query key from a proxy endpoint.

### Returns

`EdenQueryKey` — `readonly [typeof EDEN_ROUTE_SYMBOL, ...string[], ...[SerializedParam?, string?]]`

### Example

```ts
eden.getKey(eden.proxy.users.get)
// → [Symbol('eden_route'), 'users', 'get']

eden.getKey(eden.proxy.users.get({ page: 1 }))
// → [Symbol('eden_route'), 'users', { page: 1 }, 'get']
```
