import { describe, it, expect, expectTypeOf } from "vitest";
import { buildQueryKey, buildMutationInvalidationKey, buildPartialKey } from "../key";
import { createEdenQueryProxy } from "../proxy";
import { EDEN_ROUTE_SYMBOL } from "../index";
import type { EdenQueryKey } from "../types";

interface MockClient {
  users: {
    get: (params?: unknown) => unknown;
    post: (params?: unknown) => unknown;
    posts: Record<string, unknown>;
  };
  api: Record<string, unknown>;
}

function createTestProxy() {
  return createEdenQueryProxy({} as MockClient);
}

describe("buildQueryKey", () => {
  it("builds key from simple segment proxy", () => {
    const proxy = createTestProxy();
    const key = buildQueryKey(proxy.users);
    expect(key).toEqual([EDEN_ROUTE_SYMBOL, "users"]);
  });

  it("builds key from nested segment proxy", () => {
    const proxy = createTestProxy();
    const key = buildQueryKey(proxy.users.posts);
    expect(key).toEqual([EDEN_ROUTE_SYMBOL, "users", "posts"]);
  });

  it("builds key with method", () => {
    const proxy = createTestProxy();
    const key = buildQueryKey(proxy.users.get);
    expect(key).toEqual([EDEN_ROUTE_SYMBOL, "users", "get"]);
  });

  it("builds key with method and params", () => {
    const proxy = createTestProxy();
    const result = proxy.users.get({ id: "123", sort: "name" });
    const key = buildQueryKey(result);
    expect(key[0]).toBe(EDEN_ROUTE_SYMBOL);
    expect(key[1]).toBe("users");
  });

  it("throws on non-proxy input", () => {
    expect(() => buildQueryKey({})).toThrow("Expected an eden-enhanced proxy");
  });

  it("throws on null input", () => {
    expect(() => buildQueryKey(null)).toThrow("Expected an eden-enhanced proxy");
  });

  it("starts with EDEN_ROUTE_SYMBOL", () => {
    const proxy = createTestProxy();
    const key = buildQueryKey(proxy.api);
    expect(key[0]).toBe(EDEN_ROUTE_SYMBOL);
  });

  it("returns correct type", () => {
    const proxy = createTestProxy();
    const key = buildQueryKey(proxy.users);
    expectTypeOf(key).toMatchTypeOf<EdenQueryKey>();
  });

  it("produces deterministic keys for same params in different order", () => {
    const proxy = createTestProxy();
    const key1 = buildQueryKey(proxy.users.get({ b: 1, a: 2 }));
    const key2 = buildQueryKey(proxy.users.get({ a: 2, b: 1 }));
    expect(JSON.stringify(key1)).toBe(JSON.stringify(key2));
  });
});

describe("buildMutationInvalidationKey", () => {
  it("builds invalidation key from segment proxy", () => {
    const proxy = createTestProxy();
    const key = buildMutationInvalidationKey(proxy.users.posts);
    expect(key).toEqual([EDEN_ROUTE_SYMBOL, "users", "posts"]);
  });

  it("builds invalidation key from method proxy (uses segments only)", () => {
    const proxy = createTestProxy();
    const key = buildMutationInvalidationKey(proxy.users.post);
    expect(key).toEqual([EDEN_ROUTE_SYMBOL, "users"]);
  });

  it("throws on non-proxy input", () => {
    expect(() => buildMutationInvalidationKey({})).toThrow("Expected an eden-enhanced proxy");
  });

  it("returns readonly tuple with symbol prefix", () => {
    const proxy = createTestProxy();
    const key = buildMutationInvalidationKey(proxy.users);
    expect(key[0]).toBe(EDEN_ROUTE_SYMBOL);
  });
});

describe("buildPartialKey", () => {
  it("builds partial key from segments", () => {
    const key = buildPartialKey("users", "posts");
    expect(key).toEqual([EDEN_ROUTE_SYMBOL, "users", "posts"]);
  });

  it("builds partial key with single segment", () => {
    const key = buildPartialKey("users");
    expect(key).toEqual([EDEN_ROUTE_SYMBOL, "users"]);
  });

  it("builds partial key with no segments", () => {
    const key = buildPartialKey();
    expect(key).toEqual([EDEN_ROUTE_SYMBOL]);
  });
});
