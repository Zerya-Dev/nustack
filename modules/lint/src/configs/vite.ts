import type { Linter } from 'eslint'
import type { ConcernOptions } from '../utils'
import { viteConfigs } from '@nustackjs/lint-plugin-vite'
import { resolveConcernRules } from '../utils'

export interface ViteConcernOptions extends ConcernOptions {}

/**
 * Vite build/runtime conventions.
 *
 * @see @nustackjs/lint-plugin-vite
 */
export function viteConfig(
  opts: ViteConcernOptions = {},
): Linter.Config[] {
  return viteConfigs({
    variant: 'recommended',
    rules: resolveConcernRules(opts),
  })
}
