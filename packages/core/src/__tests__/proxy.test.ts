import { describe, it, expect, expectTypeOf } from "vite-plus/test";
import { createEdenQueryProxy, getRouteMeta } from "../proxy";
import { EDEN_ROUTE_SYMBOL } from "../index";
import type { RouteMeta } from "../types";

interface MockClient {
  users: {
    get: (params?: unknown) => unknown;
    post: (params?: unknown) => unknown;
    put: (params?: unknown) => unknown;
    delete: (params?: unknown) => unknown;
    patch: (params?: unknown) => unknown;
    posts: Record<string, unknown>;
    [EDEN_ROUTE_SYMBOL]: RouteMeta;
  };
  api: {
    v1: {
      users: Record<string, unknown>;
    };
  };
}

function createTestProxy() {
  return createEdenQueryProxy({} as MockClient);
}

describe("createEdenQueryProxy", () => {
  it("creates a proxy from a client object", () => {
    const proxy = createTestProxy();
    expect(proxy).toBeDefined();
  });

  it("tracks single segment access", () => {
    const proxy = createTestProxy();
    const meta = getRouteMeta(proxy.users);
    expect(meta).toBeDefined();
    expect(meta?.segments).toEqual(["users"]);
  });

  it("tracks multi-segment access", () => {
    const proxy = createTestProxy();
    const meta = getRouteMeta(proxy.users.posts);
    expect(meta?.segments).toEqual(["users", "posts"]);
  });

  it("tracks deeply nested segment access", () => {
    const proxy = createTestProxy();
    const meta = getRouteMeta(proxy.api.v1.users);
    expect(meta?.segments).toEqual(["api", "v1", "users"]);
  });

  it("captures HTTP method as metadata", () => {
    const proxy = createTestProxy();
    const meta = getRouteMeta(proxy.users.get);
    expect(meta?.segments).toEqual(["users"]);
    expect(meta?.method).toBe("get");
  });

  it("captures post method", () => {
    const proxy = createTestProxy();
    const meta = getRouteMeta(proxy.users.post);
    expect(meta?.method).toBe("post");
  });

  it("captures put method", () => {
    const proxy = createTestProxy();
    const meta = getRouteMeta(proxy.users.put);
    expect(meta?.method).toBe("put");
  });

  it("captures delete method", () => {
    const proxy = createTestProxy();
    const meta = getRouteMeta(proxy.users.delete);
    expect(meta?.method).toBe("delete");
  });

  it("captures patch method", () => {
    const proxy = createTestProxy();
    const meta = getRouteMeta(proxy.users.patch);
    expect(meta?.method).toBe("patch");
  });

  it("captures params when method is called with arguments", () => {
    const proxy = createTestProxy();
    const result = proxy.users.get({ id: "123" });
    const meta = getRouteMeta(result);
    expect(meta?.segments).toEqual(["users"]);
    expect(meta?.method).toBe("get");
    expect(meta?.params).toEqual({ id: "123" });
  });

  it("preserves method function name via Object.defineProperty", () => {
    const proxy = createTestProxy();
    const getFn = proxy.users.get;
    expect((getFn as { name: string }).name).toBe("get");
  });

  it("preserves method function length via Object.defineProperty", () => {
    const proxy = createTestProxy();
    const getFn = proxy.users.get;
    expect((getFn as { length: number }).length).toBe(1);
  });

  it("exposes EDEN_ROUTE_SYMBOL on segments", () => {
    const proxy = createTestProxy();
    const meta = proxy.users[EDEN_ROUTE_SYMBOL];
    expect(meta).toBeDefined();
    expect(meta.segments).toEqual(["users"]);
  });

  it("exposes EDEN_ROUTE_SYMBOL on method proxies", () => {
    const proxy = createTestProxy();
    const getFn = proxy.users.get as unknown as Record<typeof EDEN_ROUTE_SYMBOL, RouteMeta>;
    const meta = getFn[EDEN_ROUTE_SYMBOL];
    expect(meta.method).toBe("get");
  });
});

describe("getRouteMeta", () => {
  it("returns undefined for non-proxy objects", () => {
    expect(getRouteMeta({})).toBeUndefined();
    expect(getRouteMeta(null)).toBeUndefined();
    expect(getRouteMeta(42)).toBeUndefined();
    expect(getRouteMeta("string")).toBeUndefined();
  });

  it("returns RouteMeta for proxy objects", () => {
    const proxy = createTestProxy();
    const meta = getRouteMeta(proxy.users);
    expectTypeOf(meta).toEqualTypeOf<RouteMeta | undefined>();
    expect(meta).toBeDefined();
  });

  it("returns undefined for undefined input", () => {
    expect(getRouteMeta(undefined)).toBeUndefined();
  });
});
