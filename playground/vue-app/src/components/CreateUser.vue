<script setup lang="ts">
import { ref } from 'vue'
import { eden } from '../lib/eden'

const name = ref('')
const email = ref('')

const mutation = eden.useMutation(eden.proxy.users.post)

function submit() {
  if (!name.value.trim() || !email.value.trim()) return

  mutation.mutate(
    { name: name.value.trim(), email: email.value.trim() },
    {
      onSuccess: () => {
        name.value = ''
        email.value = ''
      },
    },
  )
}
</script>

<template>
  <form class="form" @submit.prevent="submit">
    <div class="fields">
      <input
        v-model="name"
        type="text"
        placeholder="Name"
        class="input"
        :disabled="mutation.isPending.value"
      />
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="input"
        :disabled="mutation.isPending.value"
      />
    </div>
    <button type="submit" class="submit" :disabled="mutation.isPending.value">
      {{ mutation.isPending.value ? 'Adding…' : 'Add user' }}
    </button>
    <p v-if="mutation.isError.value" class="err">
      {{ mutation.error.value?.message ?? 'Request failed' }}
    </p>
  </form>
</template>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.fields {
  display: flex;
  gap: 0.4rem;
}

.input {
  flex: 1;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 0.5rem 0.65rem;
  color: var(--text);
  font-size: 0.82rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.15s;
  min-width: 0;
}

.input::placeholder {
  color: var(--text-3);
}

.input:focus {
  border-color: var(--green);
}

.input:disabled {
  opacity: 0.4;
}

.submit {
  background: var(--green);
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 0.8rem;
  font-size: 0.82rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s;
}

.submit:hover:not(:disabled) {
  background: #369a6e;
}

.submit:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.err {
  color: var(--error);
  font-size: 0.78rem;
}
</style>
