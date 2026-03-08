import { EDEN_ROUTE_SYMBOL } from "./index";
import { getRouteMeta } from "./proxy";
import { stableSerialize } from "./serialize";
import type { EdenQueryKey } from "./types";

export function buildQueryKey(enhanced: unknown): EdenQueryKey {
  const meta = getRouteMeta(enhanced);

  if (!meta) {
    throw new Error(
      "Expected an eden-enhanced proxy. Did you forget to wrap your client with createEdenQueryProxy?",
    );
  }

  const parts: unknown[] = [EDEN_ROUTE_SYMBOL, ...meta.segments];

  const serializedParams = stableSerialize(meta.params);
  if (serializedParams !== undefined) {
    parts.push(serializedParams);
  }

  if (meta.method !== undefined) {
    parts.push(meta.method);
  }

  return parts as unknown as EdenQueryKey;
}

export function buildMutationInvalidationKey(
  enhanced: unknown,
): readonly [typeof EDEN_ROUTE_SYMBOL, ...string[]] {
  const meta = getRouteMeta(enhanced);

  if (!meta) {
    throw new Error(
      "Expected an eden-enhanced proxy. Did you forget to wrap your client with createEdenQueryProxy?",
    );
  }

  return [EDEN_ROUTE_SYMBOL, ...meta.segments] as readonly [typeof EDEN_ROUTE_SYMBOL, ...string[]];
}

export function buildPartialKey(
  ...segments: readonly string[]
): readonly [typeof EDEN_ROUTE_SYMBOL, ...string[]] {
  return [EDEN_ROUTE_SYMBOL, ...segments] as readonly [typeof EDEN_ROUTE_SYMBOL, ...string[]];
}
