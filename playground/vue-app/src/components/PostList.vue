<script setup lang="ts">
import { eden } from "../lib/eden";

const { data: posts, status, error } = eden.useQuery(eden.proxy.posts.get);
const { data: users } = eden.useQuery(eden.proxy.users.get);
const deletePost = eden.useMutation(eden.proxy.posts[":id"].delete);

function removePost(id: number) {
  deletePost.mutate({ params: { id: id.toString() } });
}

function getAuthor(userId: number): string {
  const user = users.value?.find((u) => u.id === userId);
  return user ? user.name : `user #${userId}`;
}
</script>

<template>
  <div>
    <div
      v-if="status === 'pending'"
      style="
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.03);
        font-size: 0.8rem;
        color: rgba(255, 255, 255, 0.4);
      "
    >
      <span
        class="spinner"
        style="border-top-color: #a78bfa; border-color: rgba(167, 139, 250, 0.2)"
      />
      Fetching posts…
    </div>

    <div
      v-else-if="status === 'error'"
      style="
        padding: 0.75rem;
        border-radius: 8px;
        background: rgba(248, 113, 113, 0.08);
        border: 1px solid rgba(248, 113, 113, 0.15);
        font-size: 0.8rem;
        color: #f87171;
      "
    >
      {{ error?.message ?? "Failed to fetch" }}
    </div>

    <template v-else-if="posts && posts.length > 0">
      <div style="display: flex; flex-direction: column; gap: 0.5rem">
        <div
          v-for="post in posts"
          :key="post.id"
          style="
            padding: 0.75rem;
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.025);
            border: 1px solid rgba(255, 255, 255, 0.05);
            transition: border-color 0.15s;
          "
          class="post-card"
        >
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              gap: 0.5rem;
              margin-bottom: 0.35rem;
            "
          >
            <div style="font-size: 0.82rem; font-weight: 600; color: #f1f5f9; line-height: 1.3">
              {{ post.title }}
            </div>
            <button
              class="btn-danger"
              @click="removePost(post.id)"
              :disabled="
                deletePost.isPending.value &&
                deletePost.variables.value?.params.id === post.id.toString()
              "
              style="flex-shrink: 0"
              title="Delete"
            >
              ×
            </button>
          </div>
          <p
            style="
              font-size: 0.75rem;
              color: rgba(255, 255, 255, 0.35);
              line-height: 1.5;
              margin-bottom: 0.5rem;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
            "
          >
            {{ post.body }}
          </p>
          <div style="display: flex; gap: 4px">
            <span
              style="
                font-size: 0.65rem;
                font-weight: 500;
                padding: 0.15rem 0.45rem;
                border-radius: 4px;
                background: rgba(167, 139, 250, 0.1);
                color: rgba(167, 139, 250, 0.8);
                border: 1px solid rgba(167, 139, 250, 0.15);
              "
              >{{ getAuthor(post.userId) }}</span
            >
            <code
              style="
                font-size: 0.63rem;
                color: rgba(255, 255, 255, 0.2);
                font-family: &quot;JetBrains Mono&quot;, monospace;
                padding: 0.15rem 0.35rem;
                background: rgba(255, 255, 255, 0.04);
                border-radius: 3px;
              "
              >#{{ post.id }}</code
            >
          </div>
        </div>
      </div>
    </template>

    <p
      v-else
      style="
        font-size: 0.8rem;
        color: rgba(255, 255, 255, 0.2);
        text-align: center;
        padding: 1.5rem 0;
      "
    >
      No posts yet — write the first one.
    </p>
  </div>
</template>

<style scoped>
.post-card:hover {
  border-color: rgba(255, 255, 255, 0.09);
}
</style>
