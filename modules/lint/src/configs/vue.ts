import type { Linter } from 'eslint'
import type { ConcernOptions } from '../utils'
import { resolveConcernRules } from '../utils'

export interface VueConcernOptions extends ConcernOptions {}

/**
 * SFC conventions. The `vue` plugin and parser come from the antfu base (`vue: true`),
 * so this concern only layers rule choices on top.
 */
export function vueConfig(
  opts: VueConcernOptions = {},
): Linter.Config[] {
  const rules = resolveConcernRules(opts)
  return [
    {
      name: 'nustack/vue',
      files: ['**/*.vue'],
      rules: {
        'vue/block-lang': ['error', {
          script: { lang: 'ts', allowNoLang: false },
        }],
        'vue/define-emits-declaration': ['warn', 'type-literal'],
        'vue/define-props-destructuring': ['warn', {
          destructure: 'always',
        }],
        'vue/html-comment-content-newline': 'warn',
        'vue/html-comment-indent': 'warn',
        'vue/no-duplicate-class-names': 'warn',
        'vue/no-empty-component-block': 'warn',
        'vue/no-import-compiler-macros': 'error',
        ...rules,
      },
    },
  ]
}
