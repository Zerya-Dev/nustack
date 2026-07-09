import type { Linter } from 'eslint'
import type { NustackContext } from '../context'
import type { ConcernOptions } from '../utils'
import { defu } from 'defu'
import betterTailwind from 'eslint-plugin-better-tailwindcss'
import { getDefaultSelectors } from 'eslint-plugin-better-tailwindcss/defaults'
import { SelectorKind } from 'eslint-plugin-better-tailwindcss/types'
import { resolveConcernRules } from '../utils'

const GLOB_CODE = ['**/*.vue', '**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}']

export interface TailwindConcernOptions extends ConcernOptions {
  /** Override the auto-detected Tailwind entry point (`@import "tailwindcss"`). */
  entryPoint?: string
  /** Enable `enforce-consistent-line-wrapping` — opt-in, higher-false-positive. @default false */
  lineWrapping?: boolean
  /**
   * Extra `better-tailwindcss` shared settings, merged over the defaults — e.g.
   * `selectors`, `tailwindConfig`. Rule options (printWidth etc.) go
   * through `rules`, not here.
   */
  settings?: Record<string, unknown>
}

/**
 * Tailwind v4 class sorting/correctness via better-tailwindcss, gated on a detected entry
 * point. When `@nuxt/ui` is present, the `:ui` object prop is added so class strings
 * inside `:ui="{ base: 'px-2' }"` are sorted and validated too. Rule severities are the
 * only nustack opinion; everything else is tunable via `rules` and `settings`.
 */
export function tailwindConfig(
  ctx: NustackContext,
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
        ...(opts.lineWrapping ? { 'better-tailwindcss/enforce-consistent-line-wrapping': 'warn' } : {}),
        'better-tailwindcss/no-unknown-classes': 'warn',
        'better-tailwindcss/no-conflicting-classes': 'error',
        'better-tailwindcss/no-duplicate-classes': 'error',
        ...rules,
      },
    },
  ]
}
