import type { NuxtImagePreset, NuxtUiPreset } from '@nustackjs/lint-plugin-nuxt-ecosystem'
import type { Linter } from 'eslint'
import type { NustackContext } from '../context'
import type { ConcernOptions, ConcernToggle } from '../utils'
import { nuxtImageConfig, nuxtUiConfig } from '@nustackjs/lint-plugin-nuxt-ecosystem'
import { isEnabled, resolveConcernRules, subOptions } from '../utils'

export interface NuxtUiConcernOptions extends ConcernOptions {
  /** Rule preset from the Nuxt UI integration. @default 'recommended' */
  preset?: NuxtUiPreset | false
}

export interface NuxtImageConcernOptions extends ConcernOptions {
  /** Rule preset from the Nuxt Image integration. @default 'recommended' */
  preset?: NuxtImagePreset | false
}

/** Options for detected Nuxt ecosystem integrations. */
export interface NuxtEcosystemOptions {
  /** Nuxt UI component preferences. Auto-gated on `@nuxt/ui` detection. */
  nuxtUi?: ConcernToggle<NuxtUiConcernOptions>
  /** Nuxt Image usage rules. Auto-gated on `@nuxt/image` detection. */
  nuxtImage?: ConcernToggle<NuxtImageConcernOptions>
}

export type NuxtEcosystemToggle = ConcernToggle<NuxtEcosystemOptions>

/**
 * One config per supported module, each included only when that module is installed. Detection
 * lives here (the context knows what the project has); the plugin owns the rules and presets.
 */
export function nuxtEcosystemConfig(
  context: NustackContext,
  options: NuxtEcosystemOptions = {},
): Linter.Config[] {
  const configs: Linter.Config[] = []

  if (isEnabled(options.nuxtUi, context.modules.nuxtUi)) {
    const moduleOptions = subOptions(options.nuxtUi)
    configs.push(nuxtUiConfig({
      prefix: context.nuxtUi.prefix,
      preset: moduleOptions.preset,
      rules: resolveConcernRules(moduleOptions),
    }))
  }

  if (isEnabled(options.nuxtImage, context.modules.nuxtImage)) {
    const moduleOptions = subOptions(options.nuxtImage)
    configs.push(nuxtImageConfig({
      preset: moduleOptions.preset,
      rules: resolveConcernRules(moduleOptions),
    }))
  }

  return configs
}
