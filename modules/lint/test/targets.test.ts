import type { Linter } from 'eslint'
import type { NustackLintOptions } from '../src/config'
import type { NustackContext } from '../src/context'
import { fileURLToPath } from 'node:url'
import { composer } from 'eslint-flat-config-utils'
import { describe, expect, it } from 'vitest'
import { applyNustackConfig } from '../src/config'
import { resolveTarget } from '../src/target'

// A context where every detectable feature is present, so concern gating is driven
// purely by the target/options under test rather than by missing detection.
const FULL_CONTEXT: NustackContext = {
  modules: { nuxtUi: true, pinia: false, nuxtImage: false, nuxtContent: false, mdc: false },
  tailwind: { detected: true, entryPoint: 'app/assets/css/main.css' },
  autoImports: ['ref'],
  components: ['UButton'],
}

async function resolve(options: NustackLintOptions): Promise<Linter.Config[]> {
  return await applyNustackConfig(composer() as any, { context: FULL_CONTEXT, ...options }).toConfigs() as any
}

function names(configs: Linter.Config[]): string[] {
  return configs.map(c => c.name).filter((n): n is string => !!n)
}

function ruleIds(configs: Linter.Config[]): Set<string> {
  const ids = new Set<string>()
  for (const c of configs) {
    for (const id of Object.keys(c.rules ?? {}))
      ids.add(id)
  }
  return ids
}

/** The effective value of a rule id — the LAST config that sets it wins, mirroring how flat config resolves overlapping global (no-`files`) entries. */
function lastRuleValue(configs: Linter.Config[], ruleId: string): Linter.RuleEntry | undefined {
  let value: Linter.RuleEntry | undefined
  for (const c of configs) {
    if (c.rules && ruleId in c.rules)
      value = c.rules[ruleId]
  }
  return value
}

describe('target: nuxt-app', () => {
  it('is the default and matches today\'s Nuxt-path output', async () => {
    const configs = await resolve({})
    const ns = names(configs)

    expect(ns).toContain('nustack/nuxt/app')
    expect(ns).toContain('nustack/vue')
    expect(ns).toContain('nustack/vueuse')
    expect(ns).toContain('nustack/vite')
    expect(ns).toContain('nustack/tailwind')
    expect(ns).toContain('nustack/nuxt-ui')
  })

  it('carries the Nitro base rule', async () => {
    const configs = await resolve({})
    expect(lastRuleValue(configs, 'node/prefer-global/process')).toEqual(['error', 'always'])
  })
})

describe('target: vue-app', () => {
  it('turns the Nuxt concern off but keeps vue/vueUse/vite on', async () => {
    const configs = await resolve({ target: 'vue-app' })
    const ns = names(configs)

    expect(ns).not.toContain('nustack/nuxt/app')
    expect(ns).not.toContain('nustack/nuxt/runtime-config')
    expect(ns).toContain('nustack/vue')
    expect(ns).toContain('nustack/vueuse')
    expect(ns).toContain('nustack/vite')
  })

  it('does not include @nustack/nuxt/no-process-env', async () => {
    const configs = await resolve({ target: 'vue-app' })
    expect(ruleIds(configs)).not.toContain('@nustack/nuxt/no-process-env')
  })

  it('keeps tailwind/nuxtEcosystem detection-gated (on when the context detects them)', async () => {
    const configs = await resolve({ target: 'vue-app' })
    const ns = names(configs)
    expect(ns).toContain('nustack/tailwind')
    expect(ns).toContain('nustack/nuxt-ui')
  })

  it('drops tailwind/nuxtEcosystem when standalone detection finds nothing', async () => {
    const EMPTY: NustackContext = {
      modules: { nuxtUi: false, pinia: false, nuxtImage: false, nuxtContent: false, mdc: false },
      tailwind: { detected: false, entryPoint: null },
      autoImports: [],
      components: [],
    }
    const configs = await applyNustackConfig(composer() as any, { target: 'vue-app', context: EMPTY }).toConfigs() as Linter.Config[]
    const ns = names(configs)
    expect(ns).not.toContain('nustack/tailwind')
    expect(ns).not.toContain('nustack/nuxt-ui')
  })

  it('does not carry the Nitro base rule (keeps antfu\'s own default)', async () => {
    const configs = await resolve({ target: 'vue-app' })
    expect(lastRuleValue(configs, 'node/prefer-global/process')).not.toEqual(['error', 'always'])
  })

  it('a plain user option always wins over the target default', async () => {
    const configs = await resolve({ target: 'vue-app', vue: false })
    expect(names(configs)).not.toContain('nustack/vue')
  })
})

describe('target: nuxt-module', () => {
  it('sets antfu type to lib and disables app-only concerns for src', () => {
    const resolved = resolveTarget('nuxt-module', process.cwd())
    expect(resolved.base).toMatchObject({ type: 'lib' })
    expect(resolved.nuxt).toBe(false)
    expect(resolved.vueUse).toBe(false)
    expect(resolved.vite).toBe(false)
  })

  it('ignores every nested Nuxt app (a dir with its own nuxt.config)', async () => {
    // Resolved from this package's cwd, which has playground/nuxt.config.ts.
    const resolved = resolveTarget('nuxt-module', process.cwd())
    expect((resolved.base as { ignores?: string[] }).ignores).toContain('playground')
  })

  it('detects arbitrarily-named nested Nuxt apps, not just `playground`', () => {
    const resolved = resolveTarget('nuxt-module', fileURLToPath(new URL('./fixtures/nested-nuxt-app', import.meta.url)))
    const ignores = (resolved.base as { ignores?: string[] }).ignores ?? []
    expect(ignores).toContain('demo')
    expect(ignores).not.toContain('src')
  })

  it('carries the Nitro base rule', async () => {
    const configs = await resolve({ target: 'nuxt-module' })
    expect(lastRuleValue(configs, 'node/prefer-global/process')).toEqual(['error', 'always'])
  })

  it('keeps markdown and nuxtEcosystem detection-gated, never blanket-disabled', async () => {
    const configs = await resolve({ target: 'nuxt-module' })
    const ns = names(configs)
    expect(ns).toContain('nustack/markdown')
    expect(ns).toContain('nustack/nuxt-ui')
  })
})
