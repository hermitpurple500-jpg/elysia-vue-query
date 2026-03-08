import { defineNuxtPlugin, useState } from "#app";
import { VueQueryPlugin, QueryClient, dehydrate, hydrate } from "@tanstack/vue-query";
import type { DehydratedState } from "@tanstack/vue-query";

const PAYLOAD_KEY = "vue-query";

export default defineNuxtPlugin((nuxtApp) => {
  const vueQueryState = useState<DehydratedState | null>(PAYLOAD_KEY);
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5000,
      },
    },
  });

  nuxtApp.vueApp.use(VueQueryPlugin, { queryClient });

  if (import.meta.server) {
    nuxtApp.hooks.hook("app:rendered", () => {
      vueQueryState.value = dehydrate(queryClient);
    });
  } else if (import.meta.client) {
    if (vueQueryState.value) {
      hydrate(queryClient, vueQueryState.value);
    }
  }
});
