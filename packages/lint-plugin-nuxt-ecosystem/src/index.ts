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
    ui: Linter.Config
    recommended: Linter.Config
  }
}

const uiRules = {
  '@nustack/nuxt-ui/prefer-u-button': 'warn',
  '@nustack/nuxt-ui/prefer-u-form-controls': 'warn',
} satisfies Linter.RulesRecord

plugin.configs = {
  ui: {
    plugins: {
      '@nustack/nuxt-ui': plugin,
    },
    rules: uiRules,
  },
  recommended: {
    plugins: {
      '@nustack/nuxt-ui': plugin,
    },
    // Union preset for every ecosystem sub-pack shipped by this package.
    rules: {
      ...uiRules,
    },
  },
}

export const preferUButton: Rule.RuleModule = plugin.rules!['prefer-u-button'] as Rule.RuleModule
export const preferUFormControls: Rule.RuleModule = plugin.rules!['prefer-u-form-controls'] as Rule.RuleModule
export default plugin
