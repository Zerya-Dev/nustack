import type { ESLint, Linter, Rule } from 'eslint'
import { eslintCompatPlugin } from '@oxlint/plugins'
import { headTagStyle as headTagStyleRule } from './rules/head-tag-style/index.js'
import { modulesOrder as modulesOrderRule } from './rules/modules-order/index.js'
import { noAsyncDataAfterMount as noAsyncDataAfterMountRule } from './rules/no-async-data-after-mount/index.js'
import { noDeprecatedModules as noDeprecatedModulesRule } from './rules/no-deprecated-modules/index.js'
import { noEmptyAsyncDataKey as noEmptyAsyncDataKeyRule } from './rules/no-empty-async-data-key/index.js'
import { noExplicitAutoImport as noExplicitAutoImportRule } from './rules/no-explicit-auto-import/index.js'
import { noFetchDuringSetup as noFetchDuringSetupRule } from './rules/no-fetch-during-setup/index.js'
import { noIgnoredConfigFiles as noIgnoredConfigFilesRule } from './rules/no-ignored-config-files/index.js'
import { noInvalidStatusText as noInvalidStatusTextRule } from './rules/no-invalid-status-text/index.js'
import { noProcessEnv as noProcessEnvRule } from './rules/no-process-env/index.js'
import { noProxyingUnsafeHeaders as noProxyingUnsafeHeadersRule } from './rules/no-proxying-unsafe-headers/index.js'
import { noRefOutsideSetup as noRefOutsideSetupRule } from './rules/no-ref-outside-setup/index.js'
import { noSecretInPublicRuntimeConfig as noSecretInPublicRuntimeConfigRule } from './rules/no-secret-in-public-runtimeconfig/index.js'
import { noUnserializableUseState as noUnserializableUseStateRule } from './rules/no-unserializable-use-state/index.js'
import { preferLazyDataOption as preferLazyDataOptionRule } from './rules/prefer-lazy-data-option/index.js'
import { preserveDefaultTsconfig as preserveDefaultTsconfigRule } from './rules/preserve-default-tsconfig/index.js'

/** Where `modules` / `runtimeConfig` rules apply. */
export const NUXT_CONFIG_GLOB = ['**/nuxt.config.{ts,js,mjs,mts,cjs,cts}']
/** External configuration files that Nuxt ignores in favour of `nuxt.config`. */
export const IGNORED_NUXT_CONFIG_GLOB = [
  '**/nitro.config.{js,mjs,cjs,ts,mts,cts}',
  '**/postcss.config.{js,mjs,cjs,ts,mts,cts}',
  '**/vite.config.{js,mjs,cjs,ts,mts,cts}',
  '**/webpack.config.{js,mjs,cjs,ts,mts,cts}',
]
const ROOT_IGNORED_NUXT_CONFIG_GLOB = [
  'nitro.config.{js,mjs,cjs,ts,mts,cts}',
  'postcss.config.{js,mjs,cjs,ts,mts,cts}',
  'vite.config.{js,mjs,cjs,ts,mts,cts}',
  'webpack.config.{js,mjs,cjs,ts,mts,cts}',
]
/** App source, where auto-import / `process.env` rules apply. */
export const APP_GLOB = ['**/*.vue', '**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}']
/** Non-app paths excluded from app-source rules (build/server/tooling). */
export const APP_IGNORES = [
  '**/server/**',
  '**/scripts/**',
  '**/packages/**',
  '**/*.{config,test,spec}.*',
  '**/*.d.ts',
]
/** Nuxt runtime source, including Nitro server handlers. */
export const NUXT_RUNTIME_GLOB = APP_GLOB
/** Non-runtime paths excluded from Nuxt runtime rules. */
export const NUXT_RUNTIME_IGNORES = [
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
    'head-tag-style': headTagStyleRule,
    'modules-order': modulesOrderRule,
    'no-async-data-after-mount': noAsyncDataAfterMountRule,
    'no-deprecated-modules': noDeprecatedModulesRule,
    'no-empty-async-data-key': noEmptyAsyncDataKeyRule,
    'no-explicit-auto-import': noExplicitAutoImportRule,
    'no-fetch-during-setup': noFetchDuringSetupRule,
    'no-ignored-config-files': noIgnoredConfigFilesRule,
    'no-invalid-status-text': noInvalidStatusTextRule,
    'no-process-env': noProcessEnvRule,
    'no-proxying-unsafe-headers': noProxyingUnsafeHeadersRule,
    'no-ref-outside-setup': noRefOutsideSetupRule,
    'no-secret-in-public-runtimeconfig': noSecretInPublicRuntimeConfigRule,
    'no-unserializable-use-state': noUnserializableUseStateRule,
    'prefer-lazy-data-option': preferLazyDataOptionRule,
    'preserve-default-tsconfig': preserveDefaultTsconfigRule,
  },
}) as unknown as ESLint.Plugin & {
  configs: {
    /** Security floor only, safe to drop into any project. */
    minimal: Linter.Config[]
    /** Full opinionated set, each rule scoped to where it makes sense. */
    recommended: Linter.Config[]
  }
}

const pluginRef = { '@nustack/nuxt': plugin }

