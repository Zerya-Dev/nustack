import type { Linter } from 'eslint'
import type { ConcernOptions } from '../utils'
import { vueUseConfigs } from '@nustackjs/lint-plugin-vueuse'
import { resolveConcernRules } from '../utils'

export interface VueUseConcernOptions extends ConcernOptions {}

/**
 * VueUse conventions.
 *
 * @see @nustackjs/lint-plugin-vueuse
 */
export function vueUseConfig(
  opts: VueUseConcernOptions = {},
): Linter.Config[] {
  return vueUseConfigs({
    variant: 'recommended',
    rules: resolveConcernRules(opts),
  })
}
