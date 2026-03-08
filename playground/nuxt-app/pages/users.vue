<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">Users</h1>
      <p class="page-desc">
        Live CRUD with <code style="font-family:'JetBrains Mono',monospace;color:rgba(52,211,153,0.65);">eden.useQuery</code> + <code style="font-family:'JetBrains Mono',monospace;color:rgba(167,139,250,0.65);">eden.useMutation</code>.
        Creating a user auto-invalidates the query cache — no manual key needed.
      </p>
    </div>

    <!-- Create User Form -->
    <div class="card section">
      <div class="card-title">
        <span>➕</span>
        Add User
        <span class="tag tag--mutation" style="margin-left:auto;">useMutation</span>
      </div>
      <form class="create-form" @submit.prevent="handleCreate">
        <div class="form-row" style="margin-bottom:0.75rem;">
          <div class="form-group">
            <label class="form-label">Name</label>
            <input v-model="name" class="form-input" type="text" placeholder="Jane Doe" required :disabled="createMutation.isPending.value" />
          </div>
          <div class="form-group">
            <label class="form-label">Email</label>
            <input v-model="email" class="form-input" type="email" placeholder="jane@example.com" required :disabled="createMutation.isPending.value" />
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:0.875rem;">
          <button type="submit" class="btn-primary" :disabled="createMutation.isPending.value">
            <span v-if="createMutation.isPending.value" style="display:flex;align-items:center;gap:6px;">
              <span class="spinner" />Creating…
            </span>
            <span v-else>Create User</span>
          </button>
          <Transition name="fade">
            <span v-if="showSuccess" class="success-box">
              ✓ Created — list auto-refreshed!
            </span>
          </Transition>
        </div>
        <p v-if="createMutation.isError.value" style="font-size:0.75rem;color:#f87171;margin-top:0.5rem;">
          {{ createMutation.error.value?.message ?? 'Request failed' }}
        </p>
      </form>
    </div>

    <!-- User list -->
    <div class="card section">
      <div class="card-title">
        <span>👤</span>
        All Users
        <span class="tag tag--query" style="margin-left:auto;">useQuery</span>
      </div>

      <div v-if="status === 'pending'" class="loading"><div class="spinner" />Fetching users…</div>
      <div v-else-if="status === 'error'" class="error-box">
        {{ error?.message ?? 'Failed to load. Is the API running on localhost:3000?' }}
      </div>
      <div v-else-if="users && users.length > 0" class="row-list">
        <div v-for="user in users" :key="user.id" class="row-item">
          <div class="avatar">{{ user.name.charAt(0) }}</div>
          <div class="row-info">
            <div class="row-name">{{ user.name }}</div>
            <div class="row-meta">{{ user.email }}</div>
          </div>
          <span class="row-badge badge-id">#{{ user.id }}</span>
          <button
            class="btn-danger"
            @click="handleDelete(user.id)"
            :disabled="deleteMutation.isPending.value && deleteMutation.variables.value?.params.id === user.id.toString()"
          >Delete</button>
        </div>
      </div>
      <div v-else class="empty">
        <div class="empty-text">No users yet — create one above!</div>
      </div>
    </div>

    <!-- Query Key Debug -->
    <div class="card section">
      <div class="card-title"><span>🔑</span> Query Key Debug</div>
      <div class="code-block">
<span class="cm">// eden.getKey(eden.proxy.users.get)</span>
{{ JSON.stringify(queryKey, replacer, 2) }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { eden } from '~/composables/eden'

const name = ref('')
const email = ref('')
const showSuccess = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

const { data: users, status, error } = eden.useQuery(eden.proxy.users.get)
const createMutation = eden.useMutation(eden.proxy.users.post)
const deleteMutation = eden.useMutation(eden.proxy.users[':id'].delete)
const queryKey = eden.getKey(eden.proxy.users.get)

function replacer(_key: string, value: unknown) {
  if (typeof value === 'symbol') return value.toString()
  return value
}

function handleCreate() {
  if (!name.value.trim() || !email.value.trim()) return
  createMutation.mutate(
    { name: name.value.trim(), email: email.value.trim() },
    {
      onSuccess: () => {
        name.value = ''
        email.value = ''
        showSuccess.value = true
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => { showSuccess.value = false }, 3000)
      },
    },
  )
}

function handleDelete(id: number) {
  deleteMutation.mutate({ params: { id: id.toString() } })
}
</script>
