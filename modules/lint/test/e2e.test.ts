import type { Linter as LinterNs } from 'eslint'
import type { NustackContext } from '../src/context'
import { fileURLToPath } from 'node:url'
import { Linter } from 'eslint'
import { composer } from 'eslint-flat-config-utils'
import { describe, expect, it } from 'vitest'
import { applyNustackConfig } from '../src/config'

// A real Tailwind v4 entry point (`@import "tailwindcss"`) so better-tailwindcss can
// actually resolve the class registry — without it the plugin self-disables.
const TAILWIND_ENTRY = fileURLToPath(new URL('./fixtures/tailwind.css', import.meta.url))

const CONTEXT: NustackContext = {
  modules: { nuxtUi: true, pinia: false, nuxtImage: false, nuxtContent: false },
  tailwind: { detected: true, entryPoint: TAILWIND_ENTRY },
  autoImports: ['ref', 'useRuntimeConfig'],
  components: ['UButton'],
}

async function lint(
  code: string,
  filename: string,
  options = {},
): Promise<LinterNs.LintMessage[]> {
  const configs = await applyNustackConfig(composer() as any, { context: CONTEXT, ...options }).toConfigs()
  const linter = new Linter({ configType: 'flat' })
  return linter.verify(code, configs as LinterNs.Config[], filename)
}

function ruleIds(messages: LinterNs.LintMessage[]): string[] {
  return messages.map(m => m.ruleId ?? '').filter(Boolean)
}

describe('e2e: composed config lints real code', () => {
  it('flags process.env in app code (nuxt concern)', async () => {
    const messages = await lint(`const x = process.env.FOO`, 'app/composables/x.ts')
    expect(ruleIds(messages)).toContain('@nustack/nuxt/no-process-env')
  })

  it('flags a non-ts <script> block (vue concern)', async () => {
    const messages = await lint(`<script>const x = 1</script><template><div /></template>`, 'app/pages/x.vue')
    expect(ruleIds(messages)).toContain('vue/block-lang')
  })

  it('flags a raw <button> when Nuxt UI is detected (nuxt-ui concern)', async () => {
    const messages = await lint(`<script setup lang="ts"></script><template><button>x</button></template>`, 'app/pages/x.vue')
    expect(ruleIds(messages)).toContain('@nustack/nuxt-ui/prefer-u-button')
  })

  it('flags a redundant explicit auto-import (nuxt concern, fixable)', async () => {
    const messages = await lint(`import { ref } from 'vue'\nconst x = ref(1)`, 'app/composables/x.ts')
    expect(ruleIds(messages)).toContain('@nustack/nuxt/no-explicit-auto-import')
  })

  it('flags VueUse rules loaded through @nustackjs/lint-plugin-vueuse', async () => {
    const messages = await lint(
      `import * as VueUse from '@vueuse/core'\nimport { useStorage } from '@vueuse/core'\nconst viewport = VueUse.useWindowSize()\nconst value = useStorage('x', 0)\nconsole.log(viewport, value)`,
      'app/utils/vueuse-demo.ts',
    )
    expect(ruleIds(messages)).toContain('@nustack/vueuse/no-namespace-import')
    expect(ruleIds(messages)).toContain('@nustack/vueuse/no-nuxt-auto-import-collision')
  })

  it('flags Vite rules loaded through @nustackjs/lint-plugin-vite', async () => {
    const messages = await lint(
      `import logo from '../public/logo.svg'\nconst token = import.meta.env.VITE_API_TOKEN\nconsole.log(logo, token)`,
      'app/utils/vite-demo.ts',
    )

    expect(ruleIds(messages)).toContain('@nustack/vite/no-public-src-import')
    expect(ruleIds(messages)).toContain('@nustack/vite/no-client-secret-pattern')
  })

  it('orders Tailwind classes in a plain class attribute', async () => {
    const messages = await lint(`<script setup lang="ts"></script><template><div class="p-4 flex" /></template>`, 'app/pages/x.vue')
    expect(ruleIds(messages)).toContain('better-tailwindcss/enforce-consistent-class-order')
  })

  it('orders Tailwind classes inside the Nuxt UI :ui object prop', async () => {
    const code = `<script setup lang="ts"></script><template><UCard :ui="{ body: 'p-4 flex' }" /></template>`
    const messages = await lint(code, 'app/pages/x.vue')
    const tailwind = messages.filter(m => m.ruleId === 'better-tailwindcss/enforce-consistent-class-order')
    // The :ui body string is on column > 40, proving the object value (not just the
    // top-level class attr) was linted.
    expect(tailwind.some(m => m.column > 40)).toBe(true)
  })
})

describe('e2e: variant and depth change behaviour', () => {
  it('minimal variant does NOT flag process.env, recommended does', async () => {
    const minimal = await lint(`const x = process.env.FOO`, 'app/composables/x.ts', { variant: 'minimal' })
    const recommended = await lint(`const x = process.env.FOO`, 'app/composables/x.ts', { variant: 'recommended' })
    expect(ruleIds(minimal)).not.toContain('@nustack/nuxt/no-process-env')
    expect(ruleIds(recommended)).toContain('@nustack/nuxt/no-process-env')
  })

  it('only enables Tailwind line wrapping in pedantic variant', async () => {
    const recommended = await applyNustackConfig(composer() as any, { context: CONTEXT, variant: 'recommended' }).toConfigs()
    const pedantic = await applyNustackConfig(composer() as any, { context: CONTEXT, variant: 'pedantic' }).toConfigs()

    const tailwindRules = (configs: any[]) =>
      configs.find(c => c.name === 'nustack/tailwind')?.rules ?? {}

    expect(tailwindRules(recommended)).not.toHaveProperty('better-tailwindcss/enforce-consistent-line-wrapping')
    expect(tailwindRules(pedantic)).toHaveProperty('better-tailwindcss/enforce-consistent-line-wrapping', 'warn')
  })

  it('full depth turns on the type-aware projectService layer; quick does not', async () => {
    const original = process.env.NUSTACK_LINT_DEPTH
    try {
      process.env.NUSTACK_LINT_DEPTH = 'quick'
      const quick = await applyNustackConfig(composer() as any, { context: CONTEXT }).toConfigs()
      process.env.NUSTACK_LINT_DEPTH = 'full'
      const full = await applyNustackConfig(composer() as any, { context: CONTEXT }).toConfigs()

      const hasProjectService = (configs: any[]): boolean =>
        configs.some(c => c.languageOptions?.parserOptions?.projectService === true)

      expect(hasProjectService(quick)).toBe(false)
      expect(hasProjectService(full)).toBe(true)
    } finally {
      if (original === undefined)
        delete process.env.NUSTACK_LINT_DEPTH
      else process.env.NUSTACK_LINT_DEPTH = original
    }
  })
})
