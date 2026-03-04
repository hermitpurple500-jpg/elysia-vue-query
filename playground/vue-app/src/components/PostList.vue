<script setup lang="ts">
import { eden } from '../lib/eden'

const { data: posts, status, error } = eden.useQuery(eden.proxy.posts.get)
</script>

<template>
  <div class="post-list">
    <div v-if="status === 'pending'" class="state">
      <span class="dot pulse"></span>
      <span>Fetching posts…</span>
    </div>

    <div v-else-if="status === 'error'" class="state state--error">
      {{ error?.message ?? 'Failed to fetch' }}
    </div>

    <template v-else-if="posts && posts.length > 0">
      <ul class="rows">
        <li v-for="post in posts" :key="post.id" class="row">
          <div class="row-top">
            <span class="title">{{ post.title }}</span>
            <code class="meta">user:{{ post.userId }}</code>
          </div>
          <p class="body">{{ post.body }}</p>
        </li>
      </ul>
    </template>

    <p v-else class="empty">No posts yet.</p>
  </div>
</template>

<style scoped>
.post-list {
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
  gap: 0.5rem;
}

.row {
  padding: 0.65rem 0.7rem;
  border-radius: 6px;
  background: var(--surface-2);
  transition: background 0.12s;
}

.row:hover {
  background: var(--surface-3);
}

.row-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.25rem;
  gap: 0.5rem;
}

.title {
  font-size: 0.84rem;
  font-weight: 500;
  color: var(--text);
}

.meta {
  font-size: 0.68rem;
  color: var(--text-3);
  flex-shrink: 0;
}

.body {
  font-size: 0.78rem;
  color: var(--text-2);
  line-height: 1.5;
}

.empty {
  font-size: 0.82rem;
  color: var(--text-3);
  text-align: center;
  padding: 1.5rem 0;
}
</style>
