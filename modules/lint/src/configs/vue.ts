import type { Linter } from 'eslint'
import type { ConcernContext, ConcernOptions } from './types'
import { resolveConcernRules, variantAtLeast } from './types'

export interface VueConcernOptions extends ConcernOptions {}

/**
 * SFC conventions. The `vue` plugin itself is provided by the antfu base (it
 * enables `vue: true`), so this concern only layers rule choices on top — no
 * plugin re-registration, no parser wiring (antfu already sets the Vue parser for
 * `**\/*.vue`, and flat config merges the matching objects per file).
 *
 * `vue/block-lang` replaces the former custom `script-lang-ts` rule: nustack is
 * TypeScript-first, so every `<script>` block must declare `lang="ts"`.
 */
export function vueConfig(
  _ctx: unknown,
  _axes: ConcernContext,
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
        ...(variantAtLeast(_axes.variant, 'recommended')
          ? {
              'vue/define-emits-declaration': ['warn', 'type-literal'],
              'vue/define-props-destructuring': ['warn', {
                destructure: 'always',
              }],
              'vue/html-comment-content-newline': 'warn',
              'vue/html-comment-indent': 'warn',
              'vue/no-duplicate-class-names': 'warn',
              'vue/no-empty-component-block': 'warn',
              'vue/no-import-compiler-macros': 'error',
            }
          : {}),
        ...rules,
      },
    },
  ]
}
