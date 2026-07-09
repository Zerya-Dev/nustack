import type { Linter } from 'eslint'
import type { NustackContext } from '../context'
import type { ConcernOptions } from '../utils'
import { resolveConcernRules } from '../utils'

export interface VueConcernOptions extends ConcernOptions {}

/**
 * SFC conventions. The `vue` plugin and parser come from the antfu base (`vue: true`),
 * so this concern only layers rule choices on top.
 */
export function vueConfig(
  ctx: NustackContext,
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
        // Same TS-first reasoning as `define-props-declaration` below: a type-literal
        // `defineEmits<{ foo: [x: string] }>()` is checked, a runtime array/object isn't.
        'vue/define-emits-declaration': ['warn', 'type-literal'],
        // Vue 3.5's reactive props destructuring (`const { foo } = defineProps<...>()`)
        // reads better than `props.foo` everywhere and the compiler preserves reactivity.
        'vue/define-props-destructuring': ['warn', {
          destructure: 'always',
        }],
        // Consistent blank-line style inside multiline HTML comments, nothing more.
        'vue/html-comment-content-newline': 'warn',
        // Consistent indentation inside HTML comments, same bucket as the rule above.
        'vue/html-comment-indent': 'warn',
        // `<button>` defaults to `type="submit"` inside a `<form>` - a classic
        // accidental-submit bug when the intent was just a click handler.
        'vue/html-button-has-type': 'warn',
        // Every existing rule here already assumes `<script setup>` (destructured
        // props, no compiler-macro imports) - this just makes that assumption a
        // lint error instead of a silent convention.
        'vue/component-api-style': ['error', ['script-setup']],
        // TS-first codebase (see `block-lang` above); runtime `defineProps({...})`
        // throws away the type checker that `lang="ts"` is there to provide.
        'vue/define-props-declaration': ['error', 'type-based'],
        // Catches a duplicated class name inside a `class="..."` string - always a
        // copy-paste mistake, never intentional.
        'vue/no-duplicate-class-names': 'warn',
        // An empty `<template>`/`<script>`/`<style>` block is dead weight left over
        // from scaffolding or a stripped-out feature.
        'vue/no-empty-component-block': 'warn',
        // `defineProps`/`defineEmits`/etc. are compiler macros injected by the SFC
        // compiler, not real exports - importing them from `'vue'` is always wrong.
        'vue/no-import-compiler-macros': 'error',
        // Typo detector for component option names (`compoents`, `directves`, ...);
        // essentially free signal, no legitimate reason to write these.
        'vue/no-potential-component-option-typo': 'warn',
        // Catches the classic Composition API footgun of destructuring/passing a ref
        // in a way that silently loses reactivity - no Options API equivalent exists.
        'vue/no-ref-object-reactivity-loss': 'error',
        // `target="_blank"` without `rel="noopener"` leaks `window.opener` to the
        // opened page - a real, if minor, security issue with no upside to skipping.
        'vue/no-template-target-blank': 'error',
        // Root-level `v-if` can make the whole component vanish with no fallback
        // root - usually a mistake rather than an intentional wrapper `<template>`.
        'vue/no-root-v-if': 'warn',
        // Only meaningful once Tailwind is the styling story (see `tailwind.ts`):
        // static `style="..."` bypasses the whole class-sorting/correctness pipeline.
        // Dynamic `:style` bindings driven by a variable are never flagged - only a
        // literal `style="..."` attribute or a fully-static `:style="{...}"` object.
        ...(ctx.tailwind.detected ? { 'vue/no-static-inline-styles': 'warn' } : {}),
        // Same class of bug as the already-essential `no-unused-vars`/`no-unused-components`:
        // a declared-but-never-emitted event is dead API surface.
        'vue/no-unused-emit-declarations': 'error',
        // Sibling of the already-essential `no-use-v-if-with-v-for`: same directive-
        // precedence footgun, just the `v-else`/`v-else-if` variant.
        'vue/no-use-v-else-with-v-for': 'error',
        // `defineOptions({ name: ... })` is the only correct way to set component
        // options in `<script setup>` - a `default export {}` wrapper is Options-API leakage.
        'vue/prefer-define-options': 'error',
        // Vue 3.5's `useTemplateRef()` replaces the old `ref()` + matching
        // `ref="x"` template attribute pairing; Nuxt ships Vue 3.5+ already.
        'vue/prefer-use-template-ref': 'error',
        // Cheap consistency win: `const props =`, `const emit =`, `const slots =` everywhere.
        'vue/require-macro-variable-name': 'warn',
        // Object-shaped props declared as `Object`/`{}` instead of a literal type lose
        // all type safety, same TS-first reasoning as `define-props-declaration` above.
        'vue/require-typed-object-prop': 'error',
        // `ref()` without a type argument silently widens to `Ref<undefined>` unless
        // initialized - same TS-first reasoning as forcing `lang="ts"` everywhere.
        'vue/require-typed-ref': 'error',
        // Would fight `better-tailwindcss`'s own class-order enforcement (see
        // `tailwind.ts`) - two plugins fighting over the same attribute ordering.
        'vue/static-class-names-order': 'off',
        // Prevents Vue from reusing/mismatching DOM state across conditionally
        // rendered branches that look structurally similar.
        'vue/v-if-else-key': 'warn',
        // The rule's own default: a bare method reference when the handler needs
        // nothing extra, an explicit arrow when it needs a call-site argument -
        // together they cover every case without a throwaway wrapper method.
        'vue/v-on-handler-style': ['warn', ['method', 'inline-function']],
        ...rules,
      },
    },
  ]
}
