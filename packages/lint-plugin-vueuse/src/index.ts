import type { ESLint, Linter, Rule } from 'eslint'
import { eslintCompatPlugin } from '@oxlint/plugins'
import { noNamespaceImport as noNamespaceImportRule } from './rules/no-namespace-import/index.js'
import { noNuxtAutoImportCollision as noNuxtAutoImportCollisionRule } from './rules/no-nuxt-auto-import-collision/index.js'
import { preferUseClipboard as preferUseClipboardRule } from './rules/prefer-use-clipboard/index.js'
import { preferUseEventListener as preferUseEventListenerRule } from './rules/prefer-use-event-listener/index.js'
import { preferUseObservers as preferUseObserversRule } from './rules/prefer-use-observers/index.js'
import { preferUseStorage as preferUseStorageRule } from './rules/prefer-use-storage/index.js'
import { preferUseTimers as preferUseTimersRule } from './rules/prefer-use-timers/index.js'
import { preferUseWindowSize as preferUseWindowSizeRule } from './rules/prefer-use-window-size/index.js'

const plugin = eslintCompatPlugin({
  meta: {
    name: '@nustack/vueuse',
  },
  rules: {
    'no-namespace-import': noNamespaceImportRule,
    'no-nuxt-auto-import-collision': noNuxtAutoImportCollisionRule,
    'prefer-use-clipboard': preferUseClipboardRule,
    'prefer-use-event-listener': preferUseEventListenerRule,
    'prefer-use-observers': preferUseObserversRule,
    'prefer-use-storage': preferUseStorageRule,
    'prefer-use-timers': preferUseTimersRule,
    'prefer-use-window-size': preferUseWindowSizeRule,
  },
}) as unknown as ESLint.Plugin & {
  configs: {
    /** App-source-scoped rule set, ready to spread into a flat config. */
    recommended: Linter.Config[]
  }
}

const pluginRef = { '@nustack/vueuse': plugin }

export const APP_GLOB = ['**/*.vue', '**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}']
export const APP_IGNORES = [
  '**/server/**',
  '**/scripts/**',
  '**/packages/**',
  '**/*.{config,test,spec}.*',
  '**/*.d.ts',
]

export interface VueUseConfigsOptions {
  /** Cumulative variant; `minimal` ships nothing, `recommended` (default) the rule set. */
  variant?: 'minimal' | 'recommended'
  /** Extra rule overrides, merged onto the app-source scope. */
  rules?: Linter.RulesRecord
}

/** Returns app-source-scoped VueUse flat configs. */
export function vueUseConfigs(options: VueUseConfigsOptions = {}): Linter.Config[] {
  const { variant = 'recommended', rules } = options
  const configs: Linter.Config[] = []

  if (variant !== 'minimal') {
    configs.push({
      name: 'nustack/vueuse',
      files: APP_GLOB,
      ignores: APP_IGNORES,
      plugins: pluginRef,
      rules: {
        '@nustack/vueuse/no-nuxt-auto-import-collision': 'warn',
        '@nustack/vueuse/no-namespace-import': 'warn',
        '@nustack/vueuse/prefer-use-observers': 'warn',
        '@nustack/vueuse/prefer-use-storage': 'warn',
        '@nustack/vueuse/prefer-use-timers': 'warn',
        '@nustack/vueuse/prefer-use-clipboard': 'warn',
        '@nustack/vueuse/prefer-use-event-listener': 'warn',
        '@nustack/vueuse/prefer-use-window-size': 'warn',
      },
    })
  }

  if (rules && Object.keys(rules).length) {
    configs.push({
      name: 'nustack/vueuse/rules',
      files: APP_GLOB,
      ignores: APP_IGNORES,
      plugins: pluginRef,
      rules,
    })
  }

  return configs
}

plugin.configs = {
  recommended: vueUseConfigs(),
}

export const noNuxtAutoImportCollision: Rule.RuleModule = plugin.rules!['no-nuxt-auto-import-collision'] as Rule.RuleModule
export const noNamespaceImport: Rule.RuleModule = plugin.rules!['no-namespace-import'] as Rule.RuleModule
export const preferUseClipboard: Rule.RuleModule = plugin.rules!['prefer-use-clipboard'] as Rule.RuleModule
export const preferUseEventListener: Rule.RuleModule = plugin.rules!['prefer-use-event-listener'] as Rule.RuleModule
export const preferUseObservers: Rule.RuleModule = plugin.rules!['prefer-use-observers'] as Rule.RuleModule
export const preferUseStorage: Rule.RuleModule = plugin.rules!['prefer-use-storage'] as Rule.RuleModule
export const preferUseTimers: Rule.RuleModule = plugin.rules!['prefer-use-timers'] as Rule.RuleModule
export const preferUseWindowSize: Rule.RuleModule = plugin.rules!['prefer-use-window-size'] as Rule.RuleModule
export default plugin
