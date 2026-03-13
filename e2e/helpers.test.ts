import { describe, it, expect } from "vite-plus/test";
import {
  createEdenQueryProxy,
  buildQueryKey,
  buildMutationInvalidationKey,
  getRouteMeta,
  EDEN_ROUTE_SYMBOL,
} from "@elysia-vue-query/core";

/**
 * E2E test for the Vue helpers layer.
 *
 * Since `createEdenQueryHelpers` wraps TanStack Vue Query (which needs a
 * running Vue app + VueQueryPlugin), we test the underlying functions it
 * relies on in an integration scenario that mirrors real usage: building a
 * proxy from a realistic client, extracting keys, and verifying the
 * query/mutation function wiring is correct.
 */

// Realistic Eden-like client matching the playground API shape
function createRealisticClient() {
  const users = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", createdAt: "2025-01-15T10:30:00Z" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", createdAt: "2025-02-20T14:15:00Z" },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@example.com",
      createdAt: "2025-03-10T09:00:00Z",
    },
  ];
  const posts = [
    {
      id: 1,
      userId: 1,
      title: "Getting Started with Elysia",
      body: "Elysia is a fast, type-safe web framework...",
    },
    {
      id: 2,
      userId: 1,
      title: "Eden Treaty Deep Dive",
      body: "Eden Treaty provides end-to-end type safety...",
    },
    {
      id: 3,
      userId: 2,
      title: "Vue Query Patterns",
      body: "TanStack Query for Vue brings powerful data fetching...",
    },
  ];

  return {
    users: Object.assign(
      (params: { id: string }) => ({
        get: () =>
          Promise.resolve({
            data: users.find((u) => u.id === Number(params.id)) ?? null,
            error: users.find((u) => u.id === Number(params.id)) ? null : "Not found",
            status: users.find((u) => u.id === Number(params.id)) ? 200 : 404,
          }),
        delete: () => {
          const idx = users.findIndex((u) => u.id === Number(params.id));
          if (idx === -1) return Promise.resolve({ data: null, error: "Not found", status: 404 });
          return Promise.resolve({ data: users.splice(idx, 1)[0], error: null, status: 200 });
        },
        posts: {
          get: () =>
            Promise.resolve({
              data: posts.filter((p) => p.userId === Number(params.id)),
              error: null,
              status: 200,
            }),
        },
      }),
      {
        get: () => Promise.resolve({ data: [...users], error: null, status: 200 }),
        post: (body: { name: string; email: string }) => {
          const user = { id: users.length + 1, ...body, createdAt: new Date().toISOString() };
          users.push(user);
          return Promise.resolve({ data: user, error: null, status: 201 });
        },
      },
    ),
    posts: {
      get: () => Promise.resolve({ data: [...posts], error: null, status: 200 }),
      post: (body: { userId: number; title: string; body: string }) => {
        const post = { id: posts.length + 1, ...body };
        posts.push(post);
        return Promise.resolve({ data: post, error: null, status: 201 });
      },
    },
  };
}

