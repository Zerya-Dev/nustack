import type { Linter } from 'eslint'
import type { NustackLintOptions } from '../src/config'
import type { NustackContext } from '../src/context'
import { composer } from 'eslint-flat-config-utils'
import { describe, expect, it } from 'vitest'
import { applyNustackConfig } from '../src/config'

const FULL_CONTEXT: NustackContext = {
  modules: { nuxtUi: true, mdc: false },
  tailwind: { detected: true, entryPoint: 'app/assets/css/main.css' },
  autoImports: ['ref'],
  components: ['UButton'],
}

async function resolve(options: NustackLintOptions): Promise<Linter.Config[]> {
  return await applyNustackConfig(composer() as any, { context: FULL_CONTEXT, ...options }).toConfigs() as any
}

/** The effective value of a rule id, the LAST config that sets it wins. */
function lastRuleValue(configs: Linter.Config[], ruleId: string): Linter.RuleEntry | undefined {
  let value: Linter.RuleEntry | undefined
  for (const c of configs) {
    if (c.rules && ruleId in c.rules)
      value = c.rules[ruleId]
  }
  return value
}

describe('style (antfu + 1tbs)', () => {
  it('applies 1tbs braces on top of antfu\'s single-quote / no-semi defaults', async () => {
    const configs = await resolve({})
    const braceStyle = lastRuleValue(configs, 'style/brace-style') as [string, string] | undefined
    expect(braceStyle?.[1]).toBe('1tbs')
    // antfu's own defaults are untouched
    const stylistic = configs.find(c => c.name === 'antfu/stylistic/rules')
    expect((stylistic?.rules?.['style/quotes'] as unknown[] | undefined)?.[1]).toBe('single')
    expect(stylistic?.rules?.['style/semi']).toEqual(['error', 'never'])
  })

  it('base.stylistic: false drops the stylistic layer entirely', async () => {
    const configs = await resolve({ base: { stylistic: false } })
    expect(configs.find(c => c.name === 'antfu/stylistic/rules')).toBeUndefined()
  })

  it('base.stylistic tunes other keys while keeping the nustack preset', async () => {
    const configs = await resolve({ base: { stylistic: { quotes: 'double' } } })
    const stylistic = configs.find(c => c.name === 'antfu/stylistic/rules')
    expect((stylistic?.rules?.['style/quotes'] as unknown[] | undefined)?.[1]).toBe('double')
    // 1tbs (the nustack preset) is still seeded alongside the override
    const braceStyle = lastRuleValue(configs, 'style/brace-style') as [string, string] | undefined
    expect(braceStyle?.[1]).toBe('1tbs')
  })

  it('preset: \'antfu\' drops the 1tbs deviation (plain antfu stroustrup)', async () => {
    const configs = await resolve({ base: { preset: 'antfu' } })
    const braceStyle = lastRuleValue(configs, 'style/brace-style') as [string, string] | undefined
    expect(braceStyle?.[1]).toBe('stroustrup')
  })

  it('preset: \'antfu\' still honours an explicit base.stylistic override', async () => {
    const configs = await resolve({ base: { preset: 'antfu', stylistic: { braceStyle: '1tbs' } } })
    const braceStyle = lastRuleValue(configs, 'style/brace-style') as [string, string] | undefined
    expect(braceStyle?.[1]).toBe('1tbs')
  })
})
