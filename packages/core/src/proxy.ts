import { EDEN_ROUTE_SYMBOL } from './index'
import { stableSerialize } from './serialize'
import type { RouteMeta } from './types'

const HTTP_METHODS = new Set(['get', 'post', 'put', 'patch', 'delete', 'head', 'options'])

const routeSymbolHas = (_target: unknown, prop: string | symbol): boolean => prop === EDEN_ROUTE_SYMBOL

export function getRouteMeta(enhanced: unknown): RouteMeta | undefined {
  if (enhanced !== null && (typeof enhanced === 'object' || typeof enhanced === 'function') && EDEN_ROUTE_SYMBOL in (enhanced as object)) {
    return (enhanced as Record<typeof EDEN_ROUTE_SYMBOL, RouteMeta>)[EDEN_ROUTE_SYMBOL]
  }
  return undefined
}

function resolveTarget(client: unknown, key: string): unknown {
  if (client != null && (typeof client === 'object' || typeof client === 'function')) {
    return (client as Record<string, unknown>)[key]
  }
  return undefined
}

function createProxyInternal(
  client: unknown,
  segments: readonly string[],
): unknown {
  return new Proxy(function () {} as never, {
    has: routeSymbolHas,

    get(_target, prop: string | symbol) {
      if (prop === EDEN_ROUTE_SYMBOL) {
        return { segments } satisfies RouteMeta
      }

      if (typeof prop === 'symbol') {
        return Reflect.get(client as object, prop)
      }

      const segment = prop
      const nextTarget = resolveTarget(client, segment)

      if (HTTP_METHODS.has(segment)) {
        const targetFn = nextTarget

        const methodFn = function methodProxy(params?: unknown) {
          const meta: RouteMeta = {
            segments,
            method: segment,
            params: params as RouteMeta['params'],
          }

          return new Proxy(function () {} as never, {
            has: routeSymbolHas,
            get(_t, p: string | symbol) {
              if (p === EDEN_ROUTE_SYMBOL) return meta
              return undefined
            },
            apply(_t, thisArg, _args: unknown[]) {
              if (typeof targetFn === 'function') {
                return Reflect.apply(targetFn, thisArg, params !== undefined ? [params] : [])
              }
              return undefined
            },
          })
        }

        Object.defineProperty(methodFn, 'name', { value: segment, configurable: true })
        Object.defineProperty(methodFn, 'length', { value: 1, configurable: true })

        return new Proxy(methodFn, {
          has: routeSymbolHas,
          get(target, p: string | symbol) {
            if (p === EDEN_ROUTE_SYMBOL) {
              return { segments, method: segment } satisfies RouteMeta
            }
            return Reflect.get(target, p)
          },
          apply(_target, thisArg, args: unknown[]) {
            if (typeof targetFn === 'function') {
              return Reflect.apply(targetFn, thisArg, args)
            }
            return methodFn.apply(thisArg, args as [params?: unknown])
          },
        })
      }

      return createProxyInternal(nextTarget, [...segments, segment])
    },

    apply(_target, _thisArg, args: unknown[]) {
      const param = args[0]
      const serialized = stableSerialize(param)
      const serializedSegment = serialized !== undefined ? JSON.stringify(serialized) : undefined
      const newSegments = serializedSegment !== undefined
        ? [...segments, serializedSegment]
        : segments

      let nextClient: unknown = client
      if (typeof client === 'function') {
        nextClient = (client as (...a: unknown[]) => unknown)(...args)
      }

      return createProxyInternal(nextClient, newSegments)
    },
  })
}

export function createEdenQueryProxy<TClient>(client: TClient): TClient {
  return createProxyInternal(client, []) as TClient
}
