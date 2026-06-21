import type { ESLint, Linter, Rule } from 'eslint'
import { eslintCompatPlugin } from '@oxlint/plugins'
import { noNuxtAutoImportCollision as rawNoNuxtAutoImportCollision } from './rules/no-nuxt-auto-import-collision/index.js'
import { noNamespaceImport as rawNoNamespaceImport } from './rules/no-namespace-import/index.js'
import { preferUseObservers as rawPreferUseObservers } from './rules/prefer-use-observers/index.js'
import { preferUseStorage as rawPreferUseStorage } from './rules/prefer-use-storage/index.js'
import { preferUseTimers as rawPreferUseTimers } from './rules/prefer-use-timers/index.js'
import { preferUseEventListener as rawPreferUseEventListener } from './rules/prefer-useevent-listener/index.js'
import { preferUseClipboard as rawPreferUseClipboard } from './rules/prefer-useclipboard/index.js'
import { preferUseWindowSize as rawPreferUseWindowSize } from './rules/prefer-usewindow-size/index.js'

const plugin = eslintCompatPlugin({
  meta: {
    name: '@nustack/vueuse',
  },
  rules: {
    'no-nuxt-auto-import-collision': rawNoNuxtAutoImportCollision,
    'no-namespace-import': rawNoNamespaceImport,
    'prefer-use-observers': rawPreferUseObservers,
    'prefer-use-storage': rawPreferUseStorage,
    'prefer-use-timers': rawPreferUseTimers,
    'prefer-useclipboard': rawPreferUseClipboard,
    'prefer-useevent-listener': rawPreferUseEventListener,
    'prefer-usewindow-size': rawPreferUseWindowSize,
  },
}) as unknown as ESLint.Plugin & {
  configs: {
    recommended: Linter.Config
  }
}

plugin.configs = {
  recommended: {
    plugins: {
      '@nustack/vueuse': plugin,
    },
    rules: {
      '@nustack/vueuse/no-nuxt-auto-import-collision': 'warn',
      '@nustack/vueuse/no-namespace-import': 'warn',
      '@nustack/vueuse/prefer-use-observers': 'warn',
      '@nustack/vueuse/prefer-use-storage': 'warn',
      '@nustack/vueuse/prefer-use-timers': 'warn',
      '@nustack/vueuse/prefer-useclipboard': 'warn',
      '@nustack/vueuse/prefer-useevent-listener': 'warn',
      '@nustack/vueuse/prefer-usewindow-size': 'warn',
    },
  },
}

export const noNuxtAutoImportCollision: Rule.RuleModule = plugin.rules!['no-nuxt-auto-import-collision'] as Rule.RuleModule
export const noNamespaceImport: Rule.RuleModule = plugin.rules!['no-namespace-import'] as Rule.RuleModule
export const preferUseClipboard: Rule.RuleModule = plugin.rules!['prefer-useclipboard'] as Rule.RuleModule
export const preferUseEventListener: Rule.RuleModule = plugin.rules!['prefer-useevent-listener'] as Rule.RuleModule
export const preferUseObservers: Rule.RuleModule = plugin.rules!['prefer-use-observers'] as Rule.RuleModule
export const preferUseStorage: Rule.RuleModule = plugin.rules!['prefer-use-storage'] as Rule.RuleModule
export const preferUseTimers: Rule.RuleModule = plugin.rules!['prefer-use-timers'] as Rule.RuleModule
export const preferUseWindowSize: Rule.RuleModule = plugin.rules!['prefer-usewindow-size'] as Rule.RuleModule
export default plugin
