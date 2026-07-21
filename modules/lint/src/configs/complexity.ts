import type { Linter } from 'eslint'

const GLOB_CODE = ['**/*.vue', '**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}']
const GLOB_VUE = ['**/*.vue']

const BUDGET = {
  complexity: 20,
  maxLinesPerFunction: 200,
  maxParams: 5,
  maxStatements: 30,
  vueMaxProps: 15,
  vueMaxLinesPerBlock: 300,
}

/** Returns complexity and size limits when enabled. */
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
