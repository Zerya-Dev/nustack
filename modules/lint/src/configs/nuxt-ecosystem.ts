import type { Linter } from 'eslint'
import type { NustackContext } from '../context'
import type { ConcernContext, ConcernOptions, ConcernToggle } from './types'
import { nuxtUiConfigs } from '@nustackjs/lint-plugin-nuxt-ecosystem'
import { isEnabled, resolveConcernRules, subOptions } from './types'

/** Nuxt UI component-preference rules. */
export interface NuxtUiConcernOptions extends ConcernOptions {}

/**
 * Per-module toggles for the Nuxt ecosystem concern. Each third-party Nuxt module
 * gets its own toggle here — `true`/object enables (and tunes) it, `false` turns it
 * off, and the default auto-gates it on detection. New ecosystem modules (Pinia,
 * Content, …) are added as sibling toggles rather than as new `configs/` files.
 */
export interface NuxtEcosystemOptions {
  /** Nuxt UI component preferences. Auto-gated on `@nuxt/ui` detection. */
  nuxtUi?: ConcernToggle<NuxtUiConcernOptions>
}

/** `false` disables the whole ecosystem; an object tunes each module in depth. */
export type NuxtEcosystemToggle = ConcernToggle<NuxtEcosystemOptions>

/**
 * The Nuxt-module ecosystem concern. Sources all its rules from the single
 * `@nustackjs/lint-plugin-nuxt-ecosystem` package and gates each module on its own
 * detection flag — all file scoping lives in the plugin's per-module `*Configs`
 * factories; this concern only forwards user rule overrides. The Vue
 * parser/services these rules rely on come from the antfu base; Tailwind class
 * sorting/validation lives in the separate tailwind concern.
 */
export function nuxtEcosystemConfig(
  ctx: NustackContext,
  _axes: ConcernContext,
  options: NuxtEcosystemOptions = {},
): Linter.Config[] {
  const configs: Linter.Config[] = []

  if (isEnabled(options.nuxtUi, ctx.modules.nuxtUi))
    configs.push(...nuxtUiConfigs({ rules: resolveConcernRules(subOptions(options.nuxtUi)) }))

  return configs
}
