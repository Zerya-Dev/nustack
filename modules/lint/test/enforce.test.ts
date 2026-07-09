import type { Linter } from 'eslint'
import type { NustackLintOptions } from '../src/config'
import type { NustackContext } from '../src/context'
import { composer } from 'eslint-flat-config-utils'
import { describe, expect, it } from 'vitest'
import { applyNustackConfig } from '../src/config'

const FULL_CONTEXT: NustackContext = {
  modules: { nuxtUi: true, pinia: false, nuxtImage: false, nuxtContent: false, mdc: false },
  tailwind: { detected: true, entryPoint: 'app/assets/css/main.css' },
  autoImports: ['ref'],
  components: ['UButton'],
}

async function resolve(options: NustackLintOptions): Promise<Linter.Config[]> {
  return await applyNustackConfig(composer() as any, { context: FULL_CONTEXT, ...options }).toConfigs() as any
}

async function ruleIds(options: NustackLintOptions): Promise<Set<string>> {
  const ids = new Set<string>()
  for (const c of await resolve(options)) {
    for (const id of Object.keys(c.rules ?? {}))
      ids.add(id)
  }
  return ids
}

describe('correctness is always on (opinionated by design)', () => {
  it('ships the full nuxt/vue correctness set without any opt-in', async () => {
    const ids = await ruleIds({})
    expect(ids).toContain('@nustack/nuxt/no-secret-in-public-runtimeconfig')
    expect(ids).toContain('@nustack/nuxt/no-process-env')
    expect(ids).toContain('@nustack/nuxt/no-explicit-auto-import')
    expect(ids).toContain('vue/define-emits-declaration')
    expect(ids).toContain('vue/no-import-compiler-macros')
  })
})

describe('enforce.complexity (opt-in on/off)', () => {
  it('off by default — ships no budget rules', async () => {
    const configs = await resolve({})
    expect(configs.find(c => c.name === 'nustack/complexity')).toBeUndefined()
    expect(configs.find(c => c.name === 'nustack/complexity/vue')).toBeUndefined()
  })

  it('true adds the generous budget rules', async () => {
    const configs = await resolve({ enforce: { complexity: true } })
    const complexity = configs.find(c => c.name === 'nustack/complexity')
    expect(complexity?.rules?.complexity).toEqual(['warn', 20])
    const vue = configs.find(c => c.name === 'nustack/complexity/vue')
    expect(vue?.rules?.['vue/max-props']).toEqual(['warn', { maxProps: 15 }])
  })

  it('explicit false is the same as the default', async () => {
    const configs = await resolve({ enforce: { complexity: false } })
    expect(configs.find(c => c.name === 'nustack/complexity')).toBeUndefined()
  })
})

describe('tailwind.lineWrapping (opt-in — the old pedantic rule)', () => {
  it('off by default', async () => {
    const ids = await ruleIds({})
    expect(ids).not.toContain('better-tailwindcss/enforce-consistent-line-wrapping')
  })

  it('on when explicitly enabled', async () => {
    const ids = await ruleIds({ tailwind: { lineWrapping: true } })
    expect(ids).toContain('better-tailwindcss/enforce-consistent-line-wrapping')
  })
})
