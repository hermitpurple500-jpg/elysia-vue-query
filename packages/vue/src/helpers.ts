import {
  useQuery as tanstackUseQuery,
  useMutation as tanstackUseMutation,
  useQueryClient,
} from '@tanstack/vue-query'
import type {
  UseQueryOptions,
  UseQueryReturnType,
  UseMutationOptions,
  UseMutationReturnType,
  QueryClient,
} from '@tanstack/vue-query'
import {
  buildQueryKey,
  buildMutationInvalidationKey,
  getRouteMeta,
  createEdenQueryProxy,
  EDEN_ROUTE_SYMBOL,
} from '@elysia-vue-query/core'
import type { EdenQueryKey, RouteMeta } from '@elysia-vue-query/core'
import type { MaybeRef } from 'vue'
import { toValue } from 'vue'

type EdenResponse<TData, TError> = {
  data: TData | null
  error: TError | null
  status: number
}

type InferEdenData<T> = T extends (...args: never[]) => Promise<EdenResponse<infer TData, infer _TError>>
  ? TData
  : never

type InferEdenError<T> = T extends (...args: never[]) => Promise<EdenResponse<infer _TData, infer TError>>
  ? TError
  : never

type InferEdenBody<T> = T extends (body: infer TBody) => Promise<EdenResponse<unknown, unknown>>
  ? TBody
  : void

export interface EdenUseQueryOptions<TData, TError> extends Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'> {
  readonly queryKey?: never
  readonly queryFn?: never
}

export interface EdenUseMutationOptions<TData, TError, TVariables>
  extends Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'> {
  readonly mutationFn?: never
}

export interface EdenQueryHelpers<TClient> {
  readonly proxy: TClient

  useQuery<TEndpoint extends (...args: never[]) => Promise<EdenResponse<unknown, unknown>>>(
    endpoint: TEndpoint | MaybeRef<TEndpoint>,
    options?: EdenUseQueryOptions<InferEdenData<TEndpoint>, InferEdenError<TEndpoint>>,
  ): UseQueryReturnType<InferEdenData<TEndpoint>, InferEdenError<TEndpoint>>

  useMutation<TEndpoint extends (...args: never[]) => Promise<EdenResponse<unknown, unknown>>>(
    endpoint: TEndpoint | MaybeRef<TEndpoint>,
    options?: EdenUseMutationOptions<InferEdenData<TEndpoint>, InferEdenError<TEndpoint>, InferEdenBody<TEndpoint>>,
  ): UseMutationReturnType<InferEdenData<TEndpoint>, InferEdenError<TEndpoint>, InferEdenBody<TEndpoint>, unknown>

  prefetch<TEndpoint extends (...args: never[]) => Promise<EdenResponse<unknown, unknown>>>(
    endpoint: TEndpoint,
    queryClient?: QueryClient,
  ): Promise<void>

  invalidate(
    endpoint: unknown,
    queryClient?: QueryClient,
  ): Promise<void>

  getKey(endpoint: unknown): EdenQueryKey
}

