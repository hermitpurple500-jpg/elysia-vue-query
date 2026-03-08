<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">Posts</h1>
      <p class="page-desc">
        Create and browse posts. Cache invalidation means publishing a post
        immediately updates the list — no manual <code style="font-family:'JetBrains Mono',monospace;color:rgba(167,139,250,0.65);">invalidateQueries</code> call needed.
      </p>
    </div>

    <!-- Create Post Form -->
    <div class="card section">
      <div class="card-title">
        <span>✏️</span>
        New Post
        <span class="tag tag--mutation" style="margin-left:auto;">useMutation</span>
      </div>
      <form class="create-form" @submit.prevent="handleCreate">
        <div class="form-row" style="margin-bottom:0.75rem;">
          <div class="form-group">
            <label class="form-label">Title</label>
            <input v-model="title" class="form-input" type="text" placeholder="My Awesome Post" required :disabled="createMutation.isPending.value" />
          </div>
          <div class="form-group">
            <label class="form-label">Author</label>
            <select v-model.number="userId" class="form-input" required :disabled="createMutation.isPending.value">
              <option :value="0" disabled>Select a user…</option>
              <option v-for="user in usersList" :key="user.id" :value="user.id">
                {{ user.name }} (#{{ user.id }})
              </option>
            </select>
          </div>
        </div>
        <div class="form-group" style="margin-bottom:0.875rem;">
          <label class="form-label">Body</label>
          <textarea v-model="body" class="form-input" rows="3" placeholder="Write something…" required :disabled="createMutation.isPending.value" style="resize:vertical;" />
        </div>
        <div style="display:flex;align-items:center;gap:0.875rem;">
          <button type="submit" class="btn-primary" :disabled="createMutation.isPending.value || !userId" style="background:linear-gradient(135deg,#7c3aed,#6d28d9);box-shadow:0 0 20px rgba(124,58,237,0.2);">
            <span v-if="createMutation.isPending.value" style="display:flex;align-items:center;gap:6px;">
              <span class="spinner" style="border-top-color:#a78bfa;border-color:rgba(167,139,250,0.2);" />Publishing…
            </span>
            <span v-else>Publish Post</span>
          </button>
          <Transition name="fade">
            <span v-if="showSuccess" style="font-size:0.77rem;color:#a78bfa;display:flex;align-items:center;gap:5px;">
              ✓ Published — list refreshed!
            </span>
          </Transition>
        </div>
        <p v-if="createMutation.isError.value" style="font-size:0.75rem;color:#f87171;margin-top:0.5rem;">
          {{ createMutation.error.value?.message ?? 'Request failed' }}
        </p>
      </form>
    </div>

    <!-- Posts Grid -->
    <div class="section">
      <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:1rem;">
        <span style="font-size:0.82rem;font-weight:600;color:rgba(255,255,255,0.6);">📝 All Posts</span>
        <span class="tag tag--query">useQuery</span>
      </div>

      <div v-if="postsStatus === 'pending'" class="loading"><div class="spinner" style="border-top-color:#a78bfa;border-color:rgba(167,139,250,0.2);" />Fetching posts…</div>
      <div v-else-if="postsStatus === 'error'" class="error-box">Failed to load posts</div>
      <div v-else-if="posts && posts.length > 0" class="posts-grid">
        <div v-for="post in posts" :key="post.id" class="post-card">
          <div class="post-title">{{ post.title }}</div>
          <p class="post-body">{{ post.body }}</p>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:auto;">
            <div style="display:flex;gap:4px;">
              <span class="post-author-badge">{{ getUserName(post.userId) }}</span>
              <span class="row-badge badge-id">post #{{ post.id }}</span>
            </div>
            <button
              class="btn-danger"
              @click="handleDelete(post.id)"
              :disabled="deleteMutation.isPending.value && deleteMutation.variables.value?.params.id === post.id.toString()"
            >Delete</button>
          </div>
        </div>
      </div>
      <div v-else class="empty">
        <div class="empty-text">No posts yet — write the first one!</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { eden } from '~/composables/eden'

const title = ref('')
const body = ref('')
const userId = ref(0)
const showSuccess = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

const { data: posts, status: postsStatus } = eden.useQuery(eden.proxy.posts.get)
const { data: usersList } = eden.useQuery(eden.proxy.users.get)
const createMutation = eden.useMutation(eden.proxy.posts.post)
const deleteMutation = eden.useMutation(eden.proxy.posts[':id'].delete)

function getUserName(id: number): string {
  const user = usersList.value?.find((u: any) => u.id === id)
  return user ? user.name : `user:${id}`
}

function handleCreate() {
  if (!title.value.trim() || !body.value.trim() || !userId.value) return
  createMutation.mutate(
    { title: title.value.trim(), body: body.value.trim(), userId: userId.value },
    {
      onSuccess: () => {
        title.value = ''
        body.value = ''
        userId.value = 0
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

<style scoped>
.posts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

@media (max-width: 700px) {
  .posts-grid { grid-template-columns: 1fr; }
}
</style>
