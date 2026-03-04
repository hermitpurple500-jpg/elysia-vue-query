<script setup lang="ts">
import UserList from './components/UserList.vue'
import CreateUser from './components/CreateUser.vue'
import PostList from './components/PostList.vue'
</script>

<template>
  <div class="app">
    <header>
      <div class="header-inner">
        <h1>elysia-vue-query</h1>
        <p class="tagline">playground</p>
      </div>
      <div class="pills">
        <span class="pill green">Eden Treaty</span>
        <span class="pill warm">Vue Query</span>
      </div>
    </header>

    <main>
      <div class="grid">
        <section class="panel">
          <div class="panel-head">
            <h2>Users</h2>
            <span class="badge">useQuery + useMutation</span>
          </div>
          <CreateUser />
          <UserList />
        </section>

        <section class="panel">
          <div class="panel-head">
            <h2>Posts</h2>
            <span class="badge">useQuery</span>
          </div>
          <PostList />
        </section>
      </div>
    </main>

    <footer>
      <span>API at <code>localhost:3000</code></span>
      <span class="sep">&middot;</span>
      <span>by Saku Shiina</span>
    </footer>
  </div>
</template>

<style>
:root {
  --bg: #0f1114;
  --surface: #16181d;
  --surface-2: #1e2027;
  --surface-3: #262830;
  --border: #2e3038;
  --border-hover: #3a3d47;
  --text: #e1e3e8;
  --text-2: #9ca0ab;
  --text-3: #686d78;
  --green: #42b883;
  --green-soft: rgba(66, 184, 131, 0.1);
  --green-border: rgba(66, 184, 131, 0.2);
  --warm: #ff6b4a;
  --warm-soft: rgba(255, 107, 74, 0.1);
  --warm-border: rgba(255, 107, 74, 0.2);
  --error: #ef4444;
  --error-soft: rgba(239, 68, 68, 0.08);
  --radius: 10px;
}

.app {
  max-width: 880px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 3rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border);
}

.header-inner {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
}

h1 {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.02em;
}

.tagline {
  font-size: 0.8rem;
  color: var(--text-3);
  font-weight: 500;
}

.pills {
  display: flex;
  gap: 0.4rem;
}

.pill {
  font-size: 0.7rem;
  font-weight: 500;
  padding: 0.25rem 0.6rem;
  border-radius: 100px;
  letter-spacing: 0.01em;
}

.pill.green {
  background: var(--green-soft);
  color: var(--green);
  border: 1px solid var(--green-border);
}

.pill.warm {
  background: var(--warm-soft);
  color: var(--warm);
  border: 1px solid var(--warm-border);
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  flex: 1;
}

@media (max-width: 700px) {
  .grid { grid-template-columns: 1fr; }
  header { flex-direction: column; gap: 0.75rem; align-items: flex-start; }
}

.panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.25rem;
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border);
}

.panel-head h2 {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text);
  letter-spacing: -0.01em;
}

.badge {
  font-size: 0.65rem;
  font-weight: 500;
  color: var(--text-3);
  background: var(--surface-2);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
}

footer {
  margin-top: 2rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: var(--text-3);
  font-size: 0.78rem;
}

footer code {
  font-size: 0.75rem;
  color: var(--text-2);
}

.sep {
  opacity: 0.4;
}
</style>