export function createEdenQueryHelpers<TClient>(client: TClient): EdenQueryHelpers<TClient> {
  const proxy = createEdenQueryProxy(client)

  /**
   * Navigate the real Eden client using route metadata and call the endpoint.
   * The proxy only tracks segments/method/params — it can't make HTTP calls.
   */
  function callEndpoint(meta: RouteMeta, body?: unknown): Promise<EdenResponse<unknown, unknown>> {
    let current: unknown = client
    for (const segment of meta.segments) {
      current = (current as Record<string, unknown>)[segment]
    }

    if (!meta.method) {
      throw new Error('Route metadata is missing an HTTP method')
    }

    const methodFn = (current as Record<string, (...args: unknown[]) => Promise<EdenResponse<unknown, unknown>>>)[meta.method]
    if (typeof methodFn !== 'function') {
      throw new Error(`Expected "${meta.method}" to be a callable method on the Eden client`)
    }

    if (body !== undefined) return methodFn(body)
    if (meta.params !== undefined) return methodFn(meta.params)
    return methodFn()
  }

  function getKey(endpoint: unknown): EdenQueryKey {
    return buildQueryKey(endpoint)
  }

  function useQuery<TEndpoint extends (...args: never[]) => Promise<EdenResponse<unknown, unknown>>>(
    endpoint: TEndpoint | MaybeRef<TEndpoint>,
    options?: EdenUseQueryOptions<InferEdenData<TEndpoint>, InferEdenError<TEndpoint>>,
  ): UseQueryReturnType<InferEdenData<TEndpoint>, InferEdenError<TEndpoint>> {
    const resolvedEndpoint = toValue(endpoint)
    const meta = getRouteMeta(resolvedEndpoint)

    if (!meta) {
      throw new Error('Expected an eden-enhanced proxy. Did you pass a raw client method instead of eden.proxy.*?')
    }

    const queryKey = buildQueryKey(resolvedEndpoint)

    return tanstackUseQuery({
      ...options,
      queryKey,
      queryFn: async () => {
        const response = await callEndpoint(meta)
        if (response.error !== null) throw response.error
        return response.data as InferEdenData<TEndpoint>
      },
    } as UseQueryOptions<InferEdenData<TEndpoint>, InferEdenError<TEndpoint>>)
  }

  function useMutation<TEndpoint extends (...args: never[]) => Promise<EdenResponse<unknown, unknown>>>(
    endpoint: TEndpoint | MaybeRef<TEndpoint>,
    options?: EdenUseMutationOptions<InferEdenData<TEndpoint>, InferEdenError<TEndpoint>, InferEdenBody<TEndpoint>>,
  ): UseMutationReturnType<InferEdenData<TEndpoint>, InferEdenError<TEndpoint>, InferEdenBody<TEndpoint>, unknown> {
    const resolvedEndpoint = toValue(endpoint)
    const meta = getRouteMeta(resolvedEndpoint)

    if (!meta) {
      throw new Error('Expected an eden-enhanced proxy. Did you pass a raw client method instead of eden.proxy.*?')
    }

    const invalidationKey = buildMutationInvalidationKey(resolvedEndpoint)
    const qc = useQueryClient()

    return tanstackUseMutation({
      ...options,
      mutationFn: async (variables: InferEdenBody<TEndpoint>) => {
        const response = await callEndpoint(meta, variables)
        if (response.error !== null) throw response.error
        void qc.invalidateQueries({ queryKey: invalidationKey })
        return response.data as InferEdenData<TEndpoint>
      },
    } as UseMutationOptions<InferEdenData<TEndpoint>, InferEdenError<TEndpoint>, InferEdenBody<TEndpoint>>)
  }

  async function prefetch<TEndpoint extends (...args: never[]) => Promise<EdenResponse<unknown, unknown>>>(
    endpoint: TEndpoint,
    queryClient?: QueryClient,
  ): Promise<void> {
    const qc = queryClient ?? useQueryClient()
    const meta = getRouteMeta(endpoint)

    if (!meta) {
      throw new Error('Expected an eden-enhanced proxy. Did you pass a raw client method instead of eden.proxy.*?')
    }

    const queryKey = buildQueryKey(endpoint)

    await qc.prefetchQuery({
      queryKey,
      queryFn: async () => {
        const response = await callEndpoint(meta)
        if (response.error !== null) throw response.error
        return response.data as InferEdenData<TEndpoint>
      },
    })
  }

  async function invalidate(
    endpoint: unknown,
    queryClient?: QueryClient,
  ): Promise<void> {
    const qc = queryClient ?? useQueryClient()
    const meta = getRouteMeta(endpoint)

    if (!meta) {
      throw new Error('Expected an eden-enhanced proxy. Did you forget to wrap your client with createEdenQueryProxy?')
    }

    const invalidationKey = [EDEN_ROUTE_SYMBOL, ...meta.segments] as const
    await qc.invalidateQueries({ queryKey: invalidationKey })
  }

  return {
    proxy,
    useQuery,
    useMutation,
    prefetch,
    invalidate,
    getKey,
  }
}
