# NuStack Lint

[![Nuxt][nuxt-src]][nuxt-href]

Zero-config ESLint for Nuxt: a single module for full, project-aware setup with
opinionated rules that catch real bugs across your whole stack — Nuxt, Vite, Nuxt UI,
VueUse, Tailwind, and more. Built on top of [`@nuxt/eslint`](https://eslint.nuxt.com),
[`@antfu/eslint-config`](https://github.com/antfu/eslint-config), and several custom
ESLint/Oxlint plugins. Part of [NuStack](https://github.com/Zerya-Dev/nustack).

> [!IMPORTANT]
> It runs on ESLint for now, but will be migrated to [Oxlint](https://oxc.rs) before releasing `v1` — see [Roadmap](#roadmap).

## What it does for you

- **Deep, ecosystem-aware rules.** Rules are enabled based on what your project actually uses,
  with dedicated, in-depth checks for each technology in your stack — Nuxt, Vite, popular Nuxt
  modules, VueUse, Tailwind. They catch the class of bug generic Vue/TS linting won't,
  which matters especially for AI-written code.
- **Configure lint once, everywhere.** One module bundles and wires the antfu base,
  `@nuxt/eslint`, and the NuStack rule packages, and upgrades them together — no
  plugin list to keep in sync across all your projects.
- **One canonical way.** Where the ecosystem offers several ways to do the same thing, the
  preset standardizes on one and enforces it — so conventions live in the linter, not in
  every code review, `DEVELOPMENT.md`, or `AGENTS.md`. Disagree with a pick?
  Override it; everything *should be* configurable.

## Coverage

The preset composes these layers and gates each on what your project actually uses. Rules
live in their own packages — follow a link for each package's rule list:

- **Antfu base**: style, TypeScript, imports, and the usual JS hygiene, via
  [`@antfu/eslint-config`](https://github.com/antfu/eslint-config).
- **Nuxt core**: [`@nuxt/eslint`](https://eslint.nuxt.com) plus
  [`@nustackjs/lint-plugin-nuxt`](https://github.com/Zerya-Dev/nustack/tree/master/packages/lint-plugin-nuxt): auto-imports,
  `runtimeConfig` safety, module order, `process.env`.
- **VueUse**: [`@nustackjs/lint-plugin-vueuse`](https://github.com/Zerya-Dev/nustack/tree/master/packages/lint-plugin-vueuse):
  prefer lifecycle-aware VueUse composables over raw browser APIs.
- **Vite**: [`@nustackjs/lint-plugin-vite`](https://github.com/Zerya-Dev/nustack/tree/master/packages/lint-plugin-vite): asset and
  env safety.
- **Nuxt ecosystem**:
  [`@nustackjs/lint-plugin-nuxt-ecosystem`](https://github.com/Zerya-Dev/nustack/tree/master/packages/lint-plugin-nuxt-ecosystem):
  conventions for individual Nuxt modules.
- **Tailwind**:
  [better-tailwindcss](https://github.com/schoero/eslint-plugin-better-tailwindcss) class
  order/correctness, active when a Tailwind entry point is detected.
- **Vue SFC** conventions from `eslint-plugin-vue` (e.g. `lang="ts"` blocks).

The custom rules are standalone [Oxlint](https://oxc.rs)-ready plugins with **no Nuxt
dependency** — so if you only want one slice (e.g. the Nuxt runtime rules) you can install
that plugin directly, without this module. See each package linked above.

**Want a rule added, or a plugin integrated?** [Open an issue](https://github.com/Zerya-Dev/nustack/issues) —
the ruleset is meant to grow with what the community uses.

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

Then point `eslint.config.ts` at the generated config:

```ts
// eslint.config.ts
export { default } from './.nuxt/nustack-eslint.mjs'
```

To pass options, call the factory instead:

```ts
// eslint.config.ts
import { nustack } from './.nuxt/nustack-eslint.mjs'

export default nustack({ variant: 'pedantic' })
```

```bash
eslint .                            # quick checks (fast)
NUSTACK_LINT_DEPTH=full eslint .    # + type-aware checks (CI), not recommended below v1
```

The public factory mirrors Antfu's override model: pass `base` to tune the Antfu layer,
pass per-concern options like `nuxt`, `vueUse`, or `tailwind` to tune NuStack concerns,
and use top-level `rules` for final global overrides. See
[Configuration](https://github.com/Zerya-Dev/nustack/blob/master/modules/lint/docs/configuration.md) and
[Migration](https://github.com/Zerya-Dev/nustack/blob/master/modules/lint/docs/migration.md) for more info.

## Non-Nuxt projects

```ts
// eslint.config.ts
import nustack from '@nustackjs/lint/config'

export default nustack({ base: { type: 'lib' } })
```

## Config inspector

The preset returns a `FlatConfigComposer`, so the exact resolved config is inspectable:

```bash
npx @eslint/config-inspector --config eslint.config.ts
```

## Roadmap

ESLint is the current engine and a deliberate stepping stone. The v1.0 goal is a full
migration to [Oxlint](https://oxc.rs) for speed, blocked upstream on [Oxlint's Vue SFC
support](https://github.com/oxc-project/oxc/issues/23207) (linting inside `<template>`
and the SFC tag structure). Plugins are already built on `@oxlint/plugins`.

## Contributing

See [DEVELOPMENT.md](https://github.com/Zerya-Dev/nustack/blob/master/modules/lint/DEVELOPMENT.md) —
the design contract and local workflow.

## Credits

- [Anthony Fu](https://github.com/antfu): for
  [`@antfu/eslint-config`](https://github.com/antfu/eslint-config), which inspired the
  base config.

## License

[MIT](https://github.com/Zerya-Dev/nustack/blob/master/modules/lint/LICENSE) © Zerya

<!-- Badges -->
[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt
[nuxt-href]: https://nuxt.com
