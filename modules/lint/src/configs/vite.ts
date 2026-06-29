import type { Linter } from 'eslint'
import type { ConcernContext, ConcernOptions } from './types'
import { viteConfigs } from '@nustackjs/lint-plugin-vite'
import { resolveConcernRules, variantAtLeast } from './types'

export interface ViteConcernOptions extends ConcernOptions {}

/**
 * Vite build/runtime conventions that are useful outside Nuxt too. All file
 * scoping lives in the plugin's `viteConfigs` factory; this concern only maps
 * nustack's variant/options onto it.
 */
export function viteConfig(
  axes: ConcernContext,
  opts: ViteConcernOptions = {},
): Linter.Config[] {
  return viteConfigs({
    variant: variantAtLeast(axes.variant, 'recommended') ? 'recommended' : 'minimal',
    rules: resolveConcernRules(opts),
  })
}
