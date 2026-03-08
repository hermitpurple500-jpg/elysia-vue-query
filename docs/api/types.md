# Types

The public types explain the library's contract better than prose alone, especially when you are integrating it into your own wrappers.

## Core types

### `SerializedParam`

```ts
type SerializedParam =
  | string
  | number
  | boolean
  | null
  | readonly SerializedParam[]
  | { readonly [key: string]: SerializedParam };
```

Represents the subset of values that can safely participate in query keys.

### `RouteMeta`

```ts
interface RouteMeta {
  readonly segments: readonly string[];
  readonly method?: string;
  readonly params?: SerializedParam;
}
```

The metadata stored on the enhanced proxy.

### `EdenQueryKey`

```ts
type EdenQueryKey = readonly [
  typeof EDEN_ROUTE_SYMBOL,
  ...string[],
  ...[SerializedParam?, string?],
];
```

The canonical tuple returned by `getKey()` and `buildQueryKey()`.

### `RouteMetaBrand`

```ts
type RouteMetaBrand = {
  readonly [EDEN_ROUTE_SYMBOL]: RouteMeta;
};
```

The internal type-level brand used to carry route metadata through the proxy.

### `EdenEnhancedClient<TClient>`

```ts
type EdenEnhancedClient<TClient> = TClient & RouteMetaBrand;
```

## Vue types

### `EdenUseQueryOptions<TData, TError>`

```ts
interface EdenUseQueryOptions<TData, TError> extends Omit<
  UseQueryOptions<TData, TError>,
  "queryKey" | "queryFn"
> {
  readonly queryKey?: never;
  readonly queryFn?: never;
}
```

This prevents consumers from bypassing the generated key and function.

### `EdenUseMutationOptions<TData, TError, TVariables>`

```ts
interface EdenUseMutationOptions<TData, TError, TVariables> extends Omit<
  UseMutationOptions<TData, TError, TVariables>,
  "mutationFn"
> {
  readonly mutationFn?: never;
}
```

### `EdenQueryHelpers<TClient>`

```ts
interface EdenQueryHelpers<TClient> {
  readonly proxy: TClient;
  useQuery<TEndpoint>(...args: unknown[]): unknown;
  useMutation<TEndpoint>(...args: unknown[]): unknown;
  prefetch<TEndpoint>(endpoint: TEndpoint, queryClient?: QueryClient): Promise<void>;
  invalidate(endpoint: unknown, queryClient?: QueryClient): Promise<void>;
  getKey(endpoint: unknown): EdenQueryKey;
}
```

This is the umbrella type returned by `createEdenQueryHelpers()`.

## Inference helpers

### `InferEdenData<T>`

Extracts the success payload from an Eden endpoint.

### `InferEdenError<T>`

Extracts the error payload from an Eden endpoint.

### `InferEdenBody<T>`

Extracts the body input type for write endpoints.

## Practical reading

If you only need one mental model, use this one:

- `proxy` captures route structure
- `EdenQueryKey` is the cache identity
- inference helpers derive success, error, and body types from the endpoint signature
