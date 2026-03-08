import type { EDEN_ROUTE_SYMBOL } from "./index";

export type SerializedParam =
  | string
  | number
  | boolean
  | null
  | readonly SerializedParam[]
  | { readonly [key: string]: SerializedParam };

export interface RouteMeta {
  readonly segments: readonly string[];
  readonly method?: string;
  readonly params?: SerializedParam;
}

export type EdenQueryKey = readonly [
  typeof EDEN_ROUTE_SYMBOL,
  ...string[],
  ...[SerializedParam?, string?],
];

export interface RouteMetaBrand {
  readonly [EDEN_ROUTE_SYMBOL]: RouteMeta;
}

export type EdenEnhancedClient<TClient> = TClient & RouteMetaBrand;
