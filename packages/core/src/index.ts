export const EDEN_ROUTE_SYMBOL: unique symbol = Symbol('eden_route')

export type { RouteMeta, SerializedParam, EdenQueryKey, EdenEnhancedClient } from './types'
export { stableSerialize } from './serialize'
export { createEdenQueryProxy, getRouteMeta } from './proxy'
export { buildQueryKey, buildMutationInvalidationKey } from './key'
export { EDEN_ROUTE_SYMBOL as routeSymbol }
