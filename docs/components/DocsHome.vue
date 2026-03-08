<script setup lang="ts">
import { ref } from 'vue'
import { 
  KeyRound, 
  RefreshCw, 
  Droplet, 
  Network, 
  Zap, 
  PackageSearch,
  Box,
  Layers,
  Server,
  Copy,
  Check
} from 'lucide-vue-next'

const copied = ref(false)

const copyCommand = async () => {
  try {
    await navigator.clipboard.writeText('bun add @elysia-vue-query/vue @tanstack/vue-query')
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy text: ', err)
  }
}
</script>

<template>
  <div class="relative min-h-screen font-sans">
    
    <div class="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
      <div class="absolute inset-0 bg-[linear-gradient(to_right,theme(colors.mauve.900/5%)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.mauve.900/5%)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_10%,transparent_100%)]"></div>
      
      <div class="absolute top-0 right-1/4 w-[50rem] h-[50rem] bg-pink-300/40 dark:bg-pink-500/15 rounded-full blur-[120px] dark:blur-[140px] transform -translate-y-1/2"></div>
      <div class="absolute top-1/3 left-1/4 w-[40rem] h-[40rem] bg-indigo-300/40 dark:bg-indigo-500/10 rounded-full blur-[100px] dark:blur-[120px] transform -translate-x-1/2"></div>
      <div class="absolute bottom-1/4 right-1/3 w-[30rem] h-[30rem] bg-purple-300/30 dark:bg-purple-500/8 rounded-full blur-[80px] dark:blur-[100px]"></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-32">

      <div class="text-center space-y-8 mb-28 relative">
        <div class="flex justify-center mb-8 relative group">
          <div class="absolute inset-0 bg-gradient-to-tr from-pink-500/20 to-indigo-500/20 rounded-full blur-[60px] dark:blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
          <img
            class="relative w-56 sm:w-72 md:w-88 h-auto transform group-hover:scale-105 transition duration-500 group-hover:-rotate-2 drop-shadow-[0_0_20px_rgba(236,72,153,0.15)] dark:drop-shadow-[0_0_40px_rgba(236,72,153,0.2)] animate-float"
            src="/logo_v.svg"
            alt="Elysia Vue Query"
          />
        </div>

        <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight text-mauve-900 dark:text-white">
          <span class="block">Typed server state for</span>
          <span class="block text-gradient animate-gradient-x from-pink-500 via-purple-500 to-indigo-500 dark:from-pink-400 dark:via-purple-400 dark:to-indigo-400">Vue and Nuxt.</span>
        </h1>

        <p class="max-w-2xl mx-auto text-xl text-mauve-600 dark:text-mauve-300 leading-relaxed font-light">
          Wrap your Eden Treaty client once. Get deterministic query keys, automatic cache invalidation, and SSR hydration — all fully typed end-to-end.
        </p>

        <div class="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6">
          <a
            class="clicky px-8 py-4 text-base font-semibold rounded-full text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 dark:from-pink-500/80 dark:to-purple-600/80 dark:hover:from-pink-500 dark:hover:to-purple-600 border border-transparent dark:border-pink-500/30 backdrop-blur-md shadow-lg shadow-pink-500/20 dark:shadow-none"
            href="/guide/getting-started"
          >
            Get Started
          </a>
          <a
            class="clicky px-8 py-4 text-base font-medium rounded-full text-mauve-700 dark:text-mauve-300 hover:text-mauve-900 dark:hover:text-white border border-mauve-200 dark:border-mauve-700 bg-white/50 dark:bg-mauve-800/30 hover:bg-white dark:hover:bg-mauve-800/60 backdrop-blur-md"
            href="/api/vue"
          >
            API Reference
          </a>
        </div>

        <div class="mt-10 max-w-xl mx-auto">
          <div class="rounded-xl overflow-hidden bg-white/60 dark:bg-mauve-900/60 border border-mauve-200 dark:border-mauve-700 backdrop-blur-xl flex items-center shadow-xl dark:shadow-2xl transition-transform duration-500 hover:scale-[1.02]">
            <div class="px-4 text-pink-500 font-mono text-sm select-none">❯</div>
            <code class="flex-1 text-left text-mauve-800 dark:text-mauve-200 font-mono text-sm py-4 tracking-wide">
              <span class="text-pink-600 dark:text-pink-400">bun</span> add @elysia-vue-query/vue @tanstack/vue-query
            </code>
            <button 
              @click="copyCommand" 
              class="px-4 py-4 text-mauve-400 hover:text-pink-500 transition-colors flex items-center justify-center border-l border-mauve-200 dark:border-mauve-700 bg-mauve-50/50 dark:bg-mauve-800/30 hover:bg-mauve-100 dark:hover:bg-mauve-800/80 active:bg-mauve-200 dark:active:bg-mauve-700"
              title="Copy command"
            >
              <Copy v-if="!copied" class="w-4 h-4" />
              <Check v-else class="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-28">

        <div class="group relative rounded-2xl border border-mauve-200 dark:border-mauve-700 bg-white/50 dark:bg-mauve-800/40 hover:bg-white/80 dark:hover:bg-mauve-800/60 transition-all duration-500 p-8 overflow-hidden backdrop-blur-sm hover:-translate-y-1 shadow-lg shadow-mauve-200/20 dark:shadow-2xl dark:shadow-pink-500/10">
          <div class="absolute top-0 right-0 p-3 opacity-[0.03] dark:opacity-5 group-hover:opacity-10 transition duration-500 transform group-hover:scale-125">
            <KeyRound class="w-24 h-24 text-pink-500 dark:text-pink-400" />
          </div>
          <h3 class="text-lg font-semibold text-mauve-900 dark:text-white mb-3 flex items-center gap-2.5">
            <KeyRound class="w-5 h-5 text-pink-500 dark:text-pink-400 shrink-0" />
            Auto Query Keys
          </h3>
          <p class="text-mauve-600 dark:text-mauve-400 leading-relaxed text-sm font-light">
            Stable, deterministic keys derived straight from your route structure. No string arrays, no typos, no missing invalidations.
          </p>
        </div>

        <div class="group relative rounded-2xl border border-mauve-200 dark:border-mauve-700 bg-white/50 dark:bg-mauve-800/40 hover:bg-white/80 dark:hover:bg-mauve-800/60 transition-all duration-500 p-8 overflow-hidden backdrop-blur-sm hover:-translate-y-1 shadow-lg shadow-mauve-200/20 dark:shadow-2xl dark:shadow-purple-500/10">
          <div class="absolute top-0 right-0 p-3 opacity-[0.03] dark:opacity-5 group-hover:opacity-10 transition duration-500 transform group-hover:-rotate-12 group-hover:scale-110">
            <RefreshCw class="w-24 h-24 text-purple-500 dark:text-purple-400" />
          </div>
          <h3 class="text-lg font-semibold text-mauve-900 dark:text-white mb-3 flex items-center gap-2.5">
            <RefreshCw class="w-5 h-5 text-purple-500 dark:text-purple-400 shrink-0" />
            Smart Invalidation
          </h3>
          <p class="text-mauve-600 dark:text-mauve-400 leading-relaxed text-sm font-light">
            Mutations automatically invalidate the full route subtree. A <code class="text-pink-600 dark:text-pink-300 bg-pink-100 dark:bg-pink-500/10 px-1.5 py-0.5 rounded text-xs border border-pink-200 dark:border-pink-500/20">POST /users</code> invalidates every cached <code class="text-indigo-600 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-500/10 px-1.5 py-0.5 rounded text-xs border border-indigo-200 dark:border-indigo-500/20">GET /users/**</code> entry.
          </p>
        </div>

        <div class="group relative rounded-2xl border border-mauve-200 dark:border-mauve-700 bg-white/50 dark:bg-mauve-800/40 hover:bg-white/80 dark:hover:bg-mauve-800/60 transition-all duration-500 p-8 overflow-hidden backdrop-blur-sm hover:-translate-y-1 shadow-lg shadow-mauve-200/20 dark:shadow-2xl dark:shadow-indigo-500/10 md:col-span-2 lg:col-span-1">
          <div class="absolute top-0 right-0 p-3 opacity-[0.03] dark:opacity-5 group-hover:opacity-10 transition duration-500 transform group-hover:scale-110 group-hover:translate-y-2">
            <Droplet class="w-24 h-24 text-indigo-500 dark:text-indigo-400" />
          </div>
          <h3 class="text-lg font-semibold text-mauve-900 dark:text-white mb-3 flex items-center gap-2.5">
            <Droplet class="w-5 h-5 text-indigo-500 dark:text-indigo-400 shrink-0" />
            SSR Hydration
          </h3>
          <p class="text-mauve-600 dark:text-mauve-400 leading-relaxed text-sm font-light">
            Nuxt module dehydrates TanStack state on the server and re-hydrates it on the client before any query runs. Zero loading flicker.
          </p>
        </div>

        <div class="group relative rounded-2xl border border-mauve-200 dark:border-mauve-700 bg-white/50 dark:bg-mauve-800/40 hover:bg-white/80 dark:hover:bg-mauve-800/60 transition-all duration-500 p-8 overflow-hidden backdrop-blur-sm hover:-translate-y-1 shadow-lg shadow-mauve-200/20 dark:shadow-2xl dark:shadow-rose-500/10">
          <h3 class="text-lg font-semibold text-mauve-900 dark:text-white mb-3 flex items-center gap-2.5">
            <Network class="w-5 h-5 text-rose-500 dark:text-rose-400 shrink-0" />
            End-to-End Types
          </h3>
          <p class="text-mauve-600 dark:text-mauve-400 leading-relaxed text-sm font-light">
            Response types flow from your Elysia route definitions into every <code class="text-mauve-700 dark:text-mauve-300 bg-mauve-100 dark:bg-white/10 px-1 rounded text-xs">useQuery</code> return. Rename a field on the server — TypeScript catches it in the component.
          </p>
        </div>

        <div class="group relative rounded-2xl border border-mauve-200 dark:border-mauve-700 bg-white/50 dark:bg-mauve-800/40 hover:bg-white/80 dark:hover:bg-mauve-800/60 transition-all duration-500 p-8 overflow-hidden backdrop-blur-sm hover:-translate-y-1 shadow-lg shadow-mauve-200/20 dark:shadow-2xl dark:shadow-sky-500/10">
          <h3 class="text-lg font-semibold text-mauve-900 dark:text-white mb-3 flex items-center gap-2.5">
            <Zap class="w-5 h-5 text-sky-500 dark:text-sky-400 shrink-0" />
            Reactive Params
          </h3>
          <p class="text-mauve-600 dark:text-mauve-400 leading-relaxed text-sm font-light">
            Pass Vue refs as query params. The query key updates and the cache re-fetches automatically — no watchers, no manual invalidation.
          </p>
        </div>

        <div class="group relative rounded-2xl border border-mauve-200 dark:border-mauve-700 bg-white/50 dark:bg-mauve-800/40 hover:bg-white/80 dark:hover:bg-mauve-800/60 transition-all duration-500 p-8 overflow-hidden backdrop-blur-sm hover:-translate-y-1 shadow-lg shadow-mauve-200/20 dark:shadow-2xl dark:shadow-emerald-500/10">
          <h3 class="text-lg font-semibold text-mauve-900 dark:text-white mb-3 flex items-center gap-2.5">
            <PackageSearch class="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0" />
            Zero Config
          </h3>
          <p class="text-mauve-600 dark:text-mauve-400 leading-relaxed text-sm font-light">
            One call to <code class="text-mauve-700 dark:text-mauve-300 bg-mauve-100 dark:bg-white/10 px-1 rounded text-xs">createEdenQueryHelpers</code> is the entire setup. No stores, no schemas, no code generation.
          </p>
        </div>
      </div>

      <div class="mb-28">
        <div class="text-center mb-14">
          <h2 class="text-3xl md:text-4xl font-bold text-mauve-900 dark:text-white mb-4">How it works</h2>
          <p class="text-mauve-600 dark:text-mauve-400 max-w-xl mx-auto text-sm leading-relaxed">A transparent proxy records your route access and method at runtime, then stamps a deterministic key onto the TanStack cache.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div class="rounded-xl border border-mauve-200 dark:border-white/10 bg-white/60 dark:bg-white/5 p-6 backdrop-blur-sm text-center relative overflow-hidden group hover:border-pink-300 dark:hover:border-pink-500/30 transition-colors shadow-sm dark:shadow-none">
            <div class="absolute inset-0 bg-gradient-to-b from-pink-500/5 dark:from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-500/20 border border-pink-200 dark:border-pink-500/30 flex items-center justify-center mx-auto mb-4 relative z-10">
              <span class="text-pink-600 dark:text-pink-400 font-bold text-sm">1</span>
            </div>
            <h4 class="text-mauve-900 dark:text-white font-semibold mb-2 text-sm relative z-10">Proxy access</h4>
            <p class="text-mauve-500 dark:text-gray-500 text-xs leading-relaxed relative z-10">Accessing <code class="text-mauve-700 dark:text-gray-300">eden.proxy.users.get</code> records the segments into a RouteMeta attached via symbol.</p>
          </div>
          <div class="rounded-xl border border-mauve-200 dark:border-white/10 bg-white/60 dark:bg-white/5 p-6 backdrop-blur-sm text-center relative overflow-hidden group hover:border-purple-300 dark:hover:border-purple-500/30 transition-colors shadow-sm dark:shadow-none">
             <div class="absolute inset-0 bg-gradient-to-b from-purple-500/5 dark:from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-500/20 border border-purple-200 dark:border-purple-500/30 flex items-center justify-center mx-auto mb-4 relative z-10">
              <span class="text-purple-600 dark:text-purple-400 font-bold text-sm">2</span>
            </div>
            <h4 class="text-mauve-900 dark:text-white font-semibold mb-2 text-sm relative z-10">Key derivation</h4>
            <p class="text-mauve-500 dark:text-gray-500 text-xs leading-relaxed relative z-10"><code class="text-mauve-700 dark:text-gray-300">buildQueryKey</code> serializes the meta with sorted keys, producing a stable TanStack query key array.</p>
          </div>
          <div class="rounded-xl border border-mauve-200 dark:border-white/10 bg-white/60 dark:bg-white/5 p-6 backdrop-blur-sm text-center relative overflow-hidden group hover:border-indigo-300 dark:hover:border-indigo-500/30 transition-colors shadow-sm dark:shadow-none">
             <div class="absolute inset-0 bg-gradient-to-b from-indigo-500/5 dark:from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center mx-auto mb-4 relative z-10">
              <span class="text-indigo-600 dark:text-indigo-400 font-bold text-sm">3</span>
            </div>
            <h4 class="text-mauve-900 dark:text-white font-semibold mb-2 text-sm relative z-10">Cache + invalidation</h4>
            <p class="text-mauve-500 dark:text-gray-500 text-xs leading-relaxed relative z-10">TanStack caches by key. On mutation, we return the route prefix, letting TanStack invalidate the entire subtree.</p>
          </div>
        </div>
      </div>

      <div class="mb-28 max-w-4xl mx-auto">
        <div class="text-center mb-10">
          <h2 class="text-3xl md:text-4xl font-bold text-mauve-900 dark:text-white mb-4">Three lines. Fully typed.</h2>
          <p class="text-mauve-600 dark:text-mauve-400 max-w-xl mx-auto text-sm">This is the entire surface area of the library for most use cases.</p>
        </div>

        <div class="rounded-2xl overflow-hidden border border-mauve-200 dark:border-white/10 shadow-xl dark:shadow-2xl bg-white dark:bg-[#09090b] relative group">
          <div class="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          
          <div class="flex items-center justify-between px-5 py-3 border-b border-mauve-100 dark:border-white/10 bg-mauve-50/50 dark:bg-white/[0.02]">
            <div class="flex space-x-2">
              <div class="w-3 h-3 rounded-full bg-rose-400 dark:bg-red-500/70"></div>
              <div class="w-3 h-3 rounded-full bg-amber-400 dark:bg-yellow-500/70"></div>
              <div class="w-3 h-3 rounded-full bg-emerald-400 dark:bg-green-500/70"></div>
            </div>
            <div class="text-xs text-mauve-500 dark:text-gray-500 font-mono">pages/users.vue</div>
            <div class="w-12"></div>
          </div>
          <div class="p-7 overflow-x-auto relative z-10">
            <pre class="text-sm leading-8 font-mono"><code><span class="text-mauve-400 dark:text-gray-500">// Derive query key, fetch, and cache — all typed from your Elysia App type</span>
<span class="text-pink-600 dark:text-pink-400">const</span> { <span class="text-indigo-600 dark:text-blue-300">data</span>: <span class="text-mauve-900 dark:text-white">users</span> } = <span class="text-purple-600 dark:text-purple-300">eden</span>.<span class="text-amber-600 dark:text-yellow-200">useQuery</span>(<span class="text-purple-600 dark:text-purple-300">eden</span>.<span class="text-indigo-600 dark:text-blue-300">proxy</span>.<span class="text-indigo-600 dark:text-blue-300">users</span>.<span class="text-amber-600 dark:text-yellow-200">get</span>)

<span class="text-mauve-400 dark:text-gray-500">// Mutation that auto-invalidates every GET /users/** cache entry</span>
<span class="text-pink-600 dark:text-pink-400">const</span> <span class="text-mauve-900 dark:text-white">create</span> = <span class="text-purple-600 dark:text-purple-300">eden</span>.<span class="text-amber-600 dark:text-yellow-200">useMutation</span>(<span class="text-purple-600 dark:text-purple-300">eden</span>.<span class="text-indigo-600 dark:text-blue-300">proxy</span>.<span class="text-indigo-600 dark:text-blue-300">users</span>.<span class="text-amber-600 dark:text-yellow-200">post</span>)

<span class="text-mauve-400 dark:text-gray-500">// Request body is typed — compile error if you pass the wrong shape</span>
<span class="text-mauve-900 dark:text-white">create</span>.<span class="text-amber-600 dark:text-yellow-200">mutate</span>({ <span class="text-indigo-600 dark:text-blue-300">name</span>: <span class="text-emerald-600 dark:text-green-300">'Alice'</span>, <span class="text-indigo-600 dark:text-blue-300">email</span>: <span class="text-emerald-600 dark:text-green-300">'alice@example.com'</span> })</code></pre>
          </div>
        </div>
      </div>

      <div class="mb-28">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-mauve-900 dark:text-white mb-4">Three focused packages</h2>
          <p class="text-mauve-600 dark:text-gray-400 max-w-xl mx-auto text-sm">Install only what you need.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div class="rounded-2xl border border-mauve-200 dark:border-white/10 bg-white/60 dark:bg-white/5 p-7 backdrop-blur-sm transition-all hover:bg-white/90 dark:hover:bg-white/10 hover:-translate-y-1 shadow-sm dark:shadow-none">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-500/10 border border-pink-200 dark:border-pink-500/20 flex items-center justify-center">
                <Box class="w-5 h-5 text-pink-600 dark:text-pink-400" />
              </div>
              <span class="text-mauve-700 dark:text-gray-300 font-mono text-xs">@elysia-vue-query/core</span>
            </div>
            <h3 class="text-mauve-900 dark:text-white font-semibold mb-2">Core</h3>
            <p class="text-mauve-500 dark:text-gray-400 text-xs leading-relaxed">Proxy engine, key builders, stable serialization. Framework-agnostic — the foundation every other package builds on.</p>
          </div>

          <div class="rounded-2xl border border-purple-200 dark:border-purple-500/30 bg-purple-50/50 dark:bg-purple-500/10 p-7 backdrop-blur-sm ring-2 ring-purple-500/10 dark:ring-purple-500/20 shadow-lg shadow-purple-500/10 dark:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all hover:-translate-y-1">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-500/20 border border-purple-200 dark:border-purple-500/30 flex items-center justify-center">
                  <Layers class="w-5 h-5 text-purple-600 dark:text-purple-300" />
                </div>
                <span class="text-mauve-800 dark:text-gray-200 font-mono text-xs font-semibold">@elysia-vue-query/vue</span>
              </div>
              <span class="text-purple-600 dark:text-purple-300 text-[10px] uppercase tracking-wider font-bold border border-purple-300 dark:border-purple-500/40 bg-purple-100 dark:bg-purple-500/20 rounded-full px-2.5 py-1">Primary</span>
            </div>
            <h3 class="text-mauve-900 dark:text-white font-semibold mb-2">Vue</h3>
            <p class="text-mauve-600 dark:text-gray-300 text-xs leading-relaxed">All composables: <code class="text-mauve-800 dark:text-gray-200 bg-mauve-200/50 dark:bg-black/30 px-1 rounded">useQuery</code>, <code class="text-mauve-800 dark:text-gray-200 bg-mauve-200/50 dark:bg-black/30 px-1 rounded">useMutation</code>, <code class="text-mauve-800 dark:text-gray-200 bg-mauve-200/50 dark:bg-black/30 px-1 rounded">prefetch</code>. The package you import in components.</p>
          </div>

          <div class="rounded-2xl border border-mauve-200 dark:border-white/10 bg-white/60 dark:bg-white/5 p-7 backdrop-blur-sm transition-all hover:bg-white/90 dark:hover:bg-white/10 hover:-translate-y-1 shadow-sm dark:shadow-none">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center">
                <Server class="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span class="text-mauve-700 dark:text-gray-300 font-mono text-xs">@elysia-vue-query/nuxt</span>
            </div>
            <h3 class="text-mauve-900 dark:text-white font-semibold mb-2">Nuxt</h3>
            <p class="text-mauve-500 dark:text-gray-400 text-xs leading-relaxed">Zero-config Nuxt module. Dehydrates the QueryClient on the server, hydrates it on the client. No double-fetch.</p>
          </div>
        </div>
      </div>

      <div class="text-center relative">
        <div class="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10 dark:from-pink-500/20 dark:to-purple-500/20 blur-[60px] dark:blur-[80px] -z-10 rounded-full"></div>
        
        <div class="inline-block rounded-3xl border border-mauve-200 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-xl px-16 py-14 shadow-2xl">
          <h2 class="text-3xl md:text-4xl font-bold text-mauve-900 dark:text-white mb-4">Ready to start?</h2>
          <p class="text-mauve-600 dark:text-gray-300 mb-8 text-base">Full installation guide, API reference, and live playground.</p>
          <div class="flex flex-col sm:flex-row justify-center items-center gap-5">
            <a
              class="clicky px-8 py-4 text-sm font-bold tracking-wide rounded-full text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 dark:hover:from-pink-400 dark:hover:to-purple-500 transition-all duration-300 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] dark:hover:shadow-[0_0_30px_rgba(236,72,153,0.4)]"
              href="/guide/getting-started"
            >
              Installation Guide
            </a>
            <a
              class="clicky px-8 py-4 text-sm font-semibold tracking-wide rounded-full text-mauve-700 dark:text-gray-300 hover:text-mauve-900 dark:hover:text-white border border-mauve-200 dark:border-white/20 hover:border-mauve-300 dark:hover:border-white/50 hover:bg-mauve-50 dark:hover:bg-white/5 transition-all duration-300"
              href="/playground"
            >
              Open Playground
            </a>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>