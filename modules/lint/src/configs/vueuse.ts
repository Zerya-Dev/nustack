import type { Linter } from 'eslint'
import type { ConcernOptions } from '../utils'
import { vueUseConfigs } from '@nustackjs/lint-plugin-vueuse'
import { resolveConcernRules } from '../utils'

export type VueUseConcernOptions = ConcernOptions

export function vueUseConfig(
  options: VueUseConcernOptions = {},
): Linter.Config[] {
  return vueUseConfigs({
    variant: 'recommended',
    rules: resolveConcernRules(options),
  })
}
