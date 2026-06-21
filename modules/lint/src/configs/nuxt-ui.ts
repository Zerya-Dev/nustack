import type { Linter } from 'eslint'
import type { ConcernContext, ConcernOptions } from './types'
import nuxtEcosystemPlugin from '@nustackjs/lint-plugin-nuxt-ecosystem'
import { resolveConcernRules } from './types'

export interface NuxtUiConcernOptions extends ConcernOptions {}

const uiRules = nuxtEcosystemPlugin.configs.ui.rules ?? {}

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
  const rules = resolveConcernRules(opts)
  return [
    {
      name: 'nustack/nuxt-ui',
      files: ['**/*.vue'],
      plugins: { '@nustack/nuxt-ui': nuxtEcosystemPlugin },
      rules: {
        ...uiRules,
        ...rules,
      },
    },
  ]
}
