<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">Overview</h1>
      <p class="page-desc">
        SSR-hydrated queries, zero-config cache invalidation, and end-to-end type safety
        powered by <strong style="color:rgba(255,255,255,0.7);">Eden Treaty</strong> + <strong style="color:rgba(255,255,255,0.7);">TanStack Query v5</strong>.
      </p>
    </div>

    <!-- Stats row -->
    <div class="grid-3 section">
      <div class="stat-card">
        <div class="stat-label">Users</div>
        <div class="stat-value">{{ users?.length ?? '—' }}</div>
        <div class="stat-sub">eden.proxy.users.get</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Posts</div>
        <div class="stat-value">{{ posts?.length ?? '—' }}</div>
        <div class="stat-sub">eden.proxy.posts.get</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">API Status</div>
        <div class="stat-value" style="display:flex;align-items:center;gap:10px;font-size:1.1rem;margin-top:4px;">
          <span class="status-dot" :class="apiOnline ? 'online' : 'offline'" />
          <span style="font-size:1rem;font-weight:700;">{{ apiOnline ? 'Online' : 'Offline' }}</span>
        </div>
        <div class="stat-sub">localhost:3000</div>
      </div>
    </div>

    <!-- SSR Hydration callout -->
    <div class="glass section" style="padding:1rem 1.5rem;display:flex;align-items:center;gap:1rem;border-color:rgba(52,211,153,0.12);background:rgba(52,211,153,0.02);">
      <div style="width:32px;height:32px;border-radius:8px;background:rgba(52,211,153,0.1);border:1px solid rgba(52,211,153,0.2);display:flex;align-items:center;justify-content:center;font-size:0.85rem;flex-shrink:0;">🌍</div>
      <div>
        <div style="font-size:0.8rem;font-weight:600;color:#f1f5f9;">SSR hydration — zero flicker</div>
        <div style="font-size:0.72rem;color:rgba(255,255,255,0.35);margin-top:2px;">
          The Nuxt plugin dehydrates the query cache on the server and hydrates it on the client. Data is never double-fetched.
          <code style="color:rgba(52,211,153,0.65);font-family:'JetBrains Mono',monospace;">staleTime: 5000ms</code> prevents immediate refetch after hydration.
        </div>
      </div>
      <span class="badge-green" style="flex-shrink:0;">No double-fetch</span>
    </div>

    <!-- Feature cards -->
    <div class="grid-3 section">
      <div class="feature-card">
        <div class="feature-icon feature-icon--purple">🔑</div>
        <div class="feature-name">Auto Query Keys</div>
        <div class="feature-desc">
          Keys derived from route structure. <code style="font-family:'JetBrains Mono',monospace;color:rgba(167,139,250,0.7);">eden.proxy.users.get</code> → <code style="font-family:'JetBrains Mono',monospace;color:rgba(167,139,250,0.7);">[Symbol, "users", "get"]</code>
        </div>
      </div>
      <div class="feature-card">
        <div class="feature-icon feature-icon--green">🔄</div>
        <div class="feature-name">Smart Invalidation</div>
        <div class="feature-desc">
          <code style="font-family:'JetBrains Mono',monospace;color:rgba(52,211,153,0.7);">users.post</code> mutation auto-invalidates all <code style="font-family:'JetBrains Mono',monospace;color:rgba(52,211,153,0.7);">users.*</code> queries. No manual cache keys.
        </div>
      </div>
      <div class="feature-card">
        <div class="feature-icon feature-icon--amber">🛡️</div>
        <div class="feature-name">End-to-end Types</div>
        <div class="feature-desc">
          Type inference flows from the Elysia server definition through Eden to the Vue Query composables. Zero <code style="font-family:'JetBrains Mono',monospace;color:rgba(251,191,36,0.7);">any</code>.
        </div>
      </div>
    </div>

    <!-- Code example -->
    <div class="card section">
      <div class="card-title">
        <span>📄</span>
        Usage pattern — fully typed, zero boilerplate
      </div>
      <div class="code-block"><span class="cm">// composables/eden.ts</span>
<span class="kw">import</span> { treaty } <span class="kw">from</span> <span class="str">'@elysiajs/eden'</span>
<span class="kw">import</span> { createEdenQueryHelpers } <span class="kw">from</span> <span class="str">'@elysia-vue-query/vue'</span>
<span class="kw">import type</span> { App } <span class="kw">from</span> <span class="str">'@playground/api'</span>

<span class="kw">const</span> client = treaty<span class="op">&lt;</span>App<span class="op">&gt;</span>(<span class="str">'http://localhost:3000'</span>)
<span class="kw">export const</span> eden = <span class="fn">createEdenQueryHelpers</span>(client)

<span class="cm">// In your component — fully typed, auto-invalidating</span>
<span class="kw">const</span> { <span class="prop">data</span>: users } = eden.<span class="fn">useQuery</span>(eden.proxy.users.get)
<span class="kw">const</span> mutation = eden.<span class="fn">useMutation</span>(eden.proxy.users.post)

<span class="cm">// Create → users.get auto-refetches ✨</span>
mutation.<span class="fn">mutate</span>({ <span class="prop">name</span>: <span class="str">'Alice'</span>, <span class="prop">email</span>: <span class="str">'alice@example.com'</span> })</div>
    </div>

    <!-- Live data preview -->
    <div class="grid-2 section">
      <div class="card">
        <div class="card-title"><span>👤</span> Latest Users</div>
        <div v-if="usersStatus === 'pending'" class="loading"><div class="spinner" />Loading…</div>
        <div v-else-if="usersStatus === 'error'" class="error-box">Failed to fetch users</div>
        <div v-else class="row-list">
          <div v-for="user in users?.slice(-3).reverse()" :key="user.id" class="row-item">
            <div class="avatar">{{ user.name.charAt(0) }}</div>
            <div class="row-info">
              <div class="row-name">{{ user.name }}</div>
              <div class="row-meta">{{ user.email }}</div>
            </div>
            <span class="row-badge badge-id">#{{ user.id }}</span>
          </div>
          <div v-if="!users?.length" class="empty"><div class="empty-text">No users yet</div></div>
        </div>
      </div>

      <div class="card">
        <div class="card-title"><span>📝</span> Latest Posts</div>
        <div v-if="postsStatus === 'pending'" class="loading"><div class="spinner" style="border-top-color:#a78bfa;border-color:rgba(167,139,250,0.18);" />Loading…</div>
        <div v-else-if="postsStatus === 'error'" class="error-box">Failed to fetch posts</div>
        <div v-else class="row-list">
          <div v-for="post in posts?.slice(-3).reverse()" :key="post.id" class="row-item">
            <div class="row-info">
              <div class="row-name">{{ post.title }}</div>
              <div class="row-meta" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{ post.body }}</div>
            </div>
            <span class="post-author-badge">user:{{ post.userId }}</span>
          </div>
          <div v-if="!posts?.length" class="empty"><div class="empty-text">No posts yet</div></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { eden } from '~/composables/eden'

const { data: users, status: usersStatus } = eden.useQuery(eden.proxy.users.get)
const { data: posts, status: postsStatus } = eden.useQuery(eden.proxy.posts.get)

const apiOnline = computed(() => usersStatus.value !== 'error' && postsStatus.value !== 'error')
</script>
