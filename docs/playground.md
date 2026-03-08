# Playground

The repository ships runnable examples so you can inspect the actual integration instead of reading only isolated snippets.

## Start the backend

```sh
bun run playground:api
```

This launches the Elysia API at `http://localhost:3000`.

## Start a client

For the plain Vue app:

```sh
bun run playground:vue
```

For the Nuxt app with SSR:

```sh
bun run playground:nuxt
```

## What to inspect

The playgrounds are useful for verifying four behaviors end to end:

- `useQuery()` reads with generated keys
- `useMutation()` writes with automatic invalidation
- inferred response and body types
- Nuxt hydration behavior

## Relevant files

- `playground/api/src/index.ts` defines the Elysia routes and exports the `App` type.
- `playground/vue-app/src/lib/eden.ts` shows the minimal Vue helper setup.
- `playground/vue-app/src/components/UserList.vue` and `CreateUser.vue` show basic reads and writes.
- `playground/nuxt-app/composables/eden.ts` shows the Nuxt-side helper setup.
- `playground/nuxt-app/pages/users.vue` and `posts.vue` demonstrate the module-backed SSR path.

## Practical use

If you are evaluating the library, this is the fastest sequence:

1. Run `bun run playground:api`.
2. Run either `bun run playground:vue` or `bun run playground:nuxt`.
3. Open the UI and create or delete data.
4. Watch related views refetch without custom cache key code.
