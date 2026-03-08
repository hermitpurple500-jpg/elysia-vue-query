import { treaty } from "@elysiajs/eden";
import { createEdenQueryHelpers } from "@elysia-vue-query/vue";
import type { App } from "@playground/api";

const client = treaty<App>("http://localhost:3000");
export const eden = createEdenQueryHelpers(client);
