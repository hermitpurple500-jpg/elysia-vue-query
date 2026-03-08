<script setup lang="ts">
import { ref } from "vue";
import { eden } from "../lib/eden";

const name = ref("");
const email = ref("");
const showSuccess = ref(false);
let timer: ReturnType<typeof setTimeout> | null = null;

const mutation = eden.useMutation(eden.proxy.users.post);

function submit() {
  if (!name.value.trim() || !email.value.trim()) return;
  mutation.mutate(
    { name: name.value.trim(), email: email.value.trim() },
    {
      onSuccess: () => {
        name.value = "";
        email.value = "";
        showSuccess.value = true;
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          showSuccess.value = false;
        }, 2500);
      },
    },
  );
}
</script>

<template>
  <form @submit.prevent="submit" style="margin-bottom: 1rem">
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 0.5rem">
      <div>
        <label class="form-label">Name</label>
        <input
          v-model="name"
          class="form-input"
          type="text"
          placeholder="Jane Doe"
          required
          :disabled="mutation.isPending.value"
        />
      </div>
      <div>
        <label class="form-label">Email</label>
        <input
          v-model="email"
          class="form-input"
          type="email"
          placeholder="jane@example.com"
          required
          :disabled="mutation.isPending.value"
        />
      </div>
    </div>
    <div style="display: flex; align-items: center; gap: 0.75rem">
      <button type="submit" class="btn-primary" :disabled="mutation.isPending.value">
        <span v-if="mutation.isPending.value" style="display: flex; align-items: center; gap: 6px">
          <span class="spinner" />Adding…
        </span>
        <span v-else>Add user</span>
      </button>
      <Transition name="pop">
        <span
          v-if="showSuccess"
          style="font-size: 0.75rem; color: #34d399; display: flex; align-items: center; gap: 4px"
        >
          <span>✓</span> Created — list refreshed
        </span>
      </Transition>
    </div>
    <p v-if="mutation.isError.value" style="font-size: 0.75rem; color: #f87171; margin-top: 0.4rem">
      {{ mutation.error.value?.message ?? "Request failed" }}
    </p>
  </form>
</template>

<style scoped>
.pop-enter-active {
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.pop-leave-active {
  transition: all 0.15s ease;
}
.pop-enter-from {
  opacity: 0;
  transform: translateY(4px) scale(0.95);
}
.pop-leave-to {
  opacity: 0;
}
</style>
