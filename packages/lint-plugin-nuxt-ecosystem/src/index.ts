import type { ESLint, Linter } from 'eslint'
import type { NuxtImageConfigOptions } from './rules/nuxt-image/module.js'
import type { NuxtUiConfigOptions } from './rules/nuxt-ui/module.js'
import { nuxtImageConfig, nuxtImagePlugins } from './rules/nuxt-image/module.js'
import { nuxtUiConfig, nuxtUiPlugins } from './rules/nuxt-ui/module.js'

export * from './rules/nuxt-image/module.js'
export * from './rules/nuxt-ui/module.js'

export interface NuxtEcosystemOptions {
  /** Enable Nuxt UI with defaults (`true`) or module-specific options. */
  nuxtUi?: NuxtUiConfigOptions | boolean
  /** Enable Nuxt Image with defaults (`true`) or module-specific options. */
  nuxtImage?: NuxtImageConfigOptions | boolean
}

/** Builds configs only for explicitly enabled modules. Dependency detection lives in `@nustackjs/lint`. */
export function nuxtEcosystemConfigs(options: NuxtEcosystemOptions): Linter.Config[] {
  if (!options)
    throw new TypeError('nuxtEcosystemConfigs() requires an object listing the modules to enable')

  const configs: Linter.Config[] = []

  if (options.nuxtUi)
    configs.push(nuxtUiConfig(options.nuxtUi === true ? {} : options.nuxtUi))
  if (options.nuxtImage)
    configs.push(nuxtImageConfig(options.nuxtImage === true ? {} : options.nuxtImage))

  return configs
}

export const nuxtEcosystemPlugins: Record<string, ESLint.Plugin> = {
  ...nuxtUiPlugins,
  ...nuxtImagePlugins,
}
