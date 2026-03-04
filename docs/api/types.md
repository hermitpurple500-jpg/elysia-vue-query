# Types

All exported types from both packages.

## Core Types

### `SerializedParam`

Recursive union of JSON-serializable primitives:

```ts
type SerializedParam =
  | string
  | number
  | boolean
  | null
  | readonly SerializedParam[]
  | { readonly [key: string]: SerializedParam }
```

### `RouteMeta`

Metadata extracted from a proxy-enhanced endpoint:

```ts
interface RouteMeta {
  readonly segments: readonly string[]
  readonly method?: string
  readonly params?: SerializedParam
}
```

### `EdenQueryKey`

The canonical query key tuple shape:

```ts
type EdenQueryKey = readonly [
  typeof EDEN_ROUTE_SYMBOL,
  ...string[],
  ...[SerializedParam?, string?]
]
```

### `RouteMetaBrand`

The internal branding type (not typically used directly):

```ts
type RouteMetaBrand = {
  readonly [EDEN_ROUTE_SYMBOL]: RouteMeta
}
```

### `EdenEnhancedClient<TClient>`

Type-level intersection that brands a client type with route metadata:

```ts
type EdenEnhancedClient<TClient> = TClient & RouteMetaBrand
```

---

## Vue Types

### `EdenUseQueryOptions<TData, TError>`

Query options with `queryKey` and `queryFn` excluded (managed internally):

```ts
interface EdenUseQueryOptions<TData, TError>
  extends Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'> {
  readonly queryKey?: never
  readonly queryFn?: never
}
```

### `EdenUseMutationOptions<TData, TError, TVariables>`

Mutation options with `mutationFn` excluded (managed internally):

```ts
interface EdenUseMutationOptions<TData, TError, TVariables>
  extends Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'> {
  readonly mutationFn?: never
}
```

### `EdenQueryHelpers<TClient>`

The full helper object returned by `createEdenQueryHelpers()`:

```ts
interface EdenQueryHelpers<TClient> {
  readonly proxy: TClient

  useQuery<TEndpoint>(
    endpoint: TEndpoint | MaybeRef<TEndpoint>,
    options?: EdenUseQueryOptions<InferEdenData<TEndpoint>, InferEdenError<TEndpoint>>,
  ): UseQueryReturnType<InferEdenData<TEndpoint>, InferEdenError<TEndpoint>>

  useMutation<TEndpoint>(
    endpoint: TEndpoint | MaybeRef<TEndpoint>,
    options?: EdenUseMutationOptions<
      InferEdenData<TEndpoint>,
      InferEdenError<TEndpoint>,
      InferEdenBody<TEndpoint>
    >,
  ): UseMutationReturnType<
    InferEdenData<TEndpoint>,
    InferEdenError<TEndpoint>,
    InferEdenBody<TEndpoint>,
    unknown
  >

  prefetch<TEndpoint>(
    endpoint: TEndpoint,
    queryClient?: QueryClient,
  ): Promise<void>

  invalidate(
    endpoint: unknown,
    queryClient?: QueryClient,
  ): Promise<void>

  getKey(endpoint: unknown): EdenQueryKey
}
```

---

## Inference Helpers

These utility types extract data from Eden endpoint signatures:

### `InferEdenData<T>`

Extracts the success data type from an Eden endpoint:

```ts
type InferEdenData<T> = T extends (...args: never[]) => Promise<{
  data: infer TData
  error: unknown
  status: number
}> ? TData : never
```

### `InferEdenError<T>`

Extracts the error type from an Eden endpoint:

```ts
type InferEdenError<T> = T extends (...args: never[]) => Promise<{
  data: unknown
  error: infer TError
  status: number
}> ? TError : never
```

### `InferEdenBody<T>`

Extracts the request body type from an Eden endpoint:

```ts
type InferEdenBody<T> = T extends (body: infer TBody) => Promise<{
  data: unknown
  error: unknown
}> ? TBody : void
```
