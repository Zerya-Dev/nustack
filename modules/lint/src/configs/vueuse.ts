import type { Linter } from 'eslint'
import type { ConcernContext, ConcernOptions } from './types'
import { nustackPlugin } from '../plugin'
import { variantAtLeast } from './types'

const GLOB_APP = ['**/*.vue', '**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}']

export interface VueUseConcernOptions extends ConcernOptions {}

/**
 * VueUse conventions. These are script-level rules today, so they run in plain TS
 * files and in Vue SFC script/script setup blocks through vue-eslint-parser.
 */
export function vueUseConfig(
  axes: ConcernContext,
  opts: VueUseConcernOptions = {},
): Linter.Config[] {
  const configs: Linter.Config[] = []

  if (variantAtLeast(axes.variant, 'recommended')) {
    configs.push({
      name: 'nustack/vueuse',
      files: GLOB_APP,
      plugins: { nustack: nustackPlugin },
      rules: {
        'nustack/vueuse/no-nuxt-auto-import-collision': 'warn',
        'nustack/vueuse/no-namespace-import': 'warn',
        'nustack/vueuse/prefer-use-observers': 'warn',
        'nustack/vueuse/prefer-use-storage': 'warn',
        'nustack/vueuse/prefer-use-timers': 'warn',
        'nustack/vueuse/prefer-useclipboard': 'warn',
        'nustack/vueuse/prefer-useevent-listener': 'warn',
        'nustack/vueuse/prefer-usewindow-size': 'warn',
      },
    })
  }

  if (opts.overrides) {
    configs.push({
      name: 'nustack/vueuse/overrides',
      files: GLOB_APP,
      rules: opts.overrides,
    })
  }

  return configs
}
