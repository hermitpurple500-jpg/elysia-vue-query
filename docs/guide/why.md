# Why elysia-vue-query?

## The glue code problem

You have an Elysia backend and a Vue frontend. Eden Treaty gives you a typed client. TanStack Vue Query handles caching and refetching. Two excellent tools — but connecting them is tedious:

```ts
// you end up writing this for every endpoint
const { data } = useQuery({
  queryKey: ['users', 'list'],
  queryFn: async () => {
    const res = await client.users.get()
    if (res.error) throw res.error
    return res.data
  },
})
```

That's three things to get right per endpoint: a query key (which you'll inevitably typo), the Eden response unwrap (every time), and remembering which keys to bust on mutations. It doesn't scale.

## What this library does

```ts
const eden = createEdenQueryHelpers(client)

const { data } = eden.useQuery(eden.proxy.users.get)
// key, unwrapping, types — all handled.

const mutation = eden.useMutation(eden.proxy.users.post)
// after success, users.* queries refetch automatically.
```

That's it. No strings for keys. No manual unwrapping. No `onSuccess` invalidation boilerplate.

## How it works under the hood

**Deterministic keys.** A recursive Proxy tracks every property access on `eden.proxy`. `eden.proxy.users.get` produces the key `[Symbol('eden_route'), 'users', 'get']`. Call it with params — `eden.proxy.users.get({ page: 1 })` — and the params get stably serialized (keys sorted, `undefined` stripped) and inserted into the key. Same endpoint, same key. Always.

**Symbol namespacing.** Every key starts with a `unique symbol`, so your eden keys can't collide with any other query keys in your app, even if someone else also uses `['users']`.

**Hierarchical invalidation.** When a mutation at `users.post` succeeds, the library invalidates `[Symbol, 'users']` — a prefix that matches `users.get`, `users.get({page:1})`, etc. It uses TanStack's built-in partial key matching, nothing custom.

**Zero config.** No providers, no codegen, no config files. You still need `VueQueryPlugin` (you'd set that up anyway). Beyond that, it's one function call.
