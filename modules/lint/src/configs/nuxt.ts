import type { Linter } from 'eslint'
import type { NustackContext } from '../context'
import type { ConcernContext, ConcernOptions } from './types'
import { nuxtConfigs } from '@nustackjs/lint-plugin-nuxt'
import { resolveConcernRules, variantAtLeast } from './types'

export interface NuxtConcernOptions extends ConcernOptions {}

/**
 * Core Nuxt conventions. All rule policy — which rules, at what severity, scoped
 * to which files — lives in the plugin's `nuxtConfigs` factory. This concern only
 * translates nustack's axes/options into that factory's inputs: the active variant,
 * the detected project context (`ctx.autoImports`/`components`) the plugin can't
 * know statically, and any user rule overrides. No file globs are declared here.
 */
export function nuxtConfig(
  ctx: NustackContext,
  axes: ConcernContext,
  opts: NuxtConcernOptions = {},
): Linter.Config[] {
  return nuxtConfigs({
    variant: variantAtLeast(axes.variant, 'recommended') ? 'recommended' : 'minimal',
    autoImports: ctx.autoImports,
    components: ctx.components,
    rules: resolveConcernRules(opts),
  })
}
