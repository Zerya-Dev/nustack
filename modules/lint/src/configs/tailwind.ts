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
  /** Enable `enforce-consistent-line-wrapping`, opt-in, higher-false-positive. @default false */
  lineWrapping?: boolean
  /**
   * Extra `better-tailwindcss` shared settings, merged over the defaults, e.g.
   * `selectors`, `tailwindConfig`. Rule options (printWidth etc.) go
   * through `rules`, not here.
   */
  settings?: Record<string, unknown>
}

/** Configures better-tailwindcss for the detected entry point and Nuxt UI selectors. */
export function tailwindConfig(
  context: NustackContext,
  options: TailwindConcernOptions = {},
): Linter.Config[] {
  const rules = resolveConcernRules(options)
  const uiSelectors = context.modules.nuxtUi
    ? [
        {
          kind: SelectorKind.Attribute,
          name: '^(?::|v-bind:)ui$',
          match: [{ type: 'objectValues' }],
        },
      ]
    : []

  const entryPoint = options.entryPoint ?? context.tailwind.entryPoint

  return [
    {
      name: 'nustack/tailwind',
      files: GLOB_CODE,
      plugins: { 'better-tailwindcss': betterTailwind },
      settings: {
        'better-tailwindcss': defu(options.settings, {
          ...(entryPoint ? { entryPoint } : {}),
          selectors: [...getDefaultSelectors(), ...uiSelectors],
        }),
      },
      rules: {
        'better-tailwindcss/enforce-consistent-class-order': 'warn',
        ...(options.lineWrapping ? { 'better-tailwindcss/enforce-consistent-line-wrapping': 'warn' } : {}),
        'better-tailwindcss/no-unknown-classes': 'warn',
        'better-tailwindcss/no-conflicting-classes': 'error',
        'better-tailwindcss/no-duplicate-classes': 'error',
        ...rules,
      },
    },
  ]
}
