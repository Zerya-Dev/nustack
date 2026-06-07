# Rules

NuStack's custom rules are organized by **area** and named `nustack/<area>/<rule>`. They
sit alongside the borrowed rules from antfu, eslint-plugin-vue and better-tailwindcss
that the preset configures.

Each rule has a colocated doc with ✅/❌ examples and rationale (linked below).

## `nuxt`

Core Nuxt conventions. Auto-import enforcement lives here too (it's a Nuxt concern, not
a top-level one).

| Rule | Variant | Severity | Fix | Docs |
|---|---|---|---|---|
| `nustack/nuxt/no-secret-in-public-runtimeconfig` | `minimal` | error | — | [doc](../src/rules/nuxt/no-secret-in-public-runtimeconfig/index.md) |
| `nustack/nuxt/no-explicit-auto-import` | `recommended` | error | ✓ | [doc](../src/rules/nuxt/no-explicit-auto-import/index.md) |
| `nustack/nuxt/no-process-env` | `recommended` | warn | — | [doc](../src/rules/nuxt/no-process-env/index.md) |

Also configures (from `@nuxt/eslint` / antfu): `vue/block-lang` → require `lang="ts"`.

## `nuxt-ui`

Active only when `@nuxt/ui` is detected.

| Rule | Variant | Severity | Fix | Docs |
|---|---|---|---|---|
| `nustack/nuxt-ui/prefer-u-button` | `recommended` | warn | — | [doc](../src/rules/nuxt-ui/prefer-u-button/index.md) |
| `nustack/nuxt-ui/prefer-u-form-controls` | `recommended` | warn | — | [doc](../src/rules/nuxt-ui/prefer-u-form-controls/index.md) |

## `tailwind`

Active when a Tailwind entry point is detected. These are
[better-tailwindcss](https://github.com/schoero/eslint-plugin-better-tailwindcss) rules
configured by the `tailwind` concern (including scanning the Nuxt UI `:ui` object prop):

| Rule | Severity | Fix |
|---|---|---|
| `better-tailwindcss/enforce-consistent-class-order` | warn | ✓ |
| `better-tailwindcss/enforce-consistent-line-wrapping` | warn | ✓ |
| `better-tailwindcss/no-unregistered-classes` | warn | — |
| `better-tailwindcss/no-conflicting-classes` | error | — |
| `better-tailwindcss/no-duplicate-classes` | error | ✓ |

## type-aware (`depth: full` only)

Added only when `NUSTACK_LINT_DEPTH=full` (CI):

| Rule | Severity | Notes |
|---|---|---|
| `ts/no-deprecated` | warn | flags usage of `@deprecated` APIs; needs type info |
