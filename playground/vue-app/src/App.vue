<script setup lang="ts">
import { computed } from "vue";
import { useIsFetching } from "@tanstack/vue-query";
import CreateUser from "./components/CreateUser.vue";
import UserList from "./components/UserList.vue";
import CreatePost from "./components/CreatePost.vue";
import PostList from "./components/PostList.vue";
import { eden } from "./lib/eden";

const { data: users, status: usersStatus } = eden.useQuery(eden.proxy.users.get);
const { data: posts, status: postsStatus } = eden.useQuery(eden.proxy.posts.get);

const isFetching = useIsFetching();
const isSyncing = computed(() => isFetching.value > 0);
const apiOnline = computed(() => usersStatus.value !== "error" && postsStatus.value !== "error");

const queryKeyDisplay = computed(() => {
  const key = eden.getKey(eden.proxy.users.get);
  return key
    .map((k) => (typeof k === "symbol" ? "Symbol(elysia-vue-query)" : JSON.stringify(k)))
    .join(" → ");
});
</script>

<template>
  <div
    style="
      min-height: 100vh;
      background: #030712;
      font-family: &quot;Inter&quot;, system-ui, sans-serif;
      color: #f1f5f9;
    "
  >
    <!-- Ambient background blobs -->
    <div style="position: fixed; inset: 0; pointer-events: none; overflow: hidden; z-index: 0">
      <div
        style="
          position: absolute;
          top: -160px;
          left: -160px;
          width: 480px;
          height: 480px;
          background: radial-gradient(circle, rgba(52, 211, 153, 0.07) 0%, transparent 70%);
          border-radius: 50%;
          filter: blur(40px);
        "
      />
      <div
        style="
          position: absolute;
          bottom: -120px;
          right: -120px;
          width: 440px;
          height: 440px;
          background: radial-gradient(circle, rgba(167, 139, 250, 0.07) 0%, transparent 70%);
          border-radius: 50%;
          filter: blur(40px);
        "
      />
      <div
        style="
          position: absolute;
          top: 40%;
          left: 40%;
          width: 360px;
          height: 360px;
          background: radial-gradient(circle, rgba(96, 165, 250, 0.04) 0%, transparent 70%);
          border-radius: 50%;
          filter: blur(60px);
        "
      />
    </div>

    <!-- Sticky header -->
    <header
      style="
        position: sticky;
        top: 0;
        z-index: 50;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        background: rgba(3, 7, 18, 0.85);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
      "
    >
      <div
        style="
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        "
      >
        <div style="display: flex; align-items: center; gap: 0.875rem">
          <img src="/logo.svg" alt="elysia-vue-query" style="height: 28px; width: auto" />
          <div style="width: 1px; height: 18px; background: rgba(255, 255, 255, 0.1)"></div>
          <span
            style="
              font-size: 0.65rem;
              font-weight: 700;
              letter-spacing: 0.12em;
              color: rgba(255, 255, 255, 0.3);
              text-transform: uppercase;
            "
            >Vue Playground</span
          >
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem">
          <Transition name="fade">
            <span
              v-if="isSyncing"
              style="
                display: flex;
                align-items: center;
                gap: 5px;
                font-size: 0.7rem;
                color: rgba(255, 255, 255, 0.35);
                margin-right: 4px;
              "
            >
              <span class="spinner" style="width: 11px; height: 11px; border-width: 1.5px" />
              syncing
            </span>
          </Transition>
          <span class="badge-green">Eden Treaty</span>
          <span class="badge-purple">@tanstack/vue-query v5</span>
        </div>
      </div>
    </header>

    <!-- Stats ribbon -->
    <div
      style="
        border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        background: rgba(255, 255, 255, 0.015);
      "
    >
      <div
        style="
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
          height: 44px;
          display: flex;
          align-items: center;
        "
      >
        <div class="stat-item">
          <span class="stat-val">{{ users?.length ?? "—" }}</span>
          <span class="stat-lbl">Users</span>
        </div>
        <div class="stat-sep-line"></div>
        <div class="stat-item">
          <span class="stat-val">{{ posts?.length ?? "—" }}</span>
          <span class="stat-lbl">Posts</span>
        </div>
        <div class="stat-sep-line"></div>
        <div class="stat-item">
          <span
            :style="`width:7px;height:7px;border-radius:50%;flex-shrink:0;background:${apiOnline ? '#34d399' : '#f87171'};box-shadow:0 0 8px ${apiOnline ? 'rgba(52,211,153,0.6)' : 'rgba(248,113,113,0.6)'};`"
          />
          <span class="stat-lbl">API {{ apiOnline ? "online" : "offline" }}</span>
        </div>
        <div class="stat-sep-line"></div>
        <div class="stat-item">
          <code
            style="
              font-size: 0.67rem;
              color: rgba(255, 255, 255, 0.28);
              font-family: &quot;JetBrains Mono&quot;, monospace;
            "
            >{{ queryKeyDisplay }}</code
          >
        </div>
      </div>
    </div>

    <!-- Main dashboard -->
    <main
      style="
        position: relative;
        z-index: 1;
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem 1.5rem 3rem;
      "
    >
      <div class="panel-grid">
        <!-- Users Panel -->
        <section class="glass" style="padding: 0; overflow: hidden">
          <div
            style="
              padding: 1.25rem 1.5rem;
              border-bottom: 1px solid rgba(255, 255, 255, 0.06);
              display: flex;
              align-items: center;
              justify-content: space-between;
            "
          >
            <div style="display: flex; align-items: center; gap: 0.85rem">
              <div
                style="
                  width: 34px;
                  height: 34px;
                  border-radius: 8px;
                  background: rgba(52, 211, 153, 0.1);
                  border: 1px solid rgba(52, 211, 153, 0.2);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 0.9rem;
                "
              >
                👤
              </div>
              <div>
                <div
                  style="
                    font-size: 0.88rem;
                    font-weight: 600;
                    color: #f1f5f9;
                    letter-spacing: -0.01em;
                  "
                >
                  Users
                </div>
                <div
                  style="
                    font-size: 0.68rem;
                    color: rgba(255, 255, 255, 0.3);
                    margin-top: 1px;
                    font-family: &quot;JetBrains Mono&quot;, monospace;
                  "
                >
                  useQuery · useMutation
                </div>
              </div>
            </div>
            <span
              v-if="users"
              style="
                font-size: 0.7rem;
                font-weight: 600;
                padding: 0.2rem 0.55rem;
                border-radius: 6px;
                background: rgba(52, 211, 153, 0.1);
                color: #34d399;
                border: 1px solid rgba(52, 211, 153, 0.15);
              "
              >{{ users.length }}</span
            >
          </div>
          <div style="padding: 1.25rem 1.5rem">
            <CreateUser />
            <UserList />
          </div>
        </section>

        <!-- Posts Panel -->
        <section class="glass" style="padding: 0; overflow: hidden">
          <div
            style="
              padding: 1.25rem 1.5rem;
              border-bottom: 1px solid rgba(255, 255, 255, 0.06);
              display: flex;
              align-items: center;
              justify-content: space-between;
            "
          >
            <div style="display: flex; align-items: center; gap: 0.85rem">
              <div
                style="
                  width: 34px;
                  height: 34px;
                  border-radius: 8px;
                  background: rgba(167, 139, 250, 0.1);
                  border: 1px solid rgba(167, 139, 250, 0.2);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 0.9rem;
                "
              >
                📝
              </div>
              <div>
                <div
                  style="
                    font-size: 0.88rem;
                    font-weight: 600;
                    color: #f1f5f9;
                    letter-spacing: -0.01em;
                  "
                >
                  Posts
                </div>
                <div
                  style="
                    font-size: 0.68rem;
                    color: rgba(255, 255, 255, 0.3);
                    margin-top: 1px;
                    font-family: &quot;JetBrains Mono&quot;, monospace;
                  "
                >
                  useQuery · useMutation
                </div>
              </div>
            </div>
            <span
              v-if="posts"
              style="
                font-size: 0.7rem;
                font-weight: 600;
                padding: 0.2rem 0.55rem;
                border-radius: 6px;
                background: rgba(167, 139, 250, 0.1);
                color: #a78bfa;
                border: 1px solid rgba(167, 139, 250, 0.15);
              "
              >{{ posts.length }}</span
            >
          </div>
          <div style="padding: 1.25rem 1.5rem">
            <CreatePost />
            <PostList />
          </div>
        </section>
      </div>

      <!-- Cache Invalidation Banner -->
      <div
        class="glass"
        style="
          margin-top: 1.5rem;
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          border-color: rgba(96, 165, 250, 0.12);
          background: rgba(96, 165, 250, 0.025);
        "
      >
        <div
          style="
            width: 32px;
            height: 32px;
            border-radius: 8px;
            background: rgba(96, 165, 250, 0.1);
            border: 1px solid rgba(96, 165, 250, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.85rem;
            flex-shrink: 0;
          "
        >
          ⚡
        </div>
        <div style="flex: 1; min-width: 0">
          <div style="font-size: 0.8rem; font-weight: 600; color: #f1f5f9">
            Zero-config cache invalidation
          </div>
          <div style="font-size: 0.72rem; color: rgba(255, 255, 255, 0.35); margin-top: 2px">
            Mutations auto-invalidate matching subtrees via route-hierarchy key matching.
            <code
              style="
                font-family: &quot;JetBrains Mono&quot;, monospace;
                color: rgba(96, 165, 250, 0.7);
              "
              >users.post</code
            >
            → invalidates
            <code
              style="
                font-family: &quot;JetBrains Mono&quot;, monospace;
                color: rgba(96, 165, 250, 0.7);
              "
              >[Symbol, "users"]</code
            >
            prefix
          </div>
        </div>
        <span class="badge-blue" style="flex-shrink: 0">auto-invalidate</span>
      </div>
    </main>

    <!-- Footer -->
    <footer
      style="
        position: relative;
        z-index: 1;
        border-top: 1px solid rgba(255, 255, 255, 0.05);
        padding: 1.25rem 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        color: rgba(255, 255, 255, 0.2);
        font-size: 0.75rem;
      "
    >
      <span style="font-weight: 500; color: rgba(255, 255, 255, 0.3)">elysia-vue-query</span>
      <span>·</span>
      <span>Eden Treaty + TanStack Query</span>
      <span>·</span>
      <code style="font-family: &quot;JetBrains Mono&quot;, monospace; font-size: 0.7rem"
        >localhost:3000</code
      >
    </footer>
  </div>
</template>

<style>
.panel-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0 1.25rem;
}

.stat-val {
  font-size: 0.85rem;
  font-weight: 700;
  color: #f1f5f9;
  font-variant-numeric: tabular-nums;
}

.stat-lbl {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.3);
}

.stat-sep-line {
  width: 1px;
  height: 20px;
  background: rgba(255, 255, 255, 0.07);
  flex-shrink: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .panel-grid {
    grid-template-columns: 1fr;
  }
}
</style>
