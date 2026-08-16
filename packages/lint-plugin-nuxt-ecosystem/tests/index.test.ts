import type { ESLint } from 'eslint'
import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import {
  NUXT_IMAGE_PRESET_RULES,
  NUXT_UI_PRESET_RULES,
  nuxtEcosystemConfigs,
  nuxtEcosystemPlugins,
  nuxtImageConfig,
  nuxtImagePlugin,
  nuxtImageRules,
  nuxtUiConfig,
  nuxtUiPlugin,
  nuxtUiRules,
} from '../src/index.js'

type PresetRules = Record<string, 'error' | 'warn'>

interface ModuleUnderTest {
  directory: string
  namespace: string
  plugin: ESLint.Plugin & { rules: NonNullable<ESLint.Plugin['rules']> }
  presets: { minimal: PresetRules, recommended: PresetRules }
  rules: (options?: { preset?: 'minimal' | 'recommended' | false, rules?: Record<string, any> }) => Record<string, any>
  config: (options?: any) => Record<string, any>
  fixable: string[]
}

const MODULES: ModuleUnderTest[] = [
  {
    directory: 'nuxt-ui',
    namespace: '@nustack/nuxt-ui',
    plugin: nuxtUiPlugin,
    presets: NUXT_UI_PRESET_RULES,
    rules: nuxtUiRules,
    config: nuxtUiConfig,
    fixable: ['no-deprecated-components', 'no-deprecated-model-modifiers'],
  },
  {
    directory: 'nuxt-image',
    namespace: '@nustack/nuxt-image',
    plugin: nuxtImagePlugin,
    presets: NUXT_IMAGE_PRESET_RULES,
    rules: nuxtImageRules,
    config: nuxtImageConfig,
    fixable: [],
  },
]

describe.each(MODULES)('$namespace', (module) => {
  const ruleNames = Object.keys(module.plugin.rules)

  it('puts every registered rule in `recommended`', () => {
    const recommended = Object.keys(module.presets.recommended)
    expect(recommended.toSorted()).toEqual(ruleNames.toSorted())
    expect(new Set(recommended).size).toBe(recommended.length)
  })

  it('keeps `minimal` a strict subset of `recommended`, errors only', () => {
    for (const [name, level] of Object.entries(module.presets.minimal)) {
      expect(level, name).toBe('error')
      expect(module.presets.recommended[name], name).toBe('error')
    }
    const extra = ruleNames.filter(name => !(name in module.presets.minimal))
    for (const name of extra)
      expect(module.rules()[`${module.namespace}/${name}`], name).toBe('warn')
  })

  it('documents every registered rule', () => {
    const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8')
    for (const name of ruleNames) {
      expect(existsSync(new URL(`../src/rules/${module.directory}/${name}/index.md`, import.meta.url)), name).toBe(true)
      expect(readme, name).toContain(`[\`${name}\`]`)
    }
  })

  it('gives every rule a description, a docs URL and messages', () => {
    for (const [name, rule] of Object.entries(module.plugin.rules)) {
      expect(rule.meta?.docs?.description, name).toBeTruthy()
      expect(rule.meta?.docs?.url, name).toContain(`${module.directory}/${name}`)
      expect(Object.keys(rule.meta?.messages ?? {}).length, name).toBeGreaterThan(0)
    }
  })

  it('does not expose a per-rule prefix option', () => {
    for (const [name, rule] of Object.entries(module.plugin.rules)) {
      const schema = rule.meta?.schema
      const first = Array.isArray(schema) ? schema[0] as { properties?: Record<string, unknown> } | undefined : undefined
      expect('prefix' in (first?.properties ?? {}), name).toBe(false)
    }
  })

  it('marks the fixable rules as such and no others', () => {
    const fixable = ruleNames.filter(name => module.plugin.rules[name]?.meta?.fixable !== undefined)
    expect(fixable.toSorted()).toEqual(module.fixable.toSorted())
  })

  it('defaults to `recommended` and honours `preset: false`', () => {
    expect(module.rules()).toEqual(module.rules({ preset: 'recommended' }))
    for (const name of Object.keys(module.presets.minimal))
      expect(module.rules({ preset: 'minimal' })[`${module.namespace}/${name}`], name).toBe('error')
    expect(module.rules({ preset: false })).toEqual({})
  })

  it('scopes the rules to SFCs and declares no parser', () => {
    const config = module.config({ preset: 'minimal' })
    expect(config.files).toEqual(['**/*.vue'])
    expect(config.plugins).toHaveProperty(module.namespace)
    expect(config.rules).toEqual(module.rules({ preset: 'minimal' }))
    expect(config.languageOptions).toBeUndefined()
  })
})

