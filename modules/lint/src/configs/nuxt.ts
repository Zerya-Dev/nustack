import type { Linter } from 'eslint'
import type { NustackContext } from '../context'
import type { ConcernOptions } from '../utils'
import { nuxtConfigs } from '@nustackjs/lint-plugin-nuxt'
import { resolveConcernRules } from '../utils'

export interface NuxtConcernOptions extends ConcernOptions {}

/**
 * Core Nuxt conventions.
 *
 * @see @nustackjs/lint-plugin-nuxt
 */
export function nuxtConfig(
  ctx: NustackContext,
  opts: NuxtConcernOptions = {},
): Linter.Config[] {
  return nuxtConfigs({
    variant: 'recommended',
    autoImports: ctx.autoImports,
    components: ctx.components,
    rules: resolveConcernRules(opts),
  })
}
