import type { Linter } from 'eslint'
import type { ConcernOptions } from '../utils'
import { viteConfigs } from '@nustackjs/lint-plugin-vite'
import { resolveConcernRules } from '../utils'

export type ViteConcernOptions = ConcernOptions

export function viteConfig(
  options: ViteConcernOptions = {},
): Linter.Config[] {
  return viteConfigs({
    variant: 'recommended',
    rules: resolveConcernRules(options),
  })
}