describe('nuxt UI presets', () => {
  it('keeps `minimal` free of the preferences', () => {
    const extra = Object.keys(nuxtUiPlugin.rules).filter(name => !(name in NUXT_UI_PRESET_RULES.minimal))
    expect(extra.every(name => name.startsWith('prefer-')), extra.join(', ')).toBe(true)
  })
})

describe('nuxtUiRules', () => {
  it('merges explicitly listed rules without changing their options', () => {
    const rules = nuxtUiRules({
      preset: false,
      rules: {
        '@nustack/nuxt-ui/require-avatar-alt': 'error',
        '@nustack/nuxt-ui/require-form-control-label': ['warn'],
        '@nustack/nuxt-ui/prefer-u-form-controls': ['warn', { controls: {} }],
        'vue/no-unused-vars': 'error',
      },
    })

    expect(rules['@nustack/nuxt-ui/require-avatar-alt']).toBe('error')
    expect(rules['@nustack/nuxt-ui/require-form-control-label']).toEqual(['warn'])
    expect(rules['@nustack/nuxt-ui/prefer-u-form-controls']).toEqual(['warn', { controls: {} }])
    expect(rules['vue/no-unused-vars']).toBe('error')
  })

  it('lets an override win over the preset entry for the same rule', () => {
    const rules = nuxtUiRules({ rules: { '@nustack/nuxt-ui/require-u-app': 'off' } })
    expect(rules['@nustack/nuxt-ui/require-u-app']).toBe('off')
  })

  it('leaves unknown rule ids alone', () => {
    const listed = { '@nustack/nuxt-ui/require-avatar-alt': 'error' } as const
    expect(nuxtUiRules({ preset: false, rules: listed })).toEqual(listed)
  })
})

describe('config settings', () => {
  it('enables Nuxt UI with its config-level prefix', () => {
    expect(nuxtUiConfig({ prefix: 'Nu' }).settings).toEqual({
      '@nustack/nuxt-ui': { enabled: true, prefix: 'Nu' },
    })
  })

  it('keeps standalone Image independent unless Nuxt UI is explicit', () => {
    expect(nuxtImageConfig().settings).toBeUndefined()
    expect(nuxtImageConfig({ nuxtUi: {} }).settings).toEqual({
      '@nustack/nuxt-ui': { enabled: true, prefix: 'U' },
    })
    expect(nuxtImageConfig({ nuxtUi: { prefix: 'Nu' } }).settings).toEqual({
      '@nustack/nuxt-ui': { enabled: true, prefix: 'Nu' },
    })
  })
})

describe('nuxtEcosystemConfigs', () => {
  it('only returns configs for explicitly enabled modules', () => {
    expect(nuxtEcosystemConfigs({})).toEqual([])
    expect(nuxtEcosystemConfigs({ nuxtUi: true }).map(config => config.name)).toEqual(['nustack/nuxt-ui'])
    expect(nuxtEcosystemConfigs({ nuxtUi: true, nuxtImage: true }).map(config => config.name)).toEqual(['nustack/nuxt-ui', 'nustack/nuxt-image'])
    expect(nuxtEcosystemConfigs({ nuxtUi: false, nuxtImage: false })).toEqual([])
  })

  it('does not silently disable every module when called without options from JavaScript', () => {
    expect(() => (nuxtEcosystemConfigs as any)()).toThrow('requires an object listing the modules to enable')
  })

  it('passes each module its own options', () => {
    const [nuxtImage] = nuxtEcosystemConfigs({ nuxtImage: { preset: 'minimal' } })
    expect(Object.keys(nuxtImage?.rules ?? {})).toEqual(Object.keys(nuxtImageRules({ preset: 'minimal' })))
  })

  it('exposes every namespace through `nuxtEcosystemPlugins`', () => {
    expect(Object.keys(nuxtEcosystemPlugins).toSorted()).toEqual(['@nustack/nuxt-image', '@nustack/nuxt-ui'])
  })
})
