# Vue Helpers API

The Vue package is the primary surface most applications interact with.

## `createEdenQueryHelpers(client)`

```ts
function createEdenQueryHelpers<TClient>(client: TClient): EdenQueryHelpers<TClient>;
```

Creates the typed helper bundle around an Eden Treaty client.

### What it returns

| Property      | Purpose                                                      |
| ------------- | ------------------------------------------------------------ |
| `proxy`       | Route-aware proxy used to reference endpoints                |
| `useQuery`    | TanStack Query read helper with automatic key generation     |
| `useMutation` | TanStack Mutation helper with automatic subtree invalidation |
| `prefetch`    | Server-side cache population helper                          |
| `invalidate`  | Manual invalidation by route subtree                         |
| `getKey`      | Returns the canonical deterministic query key                |

## `proxy`

The `proxy` mirrors your Eden client shape, but every property access records route metadata used later for key generation.

```ts
eden.proxy.users.get;
eden.proxy.users.posts.get;
eden.proxy.users.get({ page: 1 });
eden.proxy.users["42"].profile.get;
```

The proxy is how the library avoids handwritten string query keys.

## `useQuery(endpoint, options?)`

```ts
function useQuery<TEndpoint>(
  endpoint: TEndpoint | MaybeRef<TEndpoint>,
  options?: EdenUseQueryOptions<TData, TError>,
): UseQueryReturnType<TData, TError>;
```

### Behavior

- derives the query key from the endpoint reference
- calls the underlying Eden endpoint
- throws Eden errors into TanStack's error channel
- returns inferred success data

### Example

```ts twoslash
declare const eden: {
  proxy: {
    users: {
      get: () => Promise<{
        data: Array<{ id: number; name: string }>;
        error: null;
        status: 200;
      }>;
    };
  };
  useQuery: <T>(endpoint: T) => {
    data: { value: Array<{ id: number; name: string }> | undefined };
  };
};

const users = eden.useQuery(eden.proxy.users.get);
users.data.value;
//    ^?
```

## `useMutation(endpoint, options?)`

```ts
function useMutation<TEndpoint>(
  endpoint: TEndpoint | MaybeRef<TEndpoint>,
  options?: EdenUseMutationOptions<TData, TError, TVariables>,
): UseMutationReturnType<TData, TError, TVariables, unknown>;
```

### Behavior

- infers mutation variables from the endpoint body
- unwraps the Eden response
- invalidates the route subtree after success

### Example

```ts
const createUser = eden.useMutation(eden.proxy.users.post);
```

`eden.proxy.users.post` invalidates the `users` subtree on success.

## `prefetch(endpoint, queryClient?)`

```ts
function prefetch<TEndpoint>(endpoint: TEndpoint, queryClient?: QueryClient): Promise<void>;
```

Populates a QueryClient ahead of hydration using the same deterministic key logic as `useQuery()`.

## `invalidate(endpoint, queryClient?)`

```ts
function invalidate(endpoint: unknown, queryClient?: QueryClient): Promise<void>;
```

Invalidates every cached query that shares the endpoint's route prefix.

```ts
await eden.invalidate(eden.proxy.users);
await eden.invalidate(eden.proxy.users.posts);
```

## `getKey(endpoint)`

```ts
function getKey(endpoint: unknown): EdenQueryKey;
```

Useful when you want to interact with the QueryClient directly.

```ts
const key = eden.getKey(eden.proxy.users.get({ page: 1 }));
```

For the exact tuple shape, see [Types](/api/types).
