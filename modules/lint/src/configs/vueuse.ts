import type { Linter } from 'eslint'
import type { ConcernContext, ConcernOptions } from './types'
import vueUsePlugin from '@nustackjs/lint-plugin-vueuse'
import { resolveConcernRules, variantAtLeast } from './types'

const GLOB_APP = ['**/*.vue', '**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}']
const IGNORE_NON_CLIENT = [
  '**/server/**',
  '**/scripts/**',
  '**/packages/**',
  '**/*.{config,test,spec}.*',
  '**/*.d.ts',
]

export interface VueUseConcernOptions extends ConcernOptions {}

const recommendedRules = vueUsePlugin.configs.recommended.rules ?? {}

/**
 * VueUse conventions. These are script-level rules today, so they run in plain TS
 * files and in Vue SFC script/script setup blocks through vue-eslint-parser.
 */
export function vueUseConfig(
  axes: ConcernContext,
  opts: VueUseConcernOptions = {},
): Linter.Config[] {
  const rules = resolveConcernRules(opts)
  const configs: Linter.Config[] = []

  if (variantAtLeast(axes.variant, 'recommended')) {
    configs.push({
      name: 'nustack/vueuse',
      files: GLOB_APP,
      ignores: IGNORE_NON_CLIENT,
      plugins: { '@nustack/vueuse': vueUsePlugin },
      rules: recommendedRules,
    })
  }

  if (Object.keys(rules).length) {
    configs.push({
      name: 'nustack/vueuse/rules',
      files: GLOB_APP,
      ignores: IGNORE_NON_CLIENT,
      rules,
    })
  }

  return configs
}
