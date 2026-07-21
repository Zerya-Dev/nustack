import type { Linter } from 'eslint'
import type { NustackContext } from '../context'
import type { ConcernOptions, ConcernToggle } from '../utils'
import { nuxtUiConfigs } from '@nustackjs/lint-plugin-nuxt-ecosystem'
import { isEnabled, resolveConcernRules, subOptions } from '../utils'

export type NuxtUiConcernOptions = ConcernOptions

/** Options for detected Nuxt ecosystem integrations. */
export interface NuxtEcosystemOptions {
  /** Nuxt UI component preferences. Auto-gated on `@nuxt/ui` detection. */
  nuxtUi?: ConcernToggle<NuxtUiConcernOptions>
}

export type NuxtEcosystemToggle = ConcernToggle<NuxtEcosystemOptions>

export function nuxtEcosystemConfig(
  context: NustackContext,
  options: NuxtEcosystemOptions = {},
): Linter.Config[] {
  return isEnabled(options.nuxtUi, context.modules.nuxtUi)
    ? nuxtUiConfigs({ rules: resolveConcernRules(subOptions(options.nuxtUi)) })
    : []
}
