<script setup lang="ts">
import { eden } from '../lib/eden'

const { data: users, status, error } = eden.useQuery(eden.proxy.users.get)
</script>

<template>
  <div class="user-list">
    <div v-if="status === 'pending'" class="state">
      <span class="dot pulse"></span>
      <span>Fetching users…</span>
    </div>

    <div v-else-if="status === 'error'" class="state state--error">
      {{ error?.message ?? 'Failed to fetch' }}
    </div>

    <template v-else-if="users && users.length > 0">
      <ul class="rows">
        <li v-for="user in users" :key="user.id" class="row">
          <span class="avatar">{{ user.name.charAt(0) }}</span>
          <div class="info">
            <span class="name">{{ user.name }}</span>
            <span class="email">{{ user.email }}</span>
          </div>
          <code class="id">#{{ user.id }}</code>
        </li>
      </ul>
    </template>

    <p v-else class="empty">No users yet — create one above.</p>
  </div>
</template>

<style scoped>
.user-list {
  margin-top: 0.75rem;
}

.state {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  font-size: 0.82rem;
  color: var(--text-2);
  background: var(--surface-2);
  border-radius: 6px;
}

.state--error {
  color: var(--error);
  background: var(--error-soft);
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--green);
  flex-shrink: 0;
}

.dot.pulse {
  animation: pulse 1.2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

.rows {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.row {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.6rem 0.7rem;
  border-radius: 6px;
  transition: background 0.12s;
}

.row:hover {
  background: var(--surface-2);
}

.avatar {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: var(--green-soft);
  border: 1px solid var(--green-border);
  color: var(--green);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.75rem;
  flex-shrink: 0;
}

.info {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.name {
  font-size: 0.84rem;
  font-weight: 500;
  color: var(--text);
}

.email {
  font-size: 0.75rem;
  color: var(--text-3);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.id {
  font-size: 0.7rem;
  color: var(--text-3);
}

.empty {
  font-size: 0.82rem;
  color: var(--text-3);
  text-align: center;
  padding: 1.5rem 0;
}
</style>
