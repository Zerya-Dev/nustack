import type { Linter } from 'eslint'
import type { ConcernContext, ConcernOptions } from './types'
import vitePlugin from '@nustackjs/lint-plugin-vite'
import { resolveConcernRules, variantAtLeast } from './types'

const GLOB_APP = ['**/*.vue', '**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}']
const IGNORE_NON_CLIENT = [
  '**/server/**',
  '**/scripts/**',
  '**/packages/**',
  '**/*.{config,test,spec}.*',
  '**/*.d.ts',
]

export interface ViteConcernOptions extends ConcernOptions {}

const recommendedRules = vitePlugin.configs.recommended.rules ?? {}

/** Vite build/runtime conventions that are useful outside Nuxt too. */
export function viteConfig(
  axes: ConcernContext,
  opts: ViteConcernOptions = {},
): Linter.Config[] {
  const rules = resolveConcernRules(opts)
  const configs: Linter.Config[] = []

  if (variantAtLeast(axes.variant, 'recommended')) {
    configs.push({
      name: 'nustack/vite',
      files: GLOB_APP,
      ignores: IGNORE_NON_CLIENT,
      plugins: { '@nustack/vite': vitePlugin },
      rules: recommendedRules,
    })
  }

  if (Object.keys(rules).length) {
    configs.push({
      name: 'nustack/vite/rules',
      files: GLOB_APP,
      ignores: IGNORE_NON_CLIENT,
      rules,
    })
  }

  return configs
}
