import {
  useQuery as tanstackUseQuery,
  useMutation as tanstackUseMutation,
  useQueryClient,
} from "@tanstack/vue-query";
import type {
  UseQueryOptions,
  UseQueryReturnType,
  UseMutationOptions,
  UseMutationReturnType,
  QueryClient,
} from "@tanstack/vue-query";
import {
  buildQueryKey,
  buildMutationInvalidationKey,
  getRouteMeta,
  createEdenQueryProxy,
} from "@elysia-vue-query/core";
import type { EdenQueryKey } from "@elysia-vue-query/core";
import type { MaybeRef } from "vue";
import { isRef, computed } from "vue";

type EdenResponse<TData, TError> = {
  data: TData | null;
  error: TError | null;
  status: number;
};

type InferEdenData<T> = T extends (
  ...args: never[]
) => Promise<EdenResponse<infer TData, infer _TError>>
  ? TData
  : never;

type InferEdenError<T> = T extends (
  ...args: never[]
) => Promise<EdenResponse<infer _TData, infer TError>>
  ? TError
  : never;

type InferEdenBody<T> = T extends (body: infer TBody) => Promise<EdenResponse<unknown, unknown>>
  ? TBody
  : void;

export interface EdenUseQueryOptions<TData, TError> extends Omit<
  UseQueryOptions<TData, TError>,
  "queryKey" | "queryFn"
> {
  readonly queryKey?: never;
  readonly queryFn?: never;
}

export interface EdenUseMutationOptions<TData, TError, TVariables> extends Omit<
  UseMutationOptions<TData, TError, TVariables>,
  "mutationFn"
> {
  readonly mutationFn?: never;
}

export interface EdenQueryHelpers<TClient> {
  readonly proxy: TClient;

  useQuery<TEndpoint extends (...args: never[]) => Promise<EdenResponse<unknown, unknown>>>(
    endpoint: TEndpoint | MaybeRef<TEndpoint>,
    options?: EdenUseQueryOptions<InferEdenData<TEndpoint>, InferEdenError<TEndpoint>>,
  ): UseQueryReturnType<InferEdenData<TEndpoint>, InferEdenError<TEndpoint>>;

  useMutation<TEndpoint extends (...args: never[]) => Promise<EdenResponse<unknown, unknown>>>(
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
  >;

  prefetch<TEndpoint extends (...args: never[]) => Promise<EdenResponse<unknown, unknown>>>(
    endpoint: TEndpoint,
    queryClient?: QueryClient,
  ): Promise<void>;

  invalidate(endpoint: unknown, queryClient?: QueryClient): Promise<void>;

  getKey(endpoint: unknown): EdenQueryKey;
}

type CallableEndpoint = (...args: unknown[]) => Promise<EdenResponse<unknown, unknown>>;

export function createEdenQueryHelpers<TClient>(client: TClient): EdenQueryHelpers<TClient> {
  const proxy = createEdenQueryProxy(client);

  function getKey(endpoint: unknown): EdenQueryKey {
    return buildQueryKey(endpoint);
  }

  function useQuery<
    TEndpoint extends (...args: never[]) => Promise<EdenResponse<unknown, unknown>>,
  >(
    endpoint: TEndpoint | MaybeRef<TEndpoint>,
    options?: EdenUseQueryOptions<InferEdenData<TEndpoint>, InferEdenError<TEndpoint>>,
  ): UseQueryReturnType<InferEdenData<TEndpoint>, InferEdenError<TEndpoint>> {
    return tanstackUseQuery({
      ...options,
      queryKey: computed(() => buildQueryKey(isRef(endpoint) ? endpoint.value : endpoint)),
      queryFn: async () => {
        const resolvedEndpoint = isRef(endpoint) ? endpoint.value : endpoint;
        const meta = getRouteMeta(resolvedEndpoint);

        if (!meta) {
          throw new Error(
            "Expected an eden-enhanced proxy. Did you pass a raw client method instead of eden.proxy.*?",
          );
        }

        const response = await (resolvedEndpoint as unknown as CallableEndpoint)();
        if (response.error !== null) throw response.error;
        return response.data as InferEdenData<TEndpoint>;
      },
    } as any) as UseQueryReturnType<InferEdenData<TEndpoint>, InferEdenError<TEndpoint>>;
  }

  function useMutation<
    TEndpoint extends (...args: never[]) => Promise<EdenResponse<unknown, unknown>>,
  >(
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
  > {
    const qc = useQueryClient();

    return tanstackUseMutation({
      ...options,
      mutationFn: async (variables: InferEdenBody<TEndpoint>) => {
        const resolvedEndpoint = isRef(endpoint) ? endpoint.value : endpoint;
        const meta = getRouteMeta(resolvedEndpoint);

        if (!meta) {
          throw new Error(
            "Expected an eden-enhanced proxy. Did you pass a raw client method instead of eden.proxy.*?",
          );
        }

        const invalidationKey = buildMutationInvalidationKey(resolvedEndpoint);
        const response = await (resolvedEndpoint as unknown as CallableEndpoint)(variables);
        if (response.error !== null) throw response.error;
        void qc.invalidateQueries({ queryKey: invalidationKey });
        return response.data as InferEdenData<TEndpoint>;
      },
    } as any) as UseMutationReturnType<
      InferEdenData<TEndpoint>,
      InferEdenError<TEndpoint>,
      InferEdenBody<TEndpoint>,
      unknown
    >;
  }

  async function prefetch<
    TEndpoint extends (...args: never[]) => Promise<EdenResponse<unknown, unknown>>,
  >(endpoint: TEndpoint, queryClient?: QueryClient): Promise<void> {
    const qc = queryClient ?? useQueryClient();
    const meta = getRouteMeta(endpoint);

    if (!meta) {
      throw new Error(
        "Expected an eden-enhanced proxy. Did you pass a raw client method instead of eden.proxy.*?",
      );
    }

    const queryKey = buildQueryKey(endpoint);

    await qc.prefetchQuery({
      queryKey,
      queryFn: async () => {
        const response = await (endpoint as unknown as CallableEndpoint)();
        if (response.error !== null) throw response.error;
        return response.data as InferEdenData<TEndpoint>;
      },
    });
  }

  async function invalidate(endpoint: unknown, queryClient?: QueryClient): Promise<void> {
    const qc = queryClient ?? useQueryClient();
    const meta = getRouteMeta(endpoint);

    if (!meta) {
      throw new Error(
        "Expected an eden-enhanced proxy. Did you forget to wrap your client with createEdenQueryProxy?",
      );
    }

    const invalidationKey = buildMutationInvalidationKey(endpoint);
    await qc.invalidateQueries({ queryKey: invalidationKey });
  }

  return {
    proxy,
    useQuery,
    useMutation,
    prefetch,
    invalidate,
    getKey,
  };
}
