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
  review, including what AI agents generate. The ruleset keeps growing.
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
import { nustackLint } from './.nuxt/nustack-eslint.mjs'

export default nustackLint({ variant: 'pedantic' })
```

```bash
eslint .                            # quick checks (fast)
NUSTACK_LINT_DEPTH=full eslint .    # + type-aware checks (CI)
```

See [Configuration](./docs/configuration.md), [Rules](./docs/rules.md) and
[Migration](./docs/migration.md).

## Non-Nuxt projects

```ts
// eslint.config.ts
import { defineNustackConfig } from '@nustackjs/lint/config'

export default defineNustackConfig({ base: { type: 'lib' } })
```

## Contributing

`DEVELOPMENT.md` is the design contract — read it first.

```bash
pnpm install
pnpm dev:prepare   # build module + nuxt prepare playground
pnpm lint          # dogfoods the preset on its own source
pnpm test
```

<!-- Badges -->
[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt
[nuxt-href]: https://nuxt.com
