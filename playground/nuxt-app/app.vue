<template>
  <div class="app-shell" style="min-height:100vh;background:#030712;">
    <!-- Ambient blobs -->
    <div style="position:fixed;inset:0;pointer-events:none;overflow:hidden;z-index:0;">
      <div style="position:absolute;top:-200px;left:-100px;width:500px;height:500px;background:radial-gradient(circle,rgba(52,211,153,0.055) 0%,transparent 70%);border-radius:50%;filter:blur(50px);" />
      <div style="position:absolute;bottom:-200px;right:-100px;width:500px;height:500px;background:radial-gradient(circle,rgba(167,139,250,0.055) 0%,transparent 70%);border-radius:50%;filter:blur(50px);" />
    </div>

    <!-- Sidebar -->
    <aside class="sidebar" style="z-index:10;">
      <div class="sidebar-brand">
        <img src="/logo.svg" alt="elysia-vue-query" style="height:26px;width:auto;" />
        <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;">
          <span class="badge-green" style="font-size:0.6rem;">SSR ✓</span>
          <span class="badge-amber" style="font-size:0.6rem;">Playground</span>
        </div>
      </div>

      <nav style="flex:1;">
        <NuxtLink to="/" class="sidebar-nav-item" :class="{ active: route.path === '/' }">
          <span>⚡</span>
          <span>Overview</span>
        </NuxtLink>
        <NuxtLink to="/users" class="sidebar-nav-item" :class="{ active: route.path === '/users' }">
          <span>👤</span>
          <span>Users</span>
          <span v-if="usersCount !== null" class="sidebar-badge">{{ usersCount }}</span>
        </NuxtLink>
        <NuxtLink to="/posts" class="sidebar-nav-item" :class="{ active: route.path === '/posts' }">
          <span>📝</span>
          <span>Posts</span>
          <span v-if="postsCount !== null" class="sidebar-badge">{{ postsCount }}</span>
        </NuxtLink>
      </nav>

      <div style="padding:1rem 1.25rem;border-top:1px solid rgba(255,255,255,0.06);">
        <div style="font-size:0.68rem;color:rgba(255,255,255,0.2);line-height:1.6;">
          <div style="font-weight:600;color:rgba(255,255,255,0.3);margin-bottom:0.25rem;">elysia-vue-query</div>
          Eden Treaty + TanStack Query v5<br />
          SSR dehydration via Nuxt plugin
        </div>
      </div>
    </aside>

    <!-- Main -->
    <main class="main-content" style="position:relative;z-index:1;">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { eden } from '~/composables/eden'

const route = useRoute()

const { data: users } = eden.useQuery(eden.proxy.users.get)
const { data: posts } = eden.useQuery(eden.proxy.posts.get)

const usersCount = computed(() => users.value?.length ?? null)
const postsCount = computed(() => posts.value?.length ?? null)
</script>
