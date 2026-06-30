import type { ESLint, Linter, Rule } from 'eslint'
import { eslintCompatPlugin } from '@oxlint/plugins'
import { preferUButton as rawPreferUButton } from './rules/nuxt-ui/prefer-u-button/index.js'
import { preferUFormControls as rawPreferUFormControls } from './rules/nuxt-ui/prefer-u-form-controls/index.js'

const plugin = eslintCompatPlugin({
  meta: {
    name: '@nustack/nuxt-ui',
  },
  rules: {
    'prefer-u-button': rawPreferUButton,
    'prefer-u-form-controls': rawPreferUFormControls,
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
 * Future packs (Pinia, Content, …) ship their own `<module>Configs` factory and
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
export default plugin
