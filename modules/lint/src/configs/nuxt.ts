import type { Linter } from 'eslint'
import type { NustackContext } from '../context'
import type { ConcernContext, ConcernOptions } from './types'
import nuxtPlugin from '@nustackjs/lint-plugin-nuxt'
import { resolveConcernRules, variantAtLeast } from './types'

/** App source globs (config files / server handled per-rule via `ignores`). */
const GLOB_APP = ['**/*.vue', '**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}']
const GLOB_NUXT_CONFIG = ['**/nuxt.config.{ts,js,mjs,mts,cjs,cts}']
const IGNORE_NON_APP = [
  '**/server/**',
  '**/scripts/**',
  '**/packages/**',
  '**/*.{config,test,spec}.*',
  '**/*.d.ts',
]

export interface NuxtConcernOptions extends ConcernOptions {}

const recommendedRules = nuxtPlugin.configs.recommended.rules ?? {}

/**
 * Core Nuxt conventions — runtimeConfig safety, no `process.env` in app code, and
 * (folded in here, not a top-level concern) auto-import enforcement. Each config
 * object re-declares the shared `nustack` plugin instance so its rules resolve
 * regardless of which other objects match a file.
 *
 * Variant ladder:
 * - `minimal`: only the security floor (`no-secret-in-public-runtimeconfig`).
 * - `recommended`+: adds `no-process-env` and `no-explicit-auto-import`.
 */
export function nuxtConfig(
  ctx: NustackContext,
  axes: ConcernContext,
  opts: NuxtConcernOptions = {},
): Linter.Config[] {
  const rules = resolveConcernRules(opts)
  const configs: Linter.Config[] = [
    {
      // Secret leakage is a correctness/security floor — on at every variant.
      name: 'nustack/nuxt/runtime-config',
      files: GLOB_NUXT_CONFIG,
      plugins: { '@nustack/nuxt': nuxtPlugin },
      rules: {
        '@nustack/nuxt/no-secret-in-public-runtimeconfig': 'error',
      },
    },
  ]

  if (variantAtLeast(axes.variant, 'recommended')) {
    configs.push(
      {
        name: 'nustack/nuxt/auto-imports',
        files: GLOB_APP,
        ignores: IGNORE_NON_APP,
        plugins: { '@nustack/nuxt': nuxtPlugin },
        rules: {
          ...recommendedRules,
          '@nustack/nuxt/no-process-env': 'off',
          '@nustack/nuxt/no-secret-in-public-runtimeconfig': 'off',
          '@nustack/nuxt/no-explicit-auto-import': ['error', {
            imports: ctx.autoImports,
            components: ctx.components,
          }],
        },
      },
      {
        name: '@nustack/nuxt/no-process-env',
        files: GLOB_APP,
        // process.env is legitimate in build/server config; only flag app code.
        ignores: IGNORE_NON_APP,
        plugins: { '@nustack/nuxt': nuxtPlugin },
        rules: {
          '@nustack/nuxt/no-process-env': recommendedRules['@nustack/nuxt/no-process-env'],
        },
      },
    )
  }

  if (Object.keys(rules).length) {
    configs.push({
      name: 'nustack/nuxt/rules',
      files: GLOB_APP,
      rules,
    })
  }

  return configs
}
