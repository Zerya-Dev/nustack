import type { ESLint, Linter, Rule } from 'eslint'
import { eslintCompatPlugin } from '@oxlint/plugins'
import { noClientSecretPattern as rawNoClientSecretPattern } from './rules/env/no-client-secret-pattern/index.js'
import { noPublicSrcImport as rawNoPublicSrcImport } from './rules/assets/no-public-src-import/index.js'

const plugin = eslintCompatPlugin({
  meta: {
    name: '@nustack/vite',
  },
  rules: {
    'no-public-src-import': rawNoPublicSrcImport,
    'no-client-secret-pattern': rawNoClientSecretPattern,
  },
}) as unknown as ESLint.Plugin & {
  configs: {
    /** App-source-scoped rule set, ready to spread into a flat config. */
    recommended: Linter.Config[]
  }
}

const pluginRef = { '@nustack/vite': plugin }

/**
 * File globs the rules are scoped to. The plugin owns the scoping so consumers
 * spread {@link viteConfigs} (or `configs.recommended`) without re-declaring where
 * the rules apply. These are client/build concerns, so server/tooling paths are
 * excluded.
 */
export const APP_GLOB = ['**/*.vue', '**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}']
export const APP_IGNORES = [
  '**/server/**',
  '**/scripts/**',
  '**/packages/**',
  '**/*.{config,test,spec}.*',
  '**/*.d.ts',
]

/** Options for {@link viteConfigs}. */
export interface ViteConfigsOptions {
  /** Cumulative variant; `minimal` ships nothing, `recommended` (default) the rule set. */
  variant?: 'minimal' | 'recommended'
  /** Extra rule overrides, merged onto the app-source scope. */
  rules?: Linter.RulesRecord
}

/**
 * The single source of truth for *where* these rules run: file-scoped flat-config
 * objects on app source only. Consumers pass extra `rules` here instead of
 * re-declaring any globs themselves.
 */
export function viteConfigs(options: ViteConfigsOptions = {}): Linter.Config[] {
  const { variant = 'recommended', rules } = options
  const configs: Linter.Config[] = []

  if (variant !== 'minimal') {
    configs.push({
      name: 'nustack/vite',
      files: APP_GLOB,
      ignores: APP_IGNORES,
      plugins: pluginRef,
      rules: {
        '@nustack/vite/no-public-src-import': 'warn',
        '@nustack/vite/no-client-secret-pattern': 'error',
      },
    })
  }

  if (rules && Object.keys(rules).length) {
    configs.push({
      name: 'nustack/vite/rules',
      files: APP_GLOB,
      ignores: APP_IGNORES,
      plugins: pluginRef,
      rules,
    })
  }

  return configs
}

plugin.configs = {
  recommended: viteConfigs(),
}

export const noClientSecretPattern: Rule.RuleModule = plugin.rules!['no-client-secret-pattern'] as Rule.RuleModule
export const noPublicSrcImport: Rule.RuleModule = plugin.rules!['no-public-src-import'] as Rule.RuleModule
export default plugin
