import { defineConfig } from "vitepress";
import { transformerTwoslash } from "@shikijs/vitepress-twoslash";
import { createFileSystemTypesCache } from "@shikijs/vitepress-twoslash/cache-fs";
import tailwindcss from "@tailwindcss/vite";
import { groupIconMdPlugin, groupIconVitePlugin } from "vitepress-plugin-group-icons";

export default defineConfig({
  lang: "en-US",
  title: "Elysia Vue Query",
  description:
    "Deterministic, type-safe TanStack Query transport layer for ElysiaJS Eden Treaty. Built for Vue 3 and Nuxt.",
  cleanUrls: true,
  srcExclude: ["components/**"],
  sitemap: {
    hostname: "https://elysia-vue.pages.dev",
  },

  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: "/logo_v.svg" }],
    ["meta", { name: "theme-color", content: "#f06292" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:title", content: "Elysia Vue Query" }],
    [
      "meta",
      {
        property: "og:description",
        content:
          "Deterministic, type-safe TanStack Query transport layer for ElysiaJS Eden Treaty. Built for Vue 3 and Nuxt.",
      },
    ],
    ["meta", { property: "og:url", content: "https://elysia-vue.pages.dev" }],
    ["meta", { name: "twitter:card", content: "summary" }],
    ["meta", { name: "twitter:title", content: "Elysia Vue Query" }],
    [
      "meta",
      {
        name: "twitter:description",
        content:
          "Deterministic, type-safe TanStack Query transport layer for ElysiaJS Eden Treaty.",
      },
    ],
  ],

  lastUpdated: true,

  vite: {
    plugins: [tailwindcss(), groupIconVitePlugin()],
  },

  markdown: {
    config(md) {
      md.use(groupIconMdPlugin, {
        titleBar: {
          includeSnippet: true,
        },
      });
    },
    theme: {
      light: "vitesse-light",
      dark: "vitesse-dark",
    },
    codeTransformers: [
      transformerTwoslash({
        typesCache: createFileSystemTypesCache(),
      }),
    ],
  },

  themeConfig: {
    logo: { src: "/logo_v.svg", alt: "Elysia Vue Query" },

    nav: [
      { text: "Guide", link: "/guide/getting-started", activeMatch: "/guide/" },
      { text: "Playground", link: "/playground" },
      { text: "API", link: "/api/vue", activeMatch: "/api/" },
    ],

    sidebar: {
      "/guide/": [
        {
          text: "Start Here",
          items: [
            { text: "Why Elysia Vue Query?", link: "/guide/why" },
            { text: "Installation", link: "/guide/installation" },
            { text: "Getting Started", link: "/guide/getting-started" },
          ],
        },
        {
          text: "Core Workflow",
          items: [
            { text: "Queries", link: "/guide/queries" },
            { text: "Mutations", link: "/guide/mutations" },
            { text: "Query Keys", link: "/guide/query-keys" },
          ],
        },
        {
          text: "Advanced",
          items: [
            { text: "Cache Invalidation", link: "/guide/cache-invalidation" },
            { text: "Custom Key Patterns", link: "/guide/custom-keys" },
            { text: "Serialization", link: "/guide/serialization" },
          ],
        },
        {
          text: "SSR",
          items: [
            { text: "SSR & Prefetching", link: "/guide/ssr" },
            { text: "Nuxt Module", link: "/guide/nuxt-ssr" },
          ],
        },
        {
          text: "Examples",
          items: [{ text: "Playground", link: "/playground" }],
        },
      ],
      "/api/": [
        {
          text: "API Reference",
          items: [
            { text: "Vue Helpers", link: "/api/vue" },
            { text: "Core", link: "/api/core" },
            { text: "Types", link: "/api/types" },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/elysia-vue-query/elysia-vue-query" },
      { icon: "npm", link: "https://npmx.dev/org/elysia-vue-query" },
    ],

    search: {
      provider: "local",
    },

    editLink: {
      pattern: "https://github.com/elysia-vue-query/elysia-vue-query/edit/main/docs/:path",
      text: "Suggest changes to this page",
    },

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2026 Saku Shiina",
    },

    outline: {
      level: [2, 3],
      label: "On this page",
    },
  },
});
