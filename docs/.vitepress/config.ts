import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'elysia-vue-query',
  description: 'Type-safe integration between Elysia Eden Treaty and TanStack Vue Query',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#42b883' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'elysia-vue-query' }],
    ['meta', { property: 'og:description', content: 'Type-safe Eden Treaty + TanStack Vue Query — zero-config query keys, automatic cache invalidation.' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap', rel: 'stylesheet' }],
  ],

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'elysia-vue-query',

    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API', link: '/api/core' },
      {
        text: 'Ecosystem',
        items: [
          { text: 'Elysia', link: 'https://elysiajs.com' },
          { text: 'Eden Treaty', link: 'https://elysiajs.com/eden/treaty/overview' },
          { text: 'TanStack Vue Query', link: 'https://tanstack.com/query/latest/docs/vue/overview' },
          { text: 'Vue.js', link: 'https://vuejs.org' },
        ],
      },
      { text: 'Playground', link: '/playground' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Why elysia-vue-query?', link: '/guide/why' },
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Installation', link: '/guide/installation' },
          ],
        },
        {
          text: 'Core Concepts',
          items: [
            { text: 'Query Keys', link: '/guide/query-keys' },
            { text: 'Queries', link: '/guide/queries' },
            { text: 'Mutations', link: '/guide/mutations' },
            { text: 'Cache Invalidation', link: '/guide/cache-invalidation' },
            { text: 'SSR & Prefetching', link: '/guide/ssr' },
          ],
        },
        {
          text: 'Advanced',
          items: [
            { text: 'Serialization', link: '/guide/serialization' },
            { text: 'Custom Key Patterns', link: '/guide/custom-keys' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Core', link: '/api/core' },
            { text: 'Vue Helpers', link: '/api/vue' },
            { text: 'Types', link: '/api/types' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/elysia-vue-query/elysia-vue-query' },
    ],

    editLink: {
      pattern: 'https://github.com/elysia-vue-query/elysia-vue-query/edit/main/docs/:path',
      text: 'Suggest changes to this page',
    },

    search: {
      provider: 'local',
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Made by Saku Shiina',
    },
  },
})
