import { EDEN_ROUTE_SYMBOL } from './index'
import type { RouteMeta } from './types'

const HTTP_METHODS = new Set(['get', 'post', 'put', 'patch', 'delete', 'head', 'options'])

const routeSymbolHas = (_target: unknown, prop: string | symbol): boolean => prop === EDEN_ROUTE_SYMBOL

export function getRouteMeta(enhanced: unknown): RouteMeta | undefined {
  if (enhanced !== null && (typeof enhanced === 'object' || typeof enhanced === 'function') && EDEN_ROUTE_SYMBOL in (enhanced as object)) {
    return (enhanced as Record<typeof EDEN_ROUTE_SYMBOL, RouteMeta>)[EDEN_ROUTE_SYMBOL]
  }
  return undefined
}

function createBrandedProxy(getMeta: () => RouteMeta): unknown {
  return new Proxy(function () {} as never, {
    has: routeSymbolHas,
    get(_t, p: string | symbol) {
      if (p === EDEN_ROUTE_SYMBOL) return getMeta()
      return undefined
    },
  })
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

      if (HTTP_METHODS.has(segment)) {
        const methodFn = function methodProxy(params?: unknown) {
          return createBrandedProxy(() => ({
            segments,
            method: segment,
            params: params as RouteMeta['params'],
          }))
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
        })
      }

      return createProxyInternal(client, [...segments, segment])
    },

    apply(_target, _thisArg, args: unknown[]) {
      const params = args[0]

      return new Proxy(function () {} as never, {
        has: routeSymbolHas,

        get(_t, prop: string | symbol) {
          if (prop === EDEN_ROUTE_SYMBOL) {
            return { segments, params: params as RouteMeta['params'] } satisfies RouteMeta
          }

          if (typeof prop === 'symbol') return undefined

          const segment = prop

          if (HTTP_METHODS.has(segment)) {
            const methodFn = function methodWithParams(extraParams?: unknown) {
              return createBrandedProxy(() => ({
                segments,
                method: segment,
                params: (extraParams !== undefined ? extraParams : params) as RouteMeta['params'],
              }))
            }

            Object.defineProperty(methodFn, 'name', { value: segment, configurable: true })
            Object.defineProperty(methodFn, 'length', { value: 1, configurable: true })

            return new Proxy(methodFn, {
              has: routeSymbolHas,
              get(target, p: string | symbol) {
                if (p === EDEN_ROUTE_SYMBOL) {
                  return {
                    segments,
                    method: segment,
                    params: params as RouteMeta['params'],
                  } satisfies RouteMeta
                }
                return Reflect.get(target, p)
              },
            })
          }

          return createProxyInternal(undefined, [...segments, segment])
        },
      })
    },
  })
}

export function createEdenQueryProxy<TClient>(client: TClient): TClient {
  return createProxyInternal(client, []) as TClient
}
