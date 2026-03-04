---
layout: home

hero:
  name: elysia-vue-query
  text: Wire Eden to Vue Query. Forget the glue code.
  tagline: Derive query keys from your routes. Unwrap Eden responses. Invalidate the right caches. All typed, all automatic.
  image:
    src: /logo.svg
    alt: elysia-vue-query logo
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: GitHub
      link: https://github.com/elysia-vue-query/elysia-vue-query

features:
  - title: No more query key strings
    details: Keys come from your route structure — eden.proxy.users.get becomes [Symbol, 'users', 'get']. Rename a route, the key follows.
  - title: Types all the way down
    details: Data, errors, and mutation payloads are inferred from your Elysia schemas. You never write a generic parameter.
  - title: Mutations that clean up after themselves
    details: POST /users? Every users.get query refetches. The invalidation scope is the route subtree, not a string you have to remember.
  - title: Eden's envelope, handled
    details: "Eden returns { data, error, status }. Vue Query expects data or throw. The adapter normalizes this so you don't have to."
  - title: Bring your own framework
    details: The core package is framework-agnostic — proxy enhancer, serialization, key builder. The vue package is a thin layer on top.
  - title: ~5 kB. No config.
    details: No providers beyond VueQueryPlugin. No codegen. One function call and you're querying.
---

<div class="home-example">

## See it work

Set up once:

```ts
// lib/eden.ts
import { createEdenQueryHelpers } from '@elysia-vue-query/vue'
import { treaty } from '@elysiajs/eden'
import type { App } from './server'

const client = treaty<App>('http://localhost:3000')
export const eden = createEdenQueryHelpers(client)
```

Then use it in any component:

```vue
<script setup lang="ts">
import { eden } from '../lib/eden'

// data is typed. key is automatic. response is unwrapped.
const { data: users, isLoading } = eden.useQuery(eden.proxy.users.get)

// after mutate() succeeds, users.get refetches on its own.
const createUser = eden.useMutation(eden.proxy.users.post)
</script>
```

</div>
