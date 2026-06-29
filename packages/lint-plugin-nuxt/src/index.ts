import type { ESLint, Linter, Rule } from 'eslint'
import { eslintCompatPlugin } from '@oxlint/plugins'
import { modulesOrder as rawModulesOrder } from './rules/modules-order/index.js'
import { noDeprecatedModules as rawNoDeprecatedModules } from './rules/no-deprecated-modules/index.js'
import { noExplicitAutoImport as rawNoExplicitAutoImport } from './rules/no-explicit-auto-import/index.js'
import { noProcessEnv as rawNoProcessEnv } from './rules/no-process-env/index.js'
import { noSecretInPublicRuntimeConfig as rawNoSecretInPublicRuntimeConfig } from './rules/no-secret-in-public-runtimeconfig/index.js'

/**
 * File globs the rules are scoped to. The plugin owns every scoping decision so
 * consumers (including `@nustackjs/lint`) never re-declare — and drift from — these
 * patterns: they call {@link nuxtConfigs} and get fully file-scoped configs back.
 */
/** Where `modules` / `runtimeConfig` rules apply. */
export const NUXT_CONFIG_GLOB = ['**/nuxt.config.{ts,js,mjs,mts,cjs,cts}']
/** App source — where auto-import / `process.env` rules apply. */
export const APP_GLOB = ['**/*.vue', '**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}']
/** Non-app paths excluded from app-source rules (build/server/tooling). */
export const APP_IGNORES = [
  '**/server/**',
  '**/scripts/**',
  '**/packages/**',
  '**/*.{config,test,spec}.*',
  '**/*.d.ts',
]

const plugin = eslintCompatPlugin({
  meta: {
    name: '@nustack/nuxt',
  },
  rules: {
    'modules-order': rawModulesOrder,
    'no-deprecated-modules': rawNoDeprecatedModules,
    'no-explicit-auto-import': rawNoExplicitAutoImport,
    'no-process-env': rawNoProcessEnv,
    'no-secret-in-public-runtimeconfig': rawNoSecretInPublicRuntimeConfig,
  },
}) as unknown as ESLint.Plugin & {
  configs: {
    /** Security floor only — safe to drop into any project. */
    minimal: Linter.Config[]
    /** Full opinionated set, each rule scoped to where it makes sense. */
    recommended: Linter.Config[]
  }
}

const pluginRef = { '@nustack/nuxt': plugin }

/** Options for {@link nuxtConfigs}. */
export interface NuxtConfigsOptions {
  /**
   * Cumulative opinion variant (defaults to `'recommended'`):
   * - `minimal`: only the security floor (`no-secret-in-public-runtimeconfig`).
   * - `recommended`: adds `modules` correctness + app-source hygiene.
   */
  variant?: 'minimal' | 'recommended'
  /** Auto-imported identifiers — tunes `no-explicit-auto-import`. */
  autoImports?: string[]
  /** Auto-imported components — tunes `no-explicit-auto-import`. */
  components?: string[]
  /** Extra rule overrides, merged onto the app-source scope. */
  rules?: Linter.RulesRecord
}

/**
 * The single source of truth for *where* each rule runs. Returns an array of
 * file-scoped flat-config objects (not one bag of rules), so a rule never lints a
 * file it wasn't meant for: `modules`/`runtimeConfig` rules only touch
 * `nuxt.config.*`, app rules only touch app source. Consumers pass their project
 * context (auto-imports/components) and extra `rules` here instead of re-declaring
 * any globs themselves.
 */
export function nuxtConfigs(options: NuxtConfigsOptions = {}): Linter.Config[] {
  const { variant = 'recommended', autoImports, components, rules } = options

  const configs: Linter.Config[] = [
    {
      // Secret leakage is a correctness/security floor — on at every variant.
      name: 'nustack/nuxt/runtime-config',
      files: NUXT_CONFIG_GLOB,
      plugins: pluginRef,
      rules: {
        '@nustack/nuxt/no-secret-in-public-runtimeconfig': 'error',
      },
    },
  ]

  if (variant !== 'minimal') {
    // Only pass options when there is project context, so a bare consumer keeps
    // the rule's option-less default behaviour (and never trips schema validation).
    const autoImportOptions: { imports?: string[], components?: string[] } = {}
    if (autoImports)
      autoImportOptions.imports = autoImports
    if (components)
      autoImportOptions.components = components
    const hasContext = Object.keys(autoImportOptions).length > 0

    configs.push(
      {
        // `modules` array correctness — registration order and deprecated modules.
        name: 'nustack/nuxt/modules',
        files: NUXT_CONFIG_GLOB,
        plugins: pluginRef,
        rules: {
          '@nustack/nuxt/modules-order': 'error',
          '@nustack/nuxt/no-deprecated-modules': 'error',
        },
      },
      {
        // App-source hygiene.
        name: 'nustack/nuxt/app',
        files: APP_GLOB,
        ignores: APP_IGNORES,
        plugins: pluginRef,
        rules: {
          '@nustack/nuxt/no-process-env': 'warn',
          '@nustack/nuxt/no-explicit-auto-import': hasContext ? ['error', autoImportOptions] : 'error',
        },
      },
    )
  }

  if (rules && Object.keys(rules).length) {
    configs.push({
      name: 'nustack/nuxt/rules',
      files: APP_GLOB,
      plugins: pluginRef,
      rules,
    })
  }

  return configs
}

plugin.configs = {
  minimal: nuxtConfigs({ variant: 'minimal' }),
  recommended: nuxtConfigs(),
}

export const modulesOrder: Rule.RuleModule = plugin.rules!['modules-order'] as Rule.RuleModule
export const noDeprecatedModules: Rule.RuleModule = plugin.rules!['no-deprecated-modules'] as Rule.RuleModule
export const noExplicitAutoImport: Rule.RuleModule = plugin.rules!['no-explicit-auto-import'] as Rule.RuleModule
export const noProcessEnv: Rule.RuleModule = plugin.rules!['no-process-env'] as Rule.RuleModule
export const noSecretInPublicRuntimeConfig: Rule.RuleModule = plugin.rules!['no-secret-in-public-runtimeconfig'] as Rule.RuleModule
export default plugin
