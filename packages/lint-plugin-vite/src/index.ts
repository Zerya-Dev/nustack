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
    recommended: Linter.Config
  }
}

plugin.configs = {
  recommended: {
    plugins: {
      '@nustack/vite': plugin,
    },
    rules: {
      '@nustack/vite/no-public-src-import': 'warn',
      '@nustack/vite/no-client-secret-pattern': 'error',
    },
  },
}

export const noClientSecretPattern: Rule.RuleModule = plugin.rules!['no-client-secret-pattern'] as Rule.RuleModule
export const noPublicSrcImport: Rule.RuleModule = plugin.rules!['no-public-src-import'] as Rule.RuleModule
export default plugin
