# `@nustackjs/lint` Development

This module **only composes and configures**; it never defines rules. It wires the antfu
base, `@nuxt/eslint`, better-tailwindcss, and the `@nustackjs/lint-plugin-*` packages into
one zero-config Nuxt preset.

> **Adding or changing a rule? You're in the wrong place.** Custom rules live in the
> standalone plugins under [`../../packages/lint-plugin-*`](../../packages). This module
> just decides which of them to turn on, and when. See the `configs/` composition pipeline
> for how they're wired.

## Scripts

Run from this directory (`modules/lint`).

| Script               | What it does                                                                                                                                                |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm dev`           | Build the module and run the playground in dev (`nuxt dev playground`).                                                                                     |
| `pnpm dev:prepare`   | Build the plugins + module + prepare the playground. Run once after a fresh clone or when plugin/module output is stale.                                    |
| `pnpm dev:inspector` | Open [`@eslint/config-inspector`](https://github.com/eslint/config-inspector) against `eslint.config.ts`, the fastest way to see the resolved flat config. |
| `pnpm build`         | Full module build (what `prepack`/CI runs).                                                                                                                 |
| `pnpm lint`          | Lint this package with its own config (dogfooding).                                                                                                         |
| `pnpm test`          | Build the plugins, then run the Vitest suite.                                                                                                               |
| `pnpm test:watch`    | Vitest in watch mode (assumes plugins are already built).                                                                                                   |
| `pnpm test:types`    | Type-check the module and the playground with `vue-tsc`.                                                                                                    |

Because tests and the playground consume the plugins' **built** output, rebuild them
(`pnpm dev:prepare`, or `pnpm test` which does it for you) whenever you change a plugin.

## Release

Releases are automated via [release-please](https://github.com/googleapis/release-please)
(`release-please-config.json`), driven by [Conventional Commits](https://www.conventionalcommits.org).

1. Land changes on `master` with conventional commit messages (`fix:`, `feat:`, `feat!:` ...).
2. release-please maintains a "chore: release" PR that bumps versions and updates
   `CHANGELOG.md` across the workspace (plugins + this module are versioned together via
   the `node-workspace` plugin, so internal `workspace:*` deps get pinned on release).
3. Merging that PR tags the release, and the `release.yml` workflow builds, tests,
   type-checks, then publishes only the unpublished versions via
   `scripts/publish-unpublished.mjs`.

## Layout

```
src/config.ts             public API: nustack(options, ...userConfigs)
src/configs/*             one file per concern (base, vue, nuxt, vite, vueuse,
                          nuxt-ecosystem, tailwind, markdown, complexity, type-aware);
                          base.ts carries the style presets (nustack/antfu)
src/target.ts             `target` resolution (per-environment defaults)
src/context/index.ts      NustackContext type + EMPTY_CONTEXT
src/context/detect.ts     standalone (non-Nuxt) context detection via node resolution (exsolve)
src/context/module-flags.ts  module→context-flag map shared by the Nuxt and standalone paths
src/addon.ts              Nuxt-module hooks that write .nuxt/nustack-eslint.mjs on prepare
eslint.config.ts          this package's own config (dogfooding + inspector target)
playground/               Nuxt app to exercise the module end-to-end
test/                     Vitest suite
```

See [`README.md`](./README.md) and [`docs/configuration.md`](./docs/configuration.md)
for the user-facing config surface: `target`, the opt-in `enforce` checks, the `base`
visual style, and `depth`.
