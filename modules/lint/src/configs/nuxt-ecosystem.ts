import type { Linter } from 'eslint'
import type { NustackContext } from '../context'
import type { ConcernOptions, ConcernToggle } from '../utils'
import { nuxtUiConfigs } from '@nustackjs/lint-plugin-nuxt-ecosystem'
import { isEnabled, resolveConcernRules, subOptions } from '../utils'

/** Nuxt UI component-preference rules. */
export interface NuxtUiConcernOptions extends ConcernOptions {}

/**
 * Per-module toggles for the Nuxt ecosystem concern: `true`/object enables (and tunes),
 * `false` disables, default auto-gates on detection. New modules (Pinia, Content, ...)
 * are added as sibling toggles rather than new `configs/` files.
 */
export interface NuxtEcosystemOptions {
  /** Nuxt UI component preferences. Auto-gated on `@nuxt/ui` detection. */
  nuxtUi?: ConcernToggle<NuxtUiConcernOptions>
}

/** `false` disables the whole ecosystem; an object tunes each module in depth. */
export type NuxtEcosystemToggle = ConcernToggle<NuxtEcosystemOptions>

/**
 * The Nuxt-ecosystem concern.
 *
 * @see @nustackjs/lint-plugin-nuxt-ecosystem
 */
export function nuxtEcosystemConfig(
  ctx: NustackContext,
  options: NuxtEcosystemOptions = {},
): Linter.Config[] {
  const configs: Linter.Config[] = []

  if (isEnabled(options.nuxtUi, ctx.modules.nuxtUi))
    configs.push(...nuxtUiConfigs({ rules: resolveConcernRules(subOptions(options.nuxtUi)) }))

  return configs
}
