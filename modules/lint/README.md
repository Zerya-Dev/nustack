# NuStack Lint

[![Nuxt][nuxt-src]][nuxt-href]

> [!CAUTION]
> Very early in development. The ESLint engine is a stepping stone toward an
> oxlint-based v1.0 — see the [roadmap](./docs/roadmap.md). Don't depend on it yet.

Zero-config ESLint for Nuxt. Add one module and get a full setup — no `eslint.config` to
assemble, no plugin list to keep in sync across projects. It detects what your project
uses and turns on the rules that fit, on top of
[`@nuxt/eslint`](https://eslint.nuxt.com) and
[`@antfu/eslint-config`](https://github.com/antfu/eslint-config). Part of
[NuStack](../../README.md).

Three reasons it exists:

- **Plug it in.** Stop reconfiguring lint on every project. One module bundles and wires
  the antfu base, `@nuxt/eslint`, and a growing set of Nuxt-aware rules, and upgrades
  them together.
- **Catch more.** Deep, Nuxt-aware checks that go well past formatting — promoting
  ecosystem best practices and catching the slop that otherwise slips through code
  review, including what AI agents generate. The ruleset keeps growing. The custom rules
  ship as standalone, [Oxlint](https://oxc.rs)-ready plugins
  ([nuxt](../../packages/lint-plugin-nuxt), [vueuse](../../packages/lint-plugin-vueuse),
  [vite](../../packages/lint-plugin-vite),
  [nuxt-ecosystem](../../packages/lint-plugin-nuxt-ecosystem)) that you can also use on
  their own.
- **Policy as code.** When there are several ways to do the same thing, it picks one and
  enforces it — so the decision lives in the linter instead of in every code review.
  Disagree with a pick? Override it; everything is configurable.

## Setup

```bash
npx nuxi module add @nustackjs/lint
```

That's the only module you list — `@nuxt/eslint` is bundled and installed for you (in
composable mode), so there's no `eslint` key to configure:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nustackjs/lint'],
})
```

Then point `eslint.config.ts` at the generated config (it already wires in `withNuxt()`
for you — config lives here, not in `nuxt.config`):

```ts
// eslint.config.ts
export { default } from './.nuxt/nustack-eslint.mjs'
```

To pass options, call the factory instead — same file, `withNuxt()` still prewired:

```ts
// eslint.config.ts
import { nustack } from './.nuxt/nustack-eslint.mjs'

export default nustack({ variant: 'pedantic' })
```

```bash
eslint .                            # quick checks (fast)
NUSTACK_LINT_DEPTH=full eslint .    # + type-aware checks (CI)
```

## What gets enabled

NuStack is an umbrella preset: it starts from
[`@antfu/eslint-config`](https://github.com/antfu/eslint-config), lets Nuxt generate the
project-aware `@nuxt/eslint` layer, then adds NuStack's own Nuxt ecosystem rules. The
exact flat config is still inspectable with the config inspector command below.

| Source | Enabled when | Plugins / rule namespaces | Enabled rules / presets |
| --- | --- | --- | --- |
| [`@antfu/eslint-config`](https://github.com/antfu/eslint-config) | Always, unless `base: false` | Core ESLint, TypeScript, Vue, import, node, unicorn, regexp, jsdoc, perfectionist, test/Vitest, pnpm, JSON/YAML/TOML/Markdown and other Antfu-detected slices | NuStack passes `stylistic: true`, `vue: true`, and keeps Antfu's normal defaults. Vitest rules are enabled as `test/*` in Antfu's renamed namespace. |
| `@nuxt/eslint` / `@nuxt/eslint-config` | Nuxt module setup | `nuxt/*`, Nuxt globals, Nuxt file-aware Vue handling | Official Nuxt rules such as `nuxt/prefer-import-meta`, `nuxt/no-page-meta-runtime-values`, and `nuxt/no-nuxt-config-test-key`; config key sorting follows Nuxt's own feature options. |
| `@nustack/nuxt` | Nuxt projects; `recommended` and above except the security floor | `@nustack/nuxt/*` | `@nustack/nuxt/no-secret-in-public-runtimeconfig` (`error`), `@nustack/nuxt/modules-order` (`error`), `@nustack/nuxt/no-deprecated-modules` (`error`), `@nustack/nuxt/no-explicit-auto-import` (`error`), `@nustack/nuxt/no-process-env` (`warn`) |
| NuStack Vue layer | Vue SFCs | `vue/*` | `vue/block-lang` (`error`); in `recommended` and above also `vue/define-emits-declaration`, `vue/define-props-destructuring`, `vue/html-comment-content-newline`, `vue/html-comment-indent`, `vue/no-duplicate-class-names`, `vue/no-empty-component-block`, `vue/no-import-compiler-macros` |
| `@nustack/vueuse` | App/client code; `recommended` and above | `@nustack/vueuse/*` | `@nustack/vueuse/no-nuxt-auto-import-collision`, `@nustack/vueuse/no-namespace-import`, `@nustack/vueuse/prefer-use-observers`, `@nustack/vueuse/prefer-use-storage`, `@nustack/vueuse/prefer-use-timers`, `@nustack/vueuse/prefer-useclipboard`, `@nustack/vueuse/prefer-useevent-listener`, `@nustack/vueuse/prefer-usewindow-size` |
| `@nustack/vite` | App/client code; `recommended` and above | `@nustack/vite/*` | `@nustack/vite/no-client-secret-pattern` (`error`), `@nustack/vite/no-public-src-import` (`warn`) |
| `eslint-plugin-better-tailwindcss` | Tailwind entry point detected, or `tailwind: true` | `better-tailwindcss/*` | `better-tailwindcss/enforce-consistent-class-order` (`warn`), `better-tailwindcss/no-unregistered-classes` (`warn`), `better-tailwindcss/no-conflicting-classes` (`error`), `better-tailwindcss/no-duplicate-classes` (`error`); `pedantic` also enables `better-tailwindcss/enforce-consistent-line-wrapping` |
| `@nustack/nuxt-ui` | `@nuxt/ui` detected, or `nuxtUi: true` | `@nustack/nuxt-ui/*` | `@nustack/nuxt-ui/prefer-u-button`, `@nustack/nuxt-ui/prefer-u-form-controls` |
| NuStack type-aware layer | `NUSTACK_LINT_DEPTH=full` | Antfu's renamed `ts/*` namespace | Enables TypeScript project service and `ts/no-deprecated` (`warn`) |

The public factory mirrors Antfu's override model: pass `base` to tune the Antfu layer,
pass per-concern options like `nuxt`, `vueUse`, or `tailwind` to tune NuStack concerns,
and use top-level `rules` for final global overrides.

See [Configuration](./docs/configuration.md), [Rules](./docs/rules.md) and
[Migration](./docs/migration.md).

## Non-Nuxt projects

```ts
// eslint.config.ts
import nustack from '@nustackjs/lint/config'

export default nustack({ base: { type: 'lib' } })
```

## Config inspector

```bash
npx @eslint/config-inspector --config eslint.config.ts
```

## Contributing

`DEVELOPMENT.md` is the design contract — read it first.

```bash
pnpm install
pnpm dev:prepare   # build module + nuxt prepare playground
pnpm lint          # dogfoods the preset on its own source
pnpm test
```

## License

[MIT](./LICENSE) © Zerya

<!-- Badges -->
[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt
[nuxt-href]: https://nuxt.com
