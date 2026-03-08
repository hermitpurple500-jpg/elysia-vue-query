import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  createEdenQueryProxy,
  buildQueryKey,
  buildMutationInvalidationKey,
  getRouteMeta,
  EDEN_ROUTE_SYMBOL,
  stableSerialize,
} from '@elysia-vue-query/core'

/**
 * End-to-end tests for the full pipeline:
 * Client → Proxy → RouteMeta → QueryKey → Serialization
 *
 * Unlike unit tests that test each function in isolation,
 * these tests verify the complete flow works together.
 */

// Simulate an Eden Treaty–style client shape
function createMockClient() {
  const users = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
  ]
  const posts = [
    { id: 1, userId: 1, title: 'Hello', body: 'World' },
  ]

  return {
    users: Object.assign(
      (params: { id: string }) => ({
        get: () => Promise.resolve({ data: users.find(u => u.id === Number(params.id)), error: null, status: 200 }),
        delete: () => {
          const idx = users.findIndex(u => u.id === Number(params.id))
          if (idx === -1) return Promise.resolve({ data: null, error: 'Not found', status: 404 })
          return Promise.resolve({ data: users.splice(idx, 1)[0], error: null, status: 200 })
        },
        posts: {
          get: () => Promise.resolve({
            data: posts.filter(p => p.userId === Number(params.id)),
            error: null,
            status: 200,
          }),
        },
      }),
      {
        get: (params?: Record<string, unknown>) => Promise.resolve({ data: users, error: null, status: 200 }),
        post: (body: { name: string; email: string }) => {
          const user = { id: users.length + 1, ...body }
          users.push(user)
          return Promise.resolve({ data: user, error: null, status: 200 })
        },
      },
    ),
    posts: {
      get: () => Promise.resolve({ data: posts, error: null, status: 200 }),
      post: (body: { userId: number; title: string; body: string }) => {
        const post = { id: posts.length + 1, ...body }
        posts.push(post)
        return Promise.resolve({ data: post, error: null, status: 200 })
      },
    },
  }
}

describe('proxy → key pipeline', () => {
  it('builds correct query keys for simple GET endpoints', () => {
    const client = createMockClient()
    const proxy = createEdenQueryProxy(client)

    const key = buildQueryKey(proxy.users.get)
    expect(key[0]).toBe(EDEN_ROUTE_SYMBOL)
    expect(key).toContain('users')
    expect(key).toContain('get')
  })

  it('builds correct query keys for nested routes', () => {
    const client = createMockClient()
    const proxy = createEdenQueryProxy(client)

    const key = buildQueryKey(proxy.posts.get)
    expect(key[0]).toBe(EDEN_ROUTE_SYMBOL)
    expect(key).toContain('posts')
    expect(key).toContain('get')
  })

  it('builds correct query keys for parameterized routes', () => {
    const client = createMockClient()
    const proxy = createEdenQueryProxy(client)

    const key = buildQueryKey(proxy.users({ id: '1' }).get)
    expect(key[0]).toBe(EDEN_ROUTE_SYMBOL)
    expect(key).toContain('users')
    expect(key).toContain('get')
    // Path params are serialized into segments as JSON strings
    expect(key).toContain('{"id":"1"}')
  })

  it('builds correct query keys for deeply nested parameterized routes', () => {
    const client = createMockClient()
    const proxy = createEdenQueryProxy(client)

    const key = buildQueryKey(proxy.users({ id: '1' }).posts.get)
    expect(key[0]).toBe(EDEN_ROUTE_SYMBOL)
    expect(key).toContain('users')
    expect(key).toContain('posts')
    expect(key).toContain('get')
  })

  it('builds mutation invalidation keys that are prefixes of query keys', () => {
    const client = createMockClient()
    const proxy = createEdenQueryProxy(client)

    const queryKey = buildQueryKey(proxy.users.get)
    const mutationKey = buildMutationInvalidationKey(proxy.users.post)

    // Mutation key should be a prefix of query key
    // mutationKey = [Symbol, 'users']
    // queryKey    = [Symbol, 'users', 'get']
    expect(mutationKey[0]).toBe(queryKey[0]) // same Symbol
    expect(mutationKey[1]).toBe('users')
    expect(mutationKey).not.toContain('post') // method stripped
    expect(mutationKey).not.toContain('get')
  })

  it('produces deterministic keys regardless of param property order', () => {
    const client = createMockClient()
    const proxy = createEdenQueryProxy(client)

    // Path params are serialized with stable key ordering
    const key1 = buildQueryKey(proxy.users({ id: '1', role: 'admin' }).get)
    const key2 = buildQueryKey(proxy.users({ role: 'admin', id: '1' }).get)

    expect(key1).toEqual(key2)
  })
})

