import type { Plugin } from '@oxlint/plugins'
import type { ESLint, Linter } from 'eslint'
import { eslintCompatPlugin } from '@oxlint/plugins'
import { nuxtUiSettings } from '../nuxt-ui/components.js'
import { noAssetsSrc } from './no-assets-src/index.js'
import { preferNuxtImg } from './prefer-nuxt-img/index.js'
import { requireImageAlt } from './require-image-alt/index.js'

export const nuxtImagePlugin = eslintCompatPlugin({
  meta: {
    name: '@nustackjs/lint-plugin-nuxt-ecosystem/nuxt-image',
  },
  rules: {
    'no-assets-src': noAssetsSrc,
    'prefer-nuxt-img': preferNuxtImg,
    'require-image-alt': requireImageAlt,
  },
}) as Plugin & ESLint.Plugin

export type NuxtImagePreset = 'minimal' | 'recommended'
export interface NuxtImageRulesOptions {
  preset?: NuxtImagePreset | false
  rules?: Linter.RulesRecord
}
export interface NuxtImageConfigOptions extends NuxtImageRulesOptions {
  nuxtUi?: false | { prefix?: string }
}

const NUXT_IMAGE_CORRECTNESS_RULES = {
  'no-assets-src': 'error',
  'require-image-alt': 'error',
} as const satisfies Record<string, 'error'>

const NUXT_IMAGE_CONVENTION_RULES = {
  'prefer-nuxt-img': 'warn',
} as const satisfies Record<string, 'warn'>

export const NUXT_IMAGE_PRESET_RULES = {
  minimal: NUXT_IMAGE_CORRECTNESS_RULES,
  recommended: { ...NUXT_IMAGE_CORRECTNESS_RULES, ...NUXT_IMAGE_CONVENTION_RULES },
} as const

export const nuxtImagePlugins: Record<string, ESLint.Plugin> = { '@nustack/nuxt-image': nuxtImagePlugin }

export function nuxtImageRules(options: NuxtImageRulesOptions = {}): Linter.RulesRecord {
  const { preset = 'recommended', rules = {} } = options
  const configured = preset === false
    ? {}
    : Object.fromEntries(Object.entries(NUXT_IMAGE_PRESET_RULES[preset]).map(([name, level]) => [`@nustack/nuxt-image/${name}`, level]))
  return { ...configured, ...rules }
}

export function nuxtImageConfig(options: NuxtImageConfigOptions = {}): Linter.Config {
  const { nuxtUi, ...rulesOptions } = options
  const config: Linter.Config = {
    name: 'nustack/nuxt-image',
    files: ['**/*.vue'],
    plugins: nuxtImagePlugins,
    rules: nuxtImageRules(rulesOptions),
  }
  return nuxtUi
    ? { ...config, settings: nuxtUiSettings(nuxtUi.prefix) }
    : config
}
