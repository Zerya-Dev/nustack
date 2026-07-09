import type { Linter } from 'eslint'

const GLOB_CODE = ['**/*.vue', '**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}']
const GLOB_VUE = ['**/*.vue']

/** Generous thresholds that only flag genuine outliers; tighten per-project via `rules`. */
const BUDGET = {
  complexity: 20,
  maxLinesPerFunction: 200,
  maxParams: 5,
  maxStatements: 30,
  vueMaxProps: 15,
  vueMaxLinesPerBlock: 300,
}

/**
 * Cyclomatic-complexity and size-limit budgets — the opt-in `enforce.complexity` check.
 * Ships nothing unless enabled. Folds size limits and the Vue-specific equivalents into
 * one budget switch rather than several unrelated rule toggles.
 */
export function complexityConfig(enabled: boolean): Linter.Config[] {
  if (!enabled)
    return []

  return [
    {
      name: 'nustack/complexity',
      files: GLOB_CODE,
      rules: {
        'complexity': ['warn', BUDGET.complexity],
        'max-lines-per-function': ['warn', { max: BUDGET.maxLinesPerFunction, skipBlankLines: true, skipComments: true }],
        'max-params': ['warn', BUDGET.maxParams],
        'max-statements': ['warn', BUDGET.maxStatements],
      },
    },
    {
      name: 'nustack/complexity/vue',
      files: GLOB_VUE,
      rules: {
        'vue/max-props': ['warn', { maxProps: BUDGET.vueMaxProps }],
        'vue/max-lines-per-block': ['warn', { script: BUDGET.vueMaxLinesPerBlock, template: BUDGET.vueMaxLinesPerBlock }],
      },
    },
  ]
}