describe('proxy → route meta extraction', () => {
  it('extracts segments and method from simple proxy', () => {
    const client = createMockClient()
    const proxy = createEdenQueryProxy(client)

    const meta = getRouteMeta(proxy.users.get)
    expect(meta).toBeDefined()
    expect(meta!.segments).toEqual(['users'])
    expect(meta!.method).toBe('get')
  })

  it('extracts segments, method, and params from parameterized proxy', () => {
    const client = createMockClient()
    const proxy = createEdenQueryProxy(client)

    const meta = getRouteMeta(proxy.users({ id: '42' }).get)
    expect(meta).toBeDefined()
    // Path params are serialized into the segments array
    expect(meta!.segments).toEqual(['users', '{"id":"42"}'])
    expect(meta!.method).toBe('get')
  })

  it('extracts nested segments correctly', () => {
    const client = createMockClient()
    const proxy = createEdenQueryProxy(client)

    const meta = getRouteMeta(proxy.users({ id: '1' }).posts.get)
    expect(meta).toBeDefined()
    expect(meta!.segments).toContain('users')
    expect(meta!.segments).toContain('posts')
    expect(meta!.method).toBe('get')
  })
})

describe('serialization in key pipeline', () => {
  it('serializes path params deterministically through the full pipeline', () => {
    const client = createMockClient()
    const proxy = createEdenQueryProxy(client)

    // Path params are serialized into segments with stable key ordering
    const key1 = buildQueryKey(proxy.users({ z: 1, a: 2, m: 3 }).get)
    const key2 = buildQueryKey(proxy.users({ m: 3, z: 1, a: 2 }).get)

    // Keys should be identical regardless of property order
    expect(key1).toEqual(key2)

    // The serialized param segment should have sorted keys
    const paramSegment = key1.find(part => typeof part === 'string' && part.startsWith('{')) as string
    const parsed = JSON.parse(paramSegment)
    expect(Object.keys(parsed)).toEqual(['a', 'm', 'z'])
  })

  it('strips undefined params through the pipeline', () => {
    const client = createMockClient()
    const proxy = createEdenQueryProxy(client)

    // Path params with undefined values are stripped during serialization
    const key = buildQueryKey(proxy.users({ page: 1, filter: undefined }).get)
    const paramSegment = key.find(part => typeof part === 'string' && part.startsWith('{')) as string
    const parsed = JSON.parse(paramSegment)

    expect(parsed).toHaveProperty('page')
    expect(parsed).not.toHaveProperty('filter')
  })

  it('handles nested objects in params', () => {
    const client = createMockClient()
    const proxy = createEdenQueryProxy(client)

    const key = buildQueryKey(proxy.users({ filter: { role: 'admin', status: 'active' } }).get)
    const paramSegment = key.find(part => typeof part === 'string' && part.startsWith('{')) as string
    const parsed = JSON.parse(paramSegment)

    expect(parsed).toHaveProperty('filter')
    const filter = parsed.filter as Record<string, unknown>
    expect(Object.keys(filter)).toEqual(['role', 'status']) // sorted
  })
})

describe('key matching for cache invalidation', () => {
  it('mutation invalidation key matches all query keys in the same subtree', () => {
    const client = createMockClient()
    const proxy = createEdenQueryProxy(client)

    const mutKey = buildMutationInvalidationKey(proxy.users.post)
    const getAll = buildQueryKey(proxy.users.get)
    const getOne = buildQueryKey(proxy.users({ id: '1' }).get)
    const getPosts = buildQueryKey(proxy.users({ id: '1' }).posts.get)

    // All query keys should start with the mutation invalidation prefix
    for (const queryKey of [getAll, getOne, getPosts]) {
      // Check symbol matches
      expect(queryKey[0]).toBe(mutKey[0])
      // Check 'users' segment matches
      expect(queryKey[1]).toBe(mutKey[1])
    }
  })

  it('mutation invalidation key does NOT match unrelated subtrees', () => {
    const client = createMockClient()
    const proxy = createEdenQueryProxy(client)

    const usersMutKey = buildMutationInvalidationKey(proxy.users.post)
    const postsQueryKey = buildQueryKey(proxy.posts.get)

    // 'posts' subtree should not share segments with 'users' invalidation
    expect(postsQueryKey[1]).not.toBe(usersMutKey[1])
  })

  it('deeper mutation keys create narrower invalidation scopes', () => {
    const client = createMockClient()
    const proxy = createEdenQueryProxy(client)

    const broadKey = buildMutationInvalidationKey(proxy.users.post)
    const narrowKey = buildMutationInvalidationKey(proxy.users({ id: '1' }).posts.post)

    // Broad key should be shorter (fewer segments)
    expect(broadKey.length).toBeLessThan(narrowKey.length)
  })
})
