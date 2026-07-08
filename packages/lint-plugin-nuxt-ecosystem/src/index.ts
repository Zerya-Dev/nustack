import type { ESLint, Linter, Rule } from 'eslint'
import { eslintCompatPlugin } from '@oxlint/plugins'
import { noDeprecatedComponents as rawNoDeprecatedComponents } from './rules/nuxt-ui/no-deprecated-components/index.js'
import { noDeprecatedModelModifiers as rawNoDeprecatedModelModifiers } from './rules/nuxt-ui/no-deprecated-model-modifiers/index.js'
import { preferUButton as rawPreferUButton } from './rules/nuxt-ui/prefer-u-button/index.js'
import { preferUFormControls as rawPreferUFormControls } from './rules/nuxt-ui/prefer-u-form-controls/index.js'
import { preferULink as rawPreferULink } from './rules/nuxt-ui/prefer-u-link/index.js'
import { preferUTable as rawPreferUTable } from './rules/nuxt-ui/prefer-u-table/index.js'

const plugin = eslintCompatPlugin({
  meta: {
    name: '@nustack/nuxt-ui',
  },
  rules: {
    'prefer-u-button': rawPreferUButton,
    'prefer-u-form-controls': rawPreferUFormControls,
    'prefer-u-link': rawPreferULink,
    'prefer-u-table': rawPreferUTable,
    'no-deprecated-components': rawNoDeprecatedComponents,
    'no-deprecated-model-modifiers': rawNoDeprecatedModelModifiers,
  },
}) as unknown as ESLint.Plugin & {
  configs: {
    /** The Nuxt UI pack — Vue-SFC-scoped, ready to spread into a flat config. */
    ui: Linter.Config[]
    /** Union of every ecosystem sub-pack shipped here (today: just Nuxt UI). */
    recommended: Linter.Config[]
  }
}

const pluginRef = { '@nustack/nuxt-ui': plugin }

/**
 * Files the Nuxt UI rules apply to. These are component-preference rules that read
 * Vue SFC templates, so the scoping lives here in the plugin — consumers (including
 * `@nustackjs/lint`) spread {@link nuxtUiConfigs} (or `configs.ui`) and never
 * re-declare, or drift from, where the rules run.
 */
export const NUXT_UI_GLOB = ['**/*.vue']

/** Options for {@link nuxtUiConfigs}. */
export interface NuxtUiConfigsOptions {
  /** Cumulative variant; `minimal` ships nothing, `recommended` (default) the rule set. */
  variant?: 'minimal' | 'recommended'
  /** Extra rule overrides, merged onto the Vue-SFC scope. */
  rules?: Linter.RulesRecord
}

/**
 * The single source of truth for *where* the Nuxt UI rules run: file-scoped flat
 * configs on Vue SFCs only.
 *
 * Nuxt UI is the first pack in the Nuxt-module *ecosystem* this package hosts.
 * Future packs (Pinia, Content, ...) ship their own `<module>Configs` factory and
 * `@nustack/<module>` plugin domain alongside this one — each detected, gated, and
 * file-scoped independently — rather than being merged into a single
 * ecosystem-wide rule bag, since no two modules share the same files or detection.
 */
export function nuxtUiConfigs(options: NuxtUiConfigsOptions = {}): Linter.Config[] {
  const { variant = 'recommended', rules } = options
  const configs: Linter.Config[] = []

  if (variant !== 'minimal') {
    configs.push({
      name: 'nustack/nuxt-ui',
      files: NUXT_UI_GLOB,
      plugins: pluginRef,
      rules: {
        '@nustack/nuxt-ui/prefer-u-button': 'warn',
        '@nustack/nuxt-ui/prefer-u-form-controls': 'warn',
        '@nustack/nuxt-ui/prefer-u-link': 'warn',
        '@nustack/nuxt-ui/prefer-u-table': 'warn',
        '@nustack/nuxt-ui/no-deprecated-components': 'warn',
        '@nustack/nuxt-ui/no-deprecated-model-modifiers': 'warn',
      },
    })
  }

  if (rules && Object.keys(rules).length) {
    configs.push({
      name: 'nustack/nuxt-ui/rules',
      files: NUXT_UI_GLOB,
      plugins: pluginRef,
      rules,
    })
  }

  return configs
}

plugin.configs = {
  ui: nuxtUiConfigs(),
  // Union preset for every ecosystem sub-pack shipped by this package.
  recommended: nuxtUiConfigs(),
}

export const preferUButton: Rule.RuleModule = plugin.rules!['prefer-u-button'] as Rule.RuleModule
export const preferUFormControls: Rule.RuleModule = plugin.rules!['prefer-u-form-controls'] as Rule.RuleModule
export const preferULink: Rule.RuleModule = plugin.rules!['prefer-u-link'] as Rule.RuleModule
export const preferUTable: Rule.RuleModule = plugin.rules!['prefer-u-table'] as Rule.RuleModule
export const noDeprecatedComponents: Rule.RuleModule = plugin.rules!['no-deprecated-components'] as Rule.RuleModule
export const noDeprecatedModelModifiers: Rule.RuleModule = plugin.rules!['no-deprecated-model-modifiers'] as Rule.RuleModule
export default plugin
