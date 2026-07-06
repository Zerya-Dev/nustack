import type { Linter } from 'eslint'
import type { NustackContext } from '../context'
import type { ConcernContext, ConcernOptions } from './types'
import { defu } from 'defu'
import betterTailwind from 'eslint-plugin-better-tailwindcss'
import { getDefaultSelectors } from 'eslint-plugin-better-tailwindcss/defaults'
import { SelectorKind } from 'eslint-plugin-better-tailwindcss/types'
import { resolveConcernRules, variantAtLeast } from './types'

const GLOB_CODE = ['**/*.vue', '**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}']

export interface TailwindConcernOptions extends ConcernOptions {
  /** Override the auto-detected Tailwind entry point (`@import "tailwindcss"`). */
  entryPoint?: string
  /**
   * Extra `better-tailwindcss` shared settings, merged over the defaults — e.g.
   * `selectors`, `tailwindConfig`. Rule options (printWidth etc.) go
   * through `rules`, not here.
   */
  settings?: Record<string, unknown>
}

/**
 * Tailwind v4 class sorting/correctness via better-tailwindcss, gated on a detected
 * Tailwind entry point. When `@nuxt/ui` is present, the `:ui` object prop is added so
 * class strings inside `:ui="{ base: 'px-2' }"` are sorted and validated too.
 *
 * The rule severities below are the only NuStack opinion; everything else is plain
 * better-tailwindcss config, tunable directly via `rules` (rule options) and
 * `settings` (shared plugin settings).
 */
export function tailwindConfig(
  ctx: NustackContext,
  axes: ConcernContext,
  opts: TailwindConcernOptions = {},
): Linter.Config[] {
  const rules = resolveConcernRules(opts)
  const uiSelectors = ctx.modules.nuxtUi
    ? [
        {
          kind: SelectorKind.Attribute,
          name: '^(?::|v-bind:)ui$',
          match: [{ type: 'objectValues' }],
        },
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
          selectors: [...getDefaultSelectors(), ...uiSelectors],
        }),
      },
      rules: {
        'better-tailwindcss/enforce-consistent-class-order': 'warn',
        ...(variantAtLeast(axes.variant, 'pedantic')
          ? { 'better-tailwindcss/enforce-consistent-line-wrapping': 'warn' }
          : {}),
        'better-tailwindcss/no-unknown-classes': 'warn',
        'better-tailwindcss/no-conflicting-classes': 'error',
        'better-tailwindcss/no-duplicate-classes': 'error',
        ...rules,
      },
    },
  ]
}
