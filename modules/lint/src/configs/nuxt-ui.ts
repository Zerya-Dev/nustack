import type { Linter } from 'eslint'
import type { ConcernContext, ConcernOptions } from './types'
import { nustackPlugin } from '../plugin'

export interface NuxtUiConcernOptions extends ConcernOptions {}

/**
 * Nuxt UI component-preference rules — active only when `@nuxt/ui` is detected.
 * The Vue parser/services these rules rely on come from the antfu base (which
 * parses `**\/*.vue`); Tailwind class sorting/validation lives in the separate
 * tailwind concern.
 */
export function nuxtUiConfig(
  _ctx: unknown,
  _axes: ConcernContext,
  opts: NuxtUiConcernOptions = {},
): Linter.Config[] {
  return [
    {
      name: 'nustack/nuxt-ui',
      files: ['**/*.vue'],
      plugins: { nustack: nustackPlugin },
      rules: {
        'nustack/nuxt-ui/prefer-u-button': 'warn',
        'nustack/nuxt-ui/prefer-u-form-controls': 'warn',
        ...opts.overrides,
      },
    },
  ]
}
