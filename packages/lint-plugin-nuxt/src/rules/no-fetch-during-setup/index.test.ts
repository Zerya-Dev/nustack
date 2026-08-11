import tsParser from '@typescript-eslint/parser'
import { RuleTester } from 'eslint'
import { describe, expect, it } from 'vitest'
import vueParser from 'vue-eslint-parser'
import plugin, { nuxtConfigs } from '../../index.js'

const rule = plugin.rules?.['no-fetch-during-setup']
const languageOptions = { ecmaVersion: 'latest' as const, sourceType: 'module' as const }
const error = { messageId: 'initialFetch' }

describe('no-fetch-during-setup', () => {
  it('is enabled in the recommended app config', () => {
    const enabledRules = nuxtConfigs().flatMap(config => Object.keys(config.rules ?? {}))
    expect(enabledRules).toContain('@nustack/nuxt/no-fetch-during-setup')
  })

  it('reports setup fetches and same-scope loaders reached during setup', () => {
    const tester = new RuleTester({ languageOptions })

    tester.run('no-fetch-during-setup', rule as never, {
      valid: [
        'const data = $fetch("/api/posts")',
        'export default { mounted() { return $fetch("/api/posts") } }',
        'export default { setup() { const load = () => $fetch("/api/posts"); return { load } } }',
        'export default { setup() { useAsyncData(() => $fetch("/api/posts")) } }',
        'export default { setup() { const load = () => $fetch("/api/posts"); onMounted(load) } }',
        {
          code: 'export default { setup() { function loadClient() { return $fetch("/api/posts") } return loadClient() } }',
          options: [{ allow: ['loadClient'] }],
        },
      ],
      invalid: [
        {
          code: 'export default defineNuxtComponent({ setup() { const posts = $fetch("/api/posts"); return { posts } } })',
          errors: [error],
        },
        {
          code: 'export default { setup: () => $fetch("/api/posts") }',
          errors: [error],
        },
        {
          code: 'function load() { return $fetch("/api/posts") } export default defineNuxtComponent({ setup() { return load() } })',
          errors: [error],
        },
      ],
    })
  })

  it('reports fetches reached by immediate setup watchers only', () => {
    const tester = new RuleTester({ languageOptions })

    tester.run('no-fetch-during-setup', rule as never, {
      valid: [
        'export default { setup() { watch(id, () => $fetch("/api/posts/" + id.value)) } }',
        'export default { setup() { watch(id, () => $fetch("/api/posts"), { immediate: false }) } }',
        'export default { setup() { watch(id, () => $fetch("/api/posts"), { immediate }) } }',
        'export default { setup() { watch(id, () => setTimeout(() => $fetch("/api/posts")), { immediate: true }) } }',
        'export default { setup() { onMounted(() => watch(id, () => $fetch("/api/posts"), { immediate: true })) } }',
        {
          code: 'export default { setup() { function loadClient() { return $fetch("/api/posts") } watch(id, loadClient, { immediate: true }) } }',
          options: [{ allow: ['loadClient'] }],
        },
      ],
      invalid: [
        {
          code: 'export default { setup() { watch(id, () => $fetch("/api/posts/" + id.value), { immediate: true }) } }',
          errors: [error],
        },
        {
          code: 'export default { setup() { function load() { return $fetch("/api/posts") } watch(id, load, { immediate: true }) } }',
          errors: [error],
        },
        {
          code: 'export default { setup() { const load = () => $fetch("/api/posts"); const initialLoad = load; watch(id, initialLoad, { immediate: true }) } }',
          errors: [error],
        },
        {
          code: 'export default { setup() { const load = () => $fetch("/api/posts"); watch(id, () => load(), { immediate: true }) } }',
          errors: [error],
        },
        {
          code: 'import { watch as observe } from "vue"; export default { setup() { observe(id, () => $fetch("/api/posts"), { immediate: true }) } }',
          errors: [error],
        },
        {
          code: 'export default { setup() { watch(id, () => $fetch("/api/posts"), { "immediate": true }) } }',
          errors: [error],
        },
      ],
    })
  })

  it('recognizes imports and shadowing', () => {
    const tester = new RuleTester({ languageOptions })

    tester.run('no-fetch-during-setup', rule as never, {
      valid: [
        'export default { setup($fetch) { return $fetch("/api/posts") } }',
        'import { $fetch } from "other"; export default { setup() { return $fetch("/api/posts") } }',
        'export default { setup() { const watch = runLater; watch(id, () => $fetch("/api/posts"), { immediate: true }) } }',
      ],
      invalid: [
        {
          code: 'import { $fetch as request } from "#imports"; export default { setup() { return request("/api/posts") } }',
          errors: [error],
        },
        {
          code: 'import * as Nuxt from "#imports"; export default { setup() { return Nuxt.$fetch("/api/posts") } }',
          errors: [error],
        },
      ],
    })
  })

  it('supports Vue script setup and TypeScript expressions', () => {
    const tester = new RuleTester({
      languageOptions: {
        ...languageOptions,
        parser: vueParser,
        parserOptions: { parser: tsParser },
      },
    })

    tester.run('no-fetch-during-setup', rule as never, {
      valid: [
        {
          filename: 'posts.vue',
          code: '<script setup lang="ts">const submit = () => $fetch("/api/posts", { method: "POST" })</script>',
        },
        {
          filename: 'posts.vue',
          code: '<script setup lang="ts">watch(id, () => $fetch<Post[]>("/api/posts"), { immediate: false })</script>',
        },
      ],
      invalid: [
        {
          filename: 'posts.vue',
          code: '<script setup lang="ts">const posts = await $fetch<Post[]>("/api/posts")</script>',
          errors: [error],
        },
        {
          filename: 'posts.vue',
          code: '<script setup lang="ts">const load = async () => $fetch<Post[]>("/api/posts"); watch(id, load as () => void, { immediate: true as const })</script>',
          errors: [error],
        },
      ],
    })
  })
})
