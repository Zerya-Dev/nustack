import type { Linter } from 'eslint'
import type { NustackContext } from '../context'
import type { ConcernContext, ConcernOptions } from './types'
import { nustackPlugin } from '../plugin'
import { variantAtLeast } from './types'

/** App source globs (config files / server handled per-rule via `ignores`). */
const GLOB_APP = ['**/*.vue', '**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}']
const GLOB_NUXT_CONFIG = ['**/nuxt.config.{ts,js,mjs,mts,cjs,cts}']

export interface NuxtConcernOptions extends ConcernOptions {}

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
  const configs: Linter.Config[] = [
    {
      // Secret leakage is a correctness/security floor — on at every variant.
      name: 'nustack/nuxt/runtime-config',
      files: GLOB_NUXT_CONFIG,
      plugins: { nustack: nustackPlugin },
      rules: {
        'nustack/nuxt/no-secret-in-public-runtimeconfig': 'error',
      },
    },
  ]

  if (variantAtLeast(axes.variant, 'recommended')) {
    configs.push(
      {
        name: 'nustack/nuxt/auto-imports',
        files: GLOB_APP,
        plugins: { nustack: nustackPlugin },
        rules: {
          'nustack/nuxt/no-explicit-auto-import': ['error', {
            imports: ctx.autoImports,
            components: ctx.components,
          }],
        },
      },
      {
        name: 'nustack/nuxt/no-process-env',
        files: GLOB_APP,
        // process.env is legitimate in build/server config; only flag app code.
        ignores: ['**/server/**', '**/*.config.*'],
        plugins: { nustack: nustackPlugin },
        rules: {
          'nustack/nuxt/no-process-env': 'warn',
        },
      },
    )
  }

  if (opts.overrides) {
    configs.push({
      name: 'nustack/nuxt/overrides',
      files: GLOB_APP,
      rules: opts.overrides,
    })
  }

  return configs
}
