import type { Linter } from 'eslint'
import type { NustackLintOptions } from '../src/config'
import type { NustackContext } from '../src/context'
import { composer } from 'eslint-flat-config-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { nustackLint } from '../src/config'

// A context where every detectable feature is present, so concern gating is driven
// purely by the options under test rather than by missing detection.
const FULL_CONTEXT: NustackContext = {
  modules: { nuxtUi: true, pinia: false, nuxtImage: false, nuxtContent: false },
  tailwind: { detected: true, entryPoint: 'app/assets/css/main.css' },
  autoImports: ['ref'],
  components: ['UButton'],
}

async function resolve(options: NustackLintOptions): Promise<Linter.Config[]> {
  return nustackLint(composer() as any, { context: FULL_CONTEXT, ...options }).toConfigs() as any
}

/** Names of the nustack-authored config objects in the resolved flat config. */
async function nustackConfigNames(options: NustackLintOptions): Promise<string[]> {
  const configs = await resolve(options)
  return configs.map(c => c.name).filter((n): n is string => !!n && n.startsWith('nustack/'))
}

/** Every rule id referenced by the nustack-authored config objects. */
async function nustackRuleIds(options: NustackLintOptions): Promise<Set<string>> {
  const configs = await resolve(options)
  const ids = new Set<string>()
  for (const c of configs) {
    if (!c.name?.startsWith('nustack/'))
      continue
    for (const id of Object.keys(c.rules ?? {}))
      ids.add(id)
  }
  return ids
}

const ORIGINAL_DEPTH = process.env.NUSTACK_LINT_DEPTH

afterEach(() => {
  if (ORIGINAL_DEPTH === undefined)
    delete process.env.NUSTACK_LINT_DEPTH
  else
    process.env.NUSTACK_LINT_DEPTH = ORIGINAL_DEPTH
})

describe('variant ladder', () => {
  it('minimal applies only the security floor among nuxt rules', async () => {
    const ids = await nustackRuleIds({ variant: 'minimal' })
    expect(ids).toContain('nustack/nuxt/no-secret-in-public-runtimeconfig')
    expect(ids).not.toContain('nustack/nuxt/no-process-env')
    expect(ids).not.toContain('nustack/nuxt/no-explicit-auto-import')
  })

  it('recommended adds process-env and auto-import enforcement', async () => {
    const ids = await nustackRuleIds({ variant: 'recommended' })
    expect(ids).toContain('nustack/nuxt/no-secret-in-public-runtimeconfig')
    expect(ids).toContain('nustack/nuxt/no-process-env')
    expect(ids).toContain('nustack/nuxt/no-explicit-auto-import')
  })

  it('defaults to recommended when variant is omitted', async () => {
    const ids = await nustackRuleIds({})
    expect(ids).toContain('nustack/nuxt/no-process-env')
  })
})

describe('concern toggles', () => {
  it('includes tailwind + nuxt-ui when detected', async () => {
    const names = await nustackConfigNames({})
    expect(names).toContain('nustack/tailwind')
    expect(names).toContain('nustack/nuxt-ui')
    expect(names).toContain('nustack/vue')
  })

  it('drops a concern when disabled', async () => {
    const names = await nustackConfigNames({ tailwind: false, nuxtUi: false })
    expect(names).not.toContain('nustack/tailwind')
    expect(names).not.toContain('nustack/nuxt-ui')
    expect(names).toContain('nustack/vue')
  })

  it('applies global overrides as a trailing layer', async () => {
    const configs = await resolve({ overrides: { 'no-console': 'off' } })
    const override = configs.find(c => c.name === 'nustack/overrides')
    expect(override?.rules).toMatchObject({ 'no-console': 'off' })
  })
})

describe('depth (per-run)', () => {
  it('omits the type-aware layer at quick depth', async () => {
    delete process.env.NUSTACK_LINT_DEPTH
    const names = await nustackConfigNames({})
    expect(names).not.toContain('nustack/type-aware')
  })

  it('adds the type-aware layer at full depth', async () => {
    process.env.NUSTACK_LINT_DEPTH = 'full'
    const names = await nustackConfigNames({})
    expect(names).toContain('nustack/type-aware')
  })
})
