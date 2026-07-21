import type { Linter } from 'eslint'
import type { NustackContext } from '../context'
import type { ConcernOptions } from '../utils'
import { resolveConcernRules } from '../utils'

export type VueConcernOptions = ConcernOptions

/**
 * SFC conventions. The `vue` plugin and parser come from the antfu base (`vue: true`),
 * so this concern only layers rule choices on top.
 */
export function vueConfig(
  context: NustackContext,
  options: VueConcernOptions = {},
): Linter.Config[] {
  const rules = resolveConcernRules(options)
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
        'vue/html-button-has-type': 'warn',
        'vue/component-api-style': ['error', ['script-setup']],
        'vue/define-props-declaration': ['error', 'type-based'],
        'vue/no-duplicate-class-names': 'warn',
        'vue/no-empty-component-block': 'warn',
        'vue/no-import-compiler-macros': 'error',
        'vue/no-potential-component-option-typo': 'warn',
        'vue/no-ref-object-reactivity-loss': 'error',
        'vue/no-template-target-blank': 'error',
        'vue/no-root-v-if': 'warn',
        // Tailwind projects should keep static styles in utility classes.
        ...(context.tailwind.detected ? { 'vue/no-static-inline-styles': 'warn' } : {}),
        'vue/no-unused-emit-declarations': 'error',
        'vue/no-use-v-else-with-v-for': 'error',
        'vue/prefer-define-options': 'error',
        'vue/prefer-use-template-ref': 'error',
        'vue/require-macro-variable-name': 'warn',
        'vue/require-typed-object-prop': 'error',
        'vue/require-typed-ref': 'error',
        // Class ordering belongs to better-tailwindcss.
        'vue/static-class-names-order': 'off',
        'vue/v-if-else-key': 'warn',
        ...rules,
      },
    },
  ]
}