export interface NuxtConfigsOptions {
  /**
   * Cumulative opinion variant (defaults to `'recommended'`):
   * - `minimal`: only the security floor (`no-secret-in-public-runtimeconfig`).
   * - `recommended`: adds `modules` correctness + app-source hygiene.
   */
  variant?: 'minimal' | 'recommended'
  /** Auto-imported identifiers, tunes `no-explicit-auto-import`. */
  autoImports?: string[]
  /** Auto-imported components, tunes `no-explicit-auto-import`. */
  components?: string[]
  /** Constructors handled by project-specific Nuxt payload reducers. */
  payloadSerializableConstructors?: string[]
  /** Nuxt project roots, relative to the ESLint working directory. */
  projectDirectories?: string[]
  /** Extra rule overrides, merged onto the app-source scope. */
  rules?: Linter.RulesRecord
}

/** Returns file-scoped Nuxt flat configs. */
export function nuxtConfigs(options: NuxtConfigsOptions = {}): Linter.Config[] {
  const {
    variant = 'recommended',
    autoImports,
    components,
    payloadSerializableConstructors = [],
    projectDirectories = ['.'],
    rules,
  } = options
  const externalConfigGlobs = projectDirectories.flatMap((directory) => {
    const prefix = directory.replaceAll('\\', '/').replace(/^\.\//, '').replace(/\/$/, '')
    return ROOT_IGNORED_NUXT_CONFIG_GLOB.map(glob => prefix && prefix !== '.' ? `${prefix}/${glob}` : glob)
  })

  const configs: Linter.Config[] = [
    {
      // Secret leakage is a correctness/security floor, on at every variant.
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
        // Nuxt ignores these files; their configuration belongs in `nuxt.config`.
        name: 'nustack/nuxt/external-config',
        files: externalConfigGlobs,
        plugins: pluginRef,
        rules: {
          '@nustack/nuxt/no-ignored-config-files': 'error',
        },
      },
      {
        // `modules` array correctness, registration order and deprecated modules.
        name: 'nustack/nuxt/modules',
        files: NUXT_CONFIG_GLOB,
        plugins: pluginRef,
        rules: {
          '@nustack/nuxt/modules-order': 'error',
          '@nustack/nuxt/no-deprecated-modules': 'error',
          '@nustack/nuxt/preserve-default-tsconfig': 'error',
        },
      },
      {
        // Error APIs are shared by the Vue app and Nitro server handlers.
        name: 'nustack/nuxt/error-handling',
        files: NUXT_RUNTIME_GLOB,
        ignores: NUXT_RUNTIME_IGNORES,
        plugins: pluginRef,
        rules: {
          '@nustack/nuxt/no-invalid-status-text': 'error',
        },
      },
      {
        // App-source hygiene.
        name: 'nustack/nuxt/app',
        files: APP_GLOB,
        ignores: APP_IGNORES,
        plugins: pluginRef,
        rules: {
          '@nustack/nuxt/head-tag-style': 'error',
          '@nustack/nuxt/no-async-data-after-mount': 'error',
          '@nustack/nuxt/no-empty-async-data-key': 'error',
          '@nustack/nuxt/no-fetch-during-setup': 'error',
          '@nustack/nuxt/no-process-env': 'warn',
          '@nustack/nuxt/no-proxying-unsafe-headers': 'error',
          '@nustack/nuxt/no-ref-outside-setup': 'error',
          '@nustack/nuxt/no-unserializable-use-state': payloadSerializableConstructors.length
            ? ['error', { allowConstructors: payloadSerializableConstructors }]
            : 'error',
          '@nustack/nuxt/no-explicit-auto-import': hasContext ? ['error', autoImportOptions] : 'error',
          '@nustack/nuxt/prefer-lazy-data-option': 'error',
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

export const headTagStyle: Rule.RuleModule = plugin.rules!['head-tag-style'] as Rule.RuleModule
export const modulesOrder: Rule.RuleModule = plugin.rules!['modules-order'] as Rule.RuleModule
export const noAsyncDataAfterMount: Rule.RuleModule = plugin.rules!['no-async-data-after-mount'] as Rule.RuleModule
export const noDeprecatedModules: Rule.RuleModule = plugin.rules!['no-deprecated-modules'] as Rule.RuleModule
export const noEmptyAsyncDataKey: Rule.RuleModule = plugin.rules!['no-empty-async-data-key'] as Rule.RuleModule
export const noExplicitAutoImport: Rule.RuleModule = plugin.rules!['no-explicit-auto-import'] as Rule.RuleModule
export const noFetchDuringSetup: Rule.RuleModule = plugin.rules!['no-fetch-during-setup'] as Rule.RuleModule
export const noIgnoredConfigFiles: Rule.RuleModule = plugin.rules!['no-ignored-config-files'] as Rule.RuleModule
export const noInvalidStatusText: Rule.RuleModule = plugin.rules!['no-invalid-status-text'] as Rule.RuleModule
export const noProcessEnv: Rule.RuleModule = plugin.rules!['no-process-env'] as Rule.RuleModule
export const noProxyingUnsafeHeaders: Rule.RuleModule = plugin.rules!['no-proxying-unsafe-headers'] as Rule.RuleModule
export const noRefOutsideSetup: Rule.RuleModule = plugin.rules!['no-ref-outside-setup'] as Rule.RuleModule
export const noSecretInPublicRuntimeConfig: Rule.RuleModule = plugin.rules!['no-secret-in-public-runtimeconfig'] as Rule.RuleModule
export const noUnserializableUseState: Rule.RuleModule = plugin.rules!['no-unserializable-use-state'] as Rule.RuleModule
export const preferLazyDataOption: Rule.RuleModule = plugin.rules!['prefer-lazy-data-option'] as Rule.RuleModule
export const preserveDefaultTsconfig: Rule.RuleModule = plugin.rules!['preserve-default-tsconfig'] as Rule.RuleModule
export default plugin
