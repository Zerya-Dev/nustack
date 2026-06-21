import type { ESLint, Linter, Rule } from 'eslint'
import { eslintCompatPlugin } from '@oxlint/plugins'
import { noExplicitAutoImport as rawNoExplicitAutoImport } from './rules/no-explicit-auto-import/index.js'
import { noProcessEnv as rawNoProcessEnv } from './rules/no-process-env/index.js'
import { noSecretInPublicRuntimeConfig as rawNoSecretInPublicRuntimeConfig } from './rules/no-secret-in-public-runtimeconfig/index.js'

const plugin = eslintCompatPlugin({
  meta: {
    name: '@nustack/nuxt',
  },
  rules: {
    'no-explicit-auto-import': rawNoExplicitAutoImport,
    'no-process-env': rawNoProcessEnv,
    'no-secret-in-public-runtimeconfig': rawNoSecretInPublicRuntimeConfig,
  },
}) as unknown as ESLint.Plugin & {
  configs: {
    recommended: Linter.Config
  }
}

plugin.configs = {
  recommended: {
    plugins: {
      '@nustack/nuxt': plugin,
    },
    rules: {
      '@nustack/nuxt/no-explicit-auto-import': 'error',
      '@nustack/nuxt/no-process-env': 'warn',
      '@nustack/nuxt/no-secret-in-public-runtimeconfig': 'error',
    },
  },
}

export const noExplicitAutoImport: Rule.RuleModule = plugin.rules!['no-explicit-auto-import'] as Rule.RuleModule
export const noProcessEnv: Rule.RuleModule = plugin.rules!['no-process-env'] as Rule.RuleModule
export const noSecretInPublicRuntimeConfig: Rule.RuleModule = plugin.rules!['no-secret-in-public-runtimeconfig'] as Rule.RuleModule
export default plugin
