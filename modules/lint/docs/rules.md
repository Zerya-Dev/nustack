# Rules

NuStack's custom rules live in standalone domain plugins that work with both ESLint and
[Oxlint](https://oxc.rs). The umbrella module just composes them; each rule's
implementation and full docs live in its package:

- [`@nustackjs/lint-plugin-nuxt`](../../../packages/lint-plugin-nuxt) — `@nustack/nuxt/*`
- [`@nustackjs/lint-plugin-vueuse`](../../../packages/lint-plugin-vueuse) — `@nustack/vueuse/*`
- [`@nustackjs/lint-plugin-vite`](../../../packages/lint-plugin-vite) — `@nustack/vite/*`
- [`@nustackjs/lint-plugin-nuxt-ecosystem`](../../../packages/lint-plugin-nuxt-ecosystem) — `@nustack/nuxt-ui/*`

They sit alongside borrowed rules from antfu, eslint-plugin-vue and better-tailwindcss
that the preset configures (those keep their upstream rule ids).

## `nuxt`

Core Nuxt conventions. Auto-import enforcement lives here too (it's a Nuxt concern, not
a top-level one).

| Rule | Variant | Severity | Fix |
|---|---|---|---|
| [`@nustack/nuxt/no-secret-in-public-runtimeconfig`](../../../packages/lint-plugin-nuxt/src/rules/no-secret-in-public-runtimeconfig/index.md) | `minimal` | error | — |
| [`@nustack/nuxt/modules-order`](../../../packages/lint-plugin-nuxt/src/rules/modules-order/index.md) | `recommended` | error | — |
| [`@nustack/nuxt/no-deprecated-modules`](../../../packages/lint-plugin-nuxt/src/rules/no-deprecated-modules/index.md) | `recommended` | error | — |
| [`@nustack/nuxt/no-explicit-auto-import`](../../../packages/lint-plugin-nuxt/src/rules/no-explicit-auto-import/index.md) | `recommended` | error | ✓ |
| [`@nustack/nuxt/no-process-env`](../../../packages/lint-plugin-nuxt/src/rules/no-process-env/index.md) | `recommended` | warn | — |

Also configures (from `@nuxt/eslint` / antfu): `vue/block-lang` → require `lang="ts"`.

## `vueuse`

VueUse-on-Nuxt conventions from `@nustackjs/lint-plugin-vueuse`.

| Rule | Variant | Severity | Fix |
|---|---|---|---|
| [`@nustack/vueuse/no-nuxt-auto-import-collision`](../../../packages/lint-plugin-vueuse/src/rules/no-nuxt-auto-import-collision/index.md) | `recommended` | warn | — |
| [`@nustack/vueuse/no-namespace-import`](../../../packages/lint-plugin-vueuse/src/rules/no-namespace-import/index.md) | `recommended` | warn | — |
| [`@nustack/vueuse/prefer-use-observers`](../../../packages/lint-plugin-vueuse/src/rules/prefer-use-observers/index.md) | `recommended` | warn | — |
| [`@nustack/vueuse/prefer-use-storage`](../../../packages/lint-plugin-vueuse/src/rules/prefer-use-storage/index.md) | `recommended` | warn | — |
| [`@nustack/vueuse/prefer-use-timers`](../../../packages/lint-plugin-vueuse/src/rules/prefer-use-timers/index.md) | `recommended` | warn | — |
| [`@nustack/vueuse/prefer-useclipboard`](../../../packages/lint-plugin-vueuse/src/rules/prefer-useclipboard/index.md) | `recommended` | warn | — |
| [`@nustack/vueuse/prefer-useevent-listener`](../../../packages/lint-plugin-vueuse/src/rules/prefer-useevent-listener/index.md) | `recommended` | warn | — |
| [`@nustack/vueuse/prefer-usewindow-size`](../../../packages/lint-plugin-vueuse/src/rules/prefer-usewindow-size/index.md) | `recommended` | warn | — |

## `vite`

Starter Vite build/runtime conventions from `@nustackjs/lint-plugin-vite`.

| Rule | Variant | Severity | Fix |
|---|---|---|---|
| [`@nustack/vite/no-public-src-import`](../../../packages/lint-plugin-vite/src/rules/assets/no-public-src-import/index.md) | `recommended` | warn | — |
| [`@nustack/vite/no-client-secret-pattern`](../../../packages/lint-plugin-vite/src/rules/env/no-client-secret-pattern/index.md) | `recommended` | error | — |

## `vue`

SFC conventions.

| Rule | Variant | Severity | Fix |
|---|---|---|---|
| `vue/define-emits-declaration` (`type-literal`) | `recommended` | warn | — |
| `vue/define-props-destructuring` (`destructure: 'always'`) | `recommended` | warn | — |
| `vue/html-comment-content-newline` | `recommended` | warn | ✓ |
| `vue/html-comment-indent` | `recommended` | warn | ✓ |
| `vue/no-duplicate-class-names` | `recommended` | warn | ✓ |
| `vue/no-empty-component-block` | `recommended` | warn | ✓ |
| `vue/no-import-compiler-macros` | `recommended` | error | ✓ |

## `nuxt-ui`

Active only when `@nuxt/ui` is detected.

| Rule | Variant | Severity | Fix |
|---|---|---|---|
| [`@nustack/nuxt-ui/prefer-u-button`](../../../packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/prefer-u-button/index.md) | `recommended` | warn | — |
| [`@nustack/nuxt-ui/prefer-u-form-controls`](../../../packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/prefer-u-form-controls/index.md) | `recommended` | warn | — |

## `tailwind`

Active when a Tailwind entry point is detected. These are
[better-tailwindcss](https://github.com/schoero/eslint-plugin-better-tailwindcss) rules
configured by the `tailwind` concern (including scanning the Nuxt UI `:ui` object prop):

| Rule | Variant | Severity | Fix |
|---|---|---|---|
| `better-tailwindcss/enforce-consistent-class-order` | `recommended` | warn | ✓ |
| `better-tailwindcss/enforce-consistent-line-wrapping` | `pedantic` | warn | ✓ |
| `better-tailwindcss/no-unregistered-classes` | `recommended` | warn | — |
| `better-tailwindcss/no-conflicting-classes` | `recommended` | error | — |
| `better-tailwindcss/no-duplicate-classes` | `recommended` | error | ✓ |

## type-aware (`depth: full` only)

Added only when `NUSTACK_LINT_DEPTH=full` (CI):

| Rule | Severity | Notes |
|---|---|---|
| `ts/no-deprecated` | warn | flags usage of `@deprecated` APIs; needs type info |