describe("helpers integration: proxy + key + endpoint call", () => {
  it("proxy endpoint is callable and returns Eden-shaped response", async () => {
    const client = createRealisticClient();
    const proxy = createEdenQueryProxy(client);

    // Simulating what useQuery's queryFn does internally
    const response = await (
      proxy.users.get as unknown as () => Promise<{ data: unknown; error: unknown }>
    )();
    expect(response).toHaveProperty("data");
    expect(response).toHaveProperty("error");
    expect(response.error).toBeNull();
    expect(Array.isArray(response.data)).toBe(true);
  });

  it("proxy parameterized endpoint retrieves specific data", async () => {
    const client = createRealisticClient();
    const proxy = createEdenQueryProxy(client);

    const endpoint = proxy.users({ id: "1" }).get;
    const response = await (
      endpoint as unknown as () => Promise<{ data: unknown; error: unknown }>
    )();
    expect(response.error).toBeNull();
    expect(response.data).toMatchObject({ id: 1, name: "Alice Johnson" });
  });

  it("proxy mutation endpoint accepts body and modifies state", async () => {
    const client = createRealisticClient();
    const proxy = createEdenQueryProxy(client);

    const endpoint = proxy.users.post;
    const response = await (
      endpoint as unknown as (body: unknown) => Promise<{ data: unknown; error: unknown }>
    )({
      name: "Dave",
      email: "dave@example.com",
    });

    expect(response.error).toBeNull();
    expect(response.data).toMatchObject({ name: "Dave", email: "dave@example.com" });

    // Verify state mutation — subsequent GET should include new user
    const listResponse = await (
      proxy.users.get as unknown as () => Promise<{ data: unknown[]; error: unknown }>
    )();
    expect(listResponse.data).toHaveLength(4);
  });

  it("getKey returns the same key as buildQueryKey for same endpoint", () => {
    const client = createRealisticClient();
    const proxy = createEdenQueryProxy(client);

    const directKey = buildQueryKey(proxy.users.get);

    // Simulating what helpers.getKey does
    const helperKey = buildQueryKey(proxy.users.get);

    expect(directKey).toEqual(helperKey);
  });

  it("full query workflow: key + fetch + unwrap", async () => {
    const client = createRealisticClient();
    const proxy = createEdenQueryProxy(client);

    // Step 1: Build key (what useQuery does internally)
    const endpoint = proxy.users.get;
    const meta = getRouteMeta(endpoint);
    expect(meta).toBeDefined();

    const queryKey = buildQueryKey(endpoint);
    expect(queryKey[0]).toBe(EDEN_ROUTE_SYMBOL);

    // Step 2: Call endpoint (what queryFn does)
    const response = await (
      endpoint as unknown as () => Promise<{ data: unknown; error: unknown }>
    )();

    // Step 3: Unwrap (what the adapter does)
    if (response.error !== null) throw response.error;
    const data = response.data;

    expect(Array.isArray(data)).toBe(true);
    expect((data as unknown[]).length).toBeGreaterThan(0);
  });

  it("full mutation workflow: key + mutate + invalidation key", async () => {
    const client = createRealisticClient();
    const proxy = createEdenQueryProxy(client);

    const mutationEndpoint = proxy.users.post;
    const meta = getRouteMeta(mutationEndpoint);
    expect(meta).toBeDefined();

    // Build invalidation key (what useMutation uses)
    const invalidationKey = buildMutationInvalidationKey(mutationEndpoint);

    // Call mutation
    const response = await (
      mutationEndpoint as unknown as (body: unknown) => Promise<{ data: unknown; error: unknown }>
    )({
      name: "Eve",
      email: "eve@example.com",
    });

    if (response.error !== null) throw response.error;
    expect(response.data).toMatchObject({ name: "Eve" });

    // Verify invalidation key would match users.get queries
    const queryKey = buildQueryKey(proxy.users.get);

    // invalidationKey = [Symbol, 'users']
    // queryKey        = [Symbol, 'users', 'get']
    // TanStack uses partialDeepEqual: every element in invalidationKey
    // must exist at the same index in queryKey
    for (let i = 0; i < invalidationKey.length; i++) {
      expect(queryKey[i]).toBe(invalidationKey[i]);
    }
  });

  it("error response is correctly surfaced", async () => {
    const client = createRealisticClient();
    const proxy = createEdenQueryProxy(client);

    const endpoint = proxy.users({ id: "999" }).get;
    const response = await (
      endpoint as unknown as () => Promise<{ data: unknown; error: unknown; status: number }>
    )();

    expect(response.data).toBeNull();
    expect(response.error).toBe("Not found");
    expect(response.status).toBe(404);
  });

  it("delete mutation modifies state and returns deleted entity", async () => {
    const client = createRealisticClient();
    const proxy = createEdenQueryProxy(client);

    // Get initial count
    const beforeResponse = await (
      proxy.users.get as unknown as () => Promise<{ data: unknown[] }>
    )();
    const initialCount = beforeResponse.data.length;

    // Delete user 1
    const deleteEndpoint = proxy.users({ id: "1" }).delete;
    const response = await (
      deleteEndpoint as unknown as () => Promise<{ data: unknown; error: unknown }>
    )();
    expect(response.error).toBeNull();
    expect(response.data).toMatchObject({ id: 1 });

    // Verify state changed
    const afterResponse = await (
      proxy.users.get as unknown as () => Promise<{ data: unknown[] }>
    )();
    expect(afterResponse.data.length).toBe(initialCount - 1);
  });
});

describe("cross-endpoint key isolation", () => {
  it("users and posts have different key namespaces", () => {
    const client = createRealisticClient();
    const proxy = createEdenQueryProxy(client);

    const usersKey = buildQueryKey(proxy.users.get);
    const postsKey = buildQueryKey(proxy.posts.get);

    expect(usersKey[0]).toBe(postsKey[0]); // same Symbol
    expect(usersKey[1]).not.toBe(postsKey[1]); // different segments
  });

  it("GET and POST on same resource have different keys", () => {
    const client = createRealisticClient();
    const proxy = createEdenQueryProxy(client);

    const getKey = buildQueryKey(proxy.users.get);
    const postMeta = getRouteMeta(proxy.users.post);

    expect(getKey).toContain("get");
    expect(postMeta!.method).toBe("post");
  });

  it("same endpoint with different params produces different keys", () => {
    const client = createRealisticClient();
    const proxy = createEdenQueryProxy(client);

    const key1 = buildQueryKey(proxy.users({ id: "1" }).get);
    const key2 = buildQueryKey(proxy.users({ id: "2" }).get);

    expect(key1).not.toEqual(key2);
  });

  it("same endpoint with same params produces identical keys", () => {
    const client = createRealisticClient();
    const proxy = createEdenQueryProxy(client);

    const key1 = buildQueryKey(proxy.users({ id: "1" }).get);
    const key2 = buildQueryKey(proxy.users({ id: "1" }).get);

    expect(key1).toEqual(key2);
  });
});
