import type { Linter } from 'eslint'
import type { NustackContext } from '../context'
import type { ConcernContext, ConcernOptions } from './types'
import { defu } from 'defu'
import betterTailwind from 'eslint-plugin-better-tailwindcss'
import { getDefaultAttributes, getDefaultCallees } from 'eslint-plugin-better-tailwindcss/api/defaults'
import { MatcherType } from 'eslint-plugin-better-tailwindcss/api/types'
import { variantAtLeast } from './types'

const GLOB_CODE = ['**/*.vue', '**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}']

export interface TailwindConcernOptions extends ConcernOptions {
  /** Override the auto-detected Tailwind entry point (`@import "tailwindcss"`). */
  entryPoint?: string
  /**
   * Extra `better-tailwindcss` shared settings, merged over the defaults — e.g.
   * `attributes`, `callees`, `tailwindConfig`. Rule options (printWidth etc.) go
   * through `overrides`, not here.
   */
  settings?: Record<string, unknown>
}

/**
 * Tailwind v4 class sorting/correctness via better-tailwindcss, gated on a detected
 * Tailwind entry point. When `@nuxt/ui` is present, the `:ui` object prop is added so
 * class strings inside `:ui="{ base: 'px-2' }"` are sorted and validated too.
 *
 * The rule severities below are the only NuStack opinion; everything else is plain
 * better-tailwindcss config, tunable directly via `overrides` (rule options) and
 * `settings` (shared plugin settings).
 */
export function tailwindConfig(
  ctx: NustackContext,
  axes: ConcernContext,
  opts: TailwindConcernOptions = {},
): Linter.Config[] {
  const uiAttributes = ctx.modules.nuxtUi
    ? [
        // Bound `:ui` — better-tailwindcss normalizes it to `v-bind:ui`;
        // the leading `:` in the config name is the signal it does so.
        [':ui', [{ match: MatcherType.ObjectValue }]],
        ['ui', [{ match: MatcherType.ObjectValue }]],
      ]
    : []

  const entryPoint = opts.entryPoint ?? ctx.tailwind.entryPoint

  return [
    {
      name: 'nustack/tailwind',
      files: GLOB_CODE,
      plugins: { 'better-tailwindcss': betterTailwind },
      settings: {
        'better-tailwindcss': defu(opts.settings, {
          ...(entryPoint ? { entryPoint } : {}),
          attributes: [...getDefaultAttributes(), ...uiAttributes],
          callees: getDefaultCallees(),
        }),
      },
      rules: {
        'better-tailwindcss/enforce-consistent-class-order': 'warn',
        ...(variantAtLeast(axes.variant, 'pedantic')
          ? { 'better-tailwindcss/enforce-consistent-line-wrapping': 'warn' }
          : {}),
        'better-tailwindcss/no-unregistered-classes': 'warn',
        'better-tailwindcss/no-conflicting-classes': 'error',
        'better-tailwindcss/no-duplicate-classes': 'error',
        ...opts.overrides,
      },
    },
  ]
}
