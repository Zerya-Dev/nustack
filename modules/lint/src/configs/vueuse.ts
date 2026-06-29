import type { Linter } from 'eslint'
import type { ConcernContext, ConcernOptions } from './types'
import { vueUseConfigs } from '@nustackjs/lint-plugin-vueuse'
import { resolveConcernRules, variantAtLeast } from './types'

export interface VueUseConcernOptions extends ConcernOptions {}

/**
 * VueUse conventions. These are script-level rules today, so they run in plain TS
 * files and in Vue SFC script/script setup blocks through vue-eslint-parser. All
 * file scoping lives in the plugin's `vueUseConfigs` factory; this concern only
 * maps nustack's variant/options onto it.
 */
export function vueUseConfig(
  axes: ConcernContext,
  opts: VueUseConcernOptions = {},
): Linter.Config[] {
  return vueUseConfigs({
    variant: variantAtLeast(axes.variant, 'recommended') ? 'recommended' : 'minimal',
    rules: resolveConcernRules(opts),
  })
}
