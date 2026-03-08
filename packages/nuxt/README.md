# @elysia-vue-query/nuxt

Nuxt module for elysia-vue-query with SSR dehydration and hydration.

[![npm](https://img.shields.io/npm/v/@elysia-vue-query/nuxt?style=flat-square)](https://www.npmjs.com/package/@elysia-vue-query/nuxt)
[![License](https://img.shields.io/github/license/elysia-vue-query/elysia-vue-query?style=flat-square)](https://opensource.org/licenses/MIT)
[![Nuxt](https://img.shields.io/badge/Nuxt-020420?style=flat-square&logo=nuxt)](https://nuxt.com)

---

## Role in the Monorepo

This package is a Nuxt module that provides zero-config integration with `@elysia-vue-query/vue`. It handles the parts that are tedious to set up manually in a Nuxt application:

- **Automatic `VueQueryPlugin` registration** -- No need to create a Nuxt plugin for TanStack Query.
- **SSR dehydration / hydration** -- Query state is serialized on the server via the `app:rendered` hook and rehydrated on the client via the `app:created` hook, using Nuxt's `useState` transport.
- **Auto-imports** -- `createEdenQueryHelpers` is available in any component or composable without explicit imports.

## Install

```bash
bun add @elysia-vue-query/nuxt
```

## Setup

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@elysia-vue-query/nuxt'],
})
```

Then create a composable for your Eden client:

```ts
// composables/eden.ts
import { treaty } from '@elysiajs/eden'
import type { App } from '../server'

const client = treaty<App>('http://localhost:3000')
export const eden = createEdenQueryHelpers(client) // auto-imported
```

## Documentation

Full SSR guide, hydration details, and configuration options:
**[elysia-vue-query.github.io/elysia-vue-query/guide/ssr](https://elysia-vue.pages.dev/guide/ssr)**

## License

[MIT](../../LICENSE)
