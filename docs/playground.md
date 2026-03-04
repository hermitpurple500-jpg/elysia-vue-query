# Playground

A runnable playground is included in the repository to demonstrate the library in action.

## Running the Playground

### 1. Start the API Server

```bash
cd playground/api
bun dev
```

This starts an Elysia server at `http://localhost:3000` with the following endpoints:

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/users` | List all users |
| `GET` | `/users/:id` | Get user by ID |
| `POST` | `/users` | Create a user |
| `DELETE` | `/users/:id` | Delete a user |
| `GET` | `/users/:id/posts` | Get posts by user |
| `GET` | `/posts` | List all posts |
| `POST` | `/posts` | Create a post |

### 2. Start the Vue App

```bash
cd playground/vue-app
bun dev
```

This starts a Vite dev server (typically at `http://localhost:5173`) with a Vue 3 app that demonstrates:

- **`useQuery`** — fetching users and posts with auto-generated keys
- **`useMutation`** — creating users with automatic cache invalidation
- **Type inference** — all data types inferred from the Elysia API
- **Loading & error states** — proper handling via TanStack Query

## Playground Structure

```
playground/
├── api/                  # Elysia mock server
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       └── index.ts      # CRUD endpoints, exports `type App`
└── vue-app/              # Vue 3 consumer app
    ├── package.json
    ├── vite.config.ts
    ├── index.html
    └── src/
        ├── main.ts       # Vue app + VueQueryPlugin setup
        ├── App.vue       # Layout shell
        ├── lib/
        │   └── eden.ts   # createEdenQueryHelpers setup
        └── components/
            ├── UserList.vue    # useQuery example
            ├── CreateUser.vue  # useMutation example
            └── PostList.vue    # useQuery example
```

## Key Patterns Demonstrated

### Query Setup (UserList.vue)

```vue
<script setup lang="ts">
import { eden } from '../lib/eden'

const { data: users, status, error } = eden.useQuery(
  eden.proxy.users.get
)
</script>
```

### Mutation with Auto-Invalidation (CreateUser.vue)

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { eden } from '../lib/eden'

const name = ref('')
const email = ref('')

const mutation = eden.useMutation(eden.proxy.users.post)

function submit() {
  mutation.mutate(
    { name: name.value, email: email.value },
    { onSuccess: () => { name.value = ''; email.value = '' } }
  )
  // After success, all users.get queries automatically refetch ✨
}
</script>
```
