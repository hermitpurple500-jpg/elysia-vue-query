<script setup lang="ts">
import { eden } from '../lib/eden'

const { data: users, status, error } = eden.useQuery(eden.proxy.users.get)
const deleteUser = eden.useMutation(eden.proxy.users[':id'].delete)

function removeUser(id: number) {
  deleteUser.mutate({ params: { id: id.toString() } })
}
</script>

<template>
  <div>
    <div v-if="status === 'pending'" style="display:flex;align-items:center;gap:0.5rem;padding:0.75rem;border-radius:8px;background:rgba(255,255,255,0.03);font-size:0.8rem;color:rgba(255,255,255,0.4);">
      <span class="spinner" />
      Fetching users…
    </div>

    <div v-else-if="status === 'error'" style="padding:0.75rem;border-radius:8px;background:rgba(248,113,113,0.08);border:1px solid rgba(248,113,113,0.15);font-size:0.8rem;color:#f87171;">
      {{ error?.message ?? 'Failed to fetch' }}
    </div>

    <template v-else-if="users && users.length > 0">
      <ul style="list-style:none;display:flex;flex-direction:column;gap:2px;">
        <li
          v-for="user in users"
          :key="user.id"
          style="display:flex;align-items:center;gap:0.65rem;padding:0.55rem 0.6rem;border-radius:8px;transition:background 0.12s;cursor:default;"
          class="user-row"
        >
          <div style="width:28px;height:28px;border-radius:7px;background:rgba(52,211,153,0.1);border:1px solid rgba(52,211,153,0.15);color:#34d399;display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:700;flex-shrink:0;">
            {{ user.name.charAt(0).toUpperCase() }}
          </div>
          <div style="flex:1;min-width:0;">
            <div style="font-size:0.82rem;font-weight:500;color:#f1f5f9;">{{ user.name }}</div>
            <div style="font-size:0.72rem;color:rgba(255,255,255,0.3);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{ user.email }}</div>
          </div>
          <code style="font-size:0.66rem;color:rgba(255,255,255,0.2);font-family:'JetBrains Mono',monospace;">#{{ user.id }}</code>
          <button
            class="btn-danger"
            @click="removeUser(user.id)"
            :disabled="deleteUser.isPending.value && deleteUser.variables.value?.params.id === user.id.toString()"
            title="Delete"
          >×</button>
        </li>
      </ul>
    </template>

    <p v-else style="font-size:0.8rem;color:rgba(255,255,255,0.2);text-align:center;padding:1.5rem 0;">
      No users yet — add one above.
    </p>
  </div>
</template>

<style scoped>
.user-row:hover { background: rgba(255,255,255,0.03); }
</style>
