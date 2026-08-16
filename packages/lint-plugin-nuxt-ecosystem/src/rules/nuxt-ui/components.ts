import type { Context } from '@oxlint/plugins'
import type { ComponentMatcher } from '../../utils/component-matcher.js'
import { createComponentMatcher } from '../../utils/component-matcher.js'

export const NUXT_UI_MODULE = /^(?:@nuxt\/ui|#ui|#components)(?:\/|$)/

export const NUXT_UI_SETTINGS_KEY = '@nustack/nuxt-ui'
const DEFAULT_PREFIX = 'U'

interface NuxtUiSettings {
  enabled?: boolean
  prefix?: string
}

function resolveNuxtUiSettings(context: Context): NuxtUiSettings | undefined {
  const settings = (context as Context & { settings?: Record<string, unknown> }).settings?.[NUXT_UI_SETTINGS_KEY]
  return typeof settings === 'object' && settings !== null ? settings as NuxtUiSettings : undefined
}

export function nuxtUiPrefix(context: Context): string {
  return resolveNuxtUiSettings(context)?.prefix ?? DEFAULT_PREFIX
}

export function hasNuxtUi(context: Context): boolean {
  return resolveNuxtUiSettings(context)?.enabled === true
}

export function nuxtUiSettings(prefix = DEFAULT_PREFIX): Record<string, NuxtUiSettings> {
  return { [NUXT_UI_SETTINGS_KEY]: { enabled: true, prefix } }
}

export function createNuxtUiMatcher(context: Context): ComponentMatcher {
  return createComponentMatcher(context, {
    module: NUXT_UI_MODULE,
    prefix: nuxtUiPrefix(context),
  })
}
