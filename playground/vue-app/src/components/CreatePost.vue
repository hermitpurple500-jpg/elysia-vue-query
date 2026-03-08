<script setup lang="ts">
import { ref } from 'vue'
import { eden } from '../lib/eden'

const title = ref('')
const body = ref('')
const userId = ref(0)
const showSuccess = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

const { data: users } = eden.useQuery(eden.proxy.users.get)
const mutation = eden.useMutation(eden.proxy.posts.post)

function submit() {
  if (!title.value.trim() || !body.value.trim() || !userId.value) return
  mutation.mutate(
    { title: title.value.trim(), body: body.value.trim(), userId: userId.value },
    {
      onSuccess: () => {
        title.value = ''
        body.value = ''
        userId.value = 0
        showSuccess.value = true
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => { showSuccess.value = false }, 2500)
      },
    },
  )
}
</script>

<template>
  <form @submit.prevent="submit" style="margin-bottom:1rem;">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin-bottom:0.5rem;">
      <div>
        <label class="form-label">Title</label>
        <input v-model="title" class="form-input" type="text" placeholder="My Post" required :disabled="mutation.isPending.value" />
      </div>
      <div>
        <label class="form-label">Author</label>
        <select v-model.number="userId" class="form-input" required :disabled="mutation.isPending.value">
          <option :value="0" disabled>Select author…</option>
          <option v-for="user in users" :key="user.id" :value="user.id">{{ user.name }}</option>
        </select>
      </div>
    </div>
    <div style="margin-bottom:0.5rem;">
      <label class="form-label">Body</label>
      <textarea v-model="body" class="form-input" rows="2" placeholder="Write something…" required :disabled="mutation.isPending.value" style="resize:vertical;" />
    </div>
    <div style="display:flex;align-items:center;gap:0.75rem;">
      <button type="submit" class="btn-primary" :disabled="mutation.isPending.value || !userId" style="background:linear-gradient(135deg,#7c3aed,#6d28d9);box-shadow:0 0 20px rgba(124,58,237,0.25);">
        <span v-if="mutation.isPending.value" style="display:flex;align-items:center;gap:6px;">
          <span class="spinner" style="border-top-color:#a78bfa;border-color:rgba(167,139,250,0.2);" />Publishing…
        </span>
        <span v-else>Publish post</span>
      </button>
      <Transition name="pop">
        <span v-if="showSuccess" style="font-size:0.75rem;color:#a78bfa;display:flex;align-items:center;gap:4px;">
          <span>✓</span> Published — list refreshed
        </span>
      </Transition>
    </div>
    <p v-if="mutation.isError.value" style="font-size:0.75rem;color:#f87171;margin-top:0.4rem;">
      {{ mutation.error.value?.message ?? 'Request failed' }}
    </p>
  </form>
</template>

<style scoped>
.pop-enter-active { transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1); }
.pop-leave-active { transition: all 0.15s ease; }
.pop-enter-from { opacity:0; transform:translateY(4px) scale(0.95); }
.pop-leave-to { opacity:0; }
</style>
