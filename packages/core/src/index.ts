export const EDEN_ROUTE_SYMBOL: unique symbol = Symbol.for('elysia-vue-query:eden_route') as any

export type { RouteMeta, SerializedParam, EdenQueryKey, EdenEnhancedClient } from './types'
export { stableSerialize } from './serialize'
export { createEdenQueryProxy, getRouteMeta } from './proxy'
export { buildQueryKey, buildMutationInvalidationKey, buildPartialKey } from './key'
export { EDEN_ROUTE_SYMBOL as routeSymbol }
