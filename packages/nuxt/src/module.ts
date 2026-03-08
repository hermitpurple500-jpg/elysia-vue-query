import { defineNuxtModule, addPlugin, addImports, createResolver } from "@nuxt/kit";

export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "@elysia-vue-query/nuxt",
    configKey: "elysiaVueQuery",
    compatibility: {
      nuxt: ">=3.0.0",
    },
  },
  defaults: {},
  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url);

    addImports({
      name: "createEdenQueryHelpers",
      from: "@elysia-vue-query/vue",
    });

    addPlugin(resolver.resolve("./runtime/plugin"));
  },
});
