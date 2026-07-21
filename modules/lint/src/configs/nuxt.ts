import type { Linter } from 'eslint'
import type { NustackContext } from '../context'
import type { ConcernOptions } from '../utils'
import { nuxtConfigs } from '@nustackjs/lint-plugin-nuxt'
import { resolveConcernRules } from '../utils'

export type NuxtConcernOptions = ConcernOptions

export function nuxtConfig(
  context: NustackContext,
  options: NuxtConcernOptions = {},
): Linter.Config[] {
  return nuxtConfigs({
    variant: 'recommended',
    autoImports: context.autoImports,
    components: context.components,
    rules: resolveConcernRules(options),
  })
}
