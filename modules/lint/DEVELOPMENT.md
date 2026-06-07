# `@nustackjs/lint` — design notes

The architectural reference for the module. If the code and this doc disagree, one of
them is a bug. Read it before changing the config surface, adding a rule, or touching
the composition pipeline.

## Shape

Modelled on `@antfu/eslint-config`: a single factory takes per-concern options and
returns a `FlatConfigComposer`. Each concern is a small factory that emits flat-config
objects. There is no distinction between "our rules" and "configuring a third-party
plugin" — both are just config layers (the `tailwind` concern is mostly
better-tailwindcss config). We don't use a tag system; organisation is done with native
ESLint structure: globs, plugins, config `name`s, and area-prefixed rule ids.

```
nustackLint(withNuxt(), options)        // src/config.ts
  → resolve depth from NUSTACK_LINT_DEPTH
  → prepend the antfu base               (unless base: false)
  → append each enabled, context-gated concern(ctx, axes, opts)
  → append the type-aware layer          (only when depth: full)
  → append global options.overrides
  → return the FlatConfigComposer        (caller can .override()/.append())
```

`defineNustackConfig()` is the standalone (non-Nuxt) entry: same pipeline starting from
an empty composer, with the Nuxt concerns off by default. We use it to lint our own
source (`eslint.config.ts`).

## Two axes

| Axis | Values | Set where | Controls |
|---|---|---|---|
| `variant` | `minimal` ⊂ `recommended` (default) ⊂ `pedantic` | config, in `eslint.config.ts` | which rules / how opinionated. Cumulative. |
| `depth` | `quick` (default) ⊂ `full` | per run, env `NUSTACK_LINT_DEPTH` | how expensive. `full` adds the type-aware layer (`projectService`). |

They're different kinds of setting and live in different places on purpose: you set
opinion strength once for the project, but pick depth per invocation (quick locally,
full in CI). Keeping `depth` out of the options object also keeps the surface
engine-agnostic for the planned oxlint migration. `variant` is read via the helpers in
`src/configs/types.ts` (`variantAtLeast`); `depth` via `resolveDepth()`.

## Options (`src/config.ts`)

```ts
interface NustackLintOptions {
  variant?: 'minimal' | 'recommended' | 'pedantic' // default 'recommended'
  base?: AntfuOptions | false // antfu style base; false disables
  nuxt?: boolean | NuxtConcernOptions // auto-imports, runtimeConfig, process.env
  vue?: boolean | VueConcernOptions // SFC conventions (vue/block-lang)
  nuxtUi?: boolean | NuxtUiConcernOptions // prefer-u-*
  tailwind?: boolean | TailwindConcernOptions // better-tailwindcss config
  overrides?: Record<string, Linter.RuleEntry> // global, merged last
  context?: NustackContext // injected by codegen; rarely set by hand
}
```

A per-concern value is `true | false | { ...opts, overrides }`: `false` disables it,
`true`/absent uses the default (auto-gated on detection), an object tunes it. We do
**not** add bespoke wrapper knobs for third-party plugin settings — configure those
directly through the concern's `overrides` (rule options) and, where relevant, a
`settings` passthrough (e.g. `tailwind.settings`). Merging is done with `defu`.

## Concerns (`src/configs/*`)

One file per concern. Each exports `concern(ctx, axes, opts): Linter.Config[]`, where
`axes` is `{ variant, depth }`.

| Concern | File | Gated on |
|---|---|---|
| `base` | `base.ts` | always (unless `base: false`) — the antfu config, prepended |
| `vue` | `vue.ts` | always — SFC rules incl. `vue/block-lang` (`lang="ts"`) |
| `nuxt` | `nuxt.ts` | always — auto-import enforcement, `runtimeConfig`, `process.env` |
| `nuxt-ui` | `nuxt-ui.ts` | `ctx.modules.nuxtUi` |
| `tailwind` | `tailwind.ts` | `ctx.tailwind.detected` |

A concern decides which rules to emit from `axes.variant` (e.g. the `nuxt` concern adds
`no-process-env`/`no-explicit-auto-import` only at `recommended`+). The type-aware layer
(`type-aware.ts`, `ts/no-deprecated` + `projectService`) is appended once by the factory
at `depth: full`, not per concern. `pedantic` exists in the ladder but no concern adds
pedantic-only rules yet — that's where new aggressive rules will land.

## Naming

- Config object `name`: `nustack/<concern>` (e.g. `nustack/nuxt`, `nustack/tailwind`),
  used by `composer.override(name, …)`.
- Custom rule id: `nustack/<area>/<rule>`. The plugin registers once as `nustack` with
  area-prefixed keys (`nuxt/no-process-env`), so ESLint resolves
  `nustack/nuxt/no-process-env` → plugin `nustack`, rule `nuxt/no-process-env`.

## Custom rules (`src/rules/<area>/<name>/`)

Colocated triplet: `index.ts` (the rule, via the shared `createRule` in
`src/rules/utils.ts`), `index.test.ts` (RuleTester cases, run under vitest), `index.md`
(✅/❌ examples + rationale). `src/rules/catalog.ts` collects them into the plugin's
`rules` map. Prefer an upstream rule when one is configurable to our convention (e.g.
`vue/block-lang` over a custom `script-lang-ts`); only keep a custom rule when its
Nuxt-specific scoping or message earns its place.

## Overriding (must stay true)

1. Disable a concern or the base: `nuxt: false`, `base: false`.
2. Per-concern rule overrides: `tailwind: { overrides: { '<rule>': 'off' } }`.
3. Global overrides: `overrides: { 'nustack/nuxt/no-process-env': 'off' }`.
4. Composer floor: `nustackLint().override('nustack/nuxt', { … }).append({ … })`.

## The Nuxt module (`src/module.ts`, `src/addon.ts`, `src/context.ts`)

The module does two things: it installs `@nuxt/eslint` in composable mode
(`standalone: false`) so the preset owns the Vue/TS rules — the user lists only
`@nustackjs/lint`, with no `eslint` key — and it detects project context (installed
modules, Tailwind entry point, auto-imports, components) at `nuxt prepare`, writing
`.nuxt/nustack-eslint.mjs`. There is no `nustack` key in `nuxt.config.ts`; all
configuration lives in `eslint.config.ts`.

The generated file does the `withNuxt()` wiring so the user doesn't have to. It imports
the sibling `./eslint.config.mjs` (the `@nuxt/eslint` output) and exposes
`nustackLint(options = {}, ...customs)` — which calls `factory(withNuxt(...customs), {
...options, context })` — plus `export default nustackLint()` as the ready-to-use config.
So a user's `eslint.config.ts` is either `export { default } from './.nuxt/nustack-eslint.mjs'`
or `export default nustackLint({ … })`; they never import or call `withNuxt` themselves.
The low-level factory in `src/config.ts` keeps its `(base, options)` signature for the
standalone/non-Nuxt path.

## Engine roadmap

ESLint is the current engine and a deliberate stepping stone. v1.0 targets a full
[oxlint](https://oxc.rs) migration for speed, blocked on oxlint's Vue SFC support. Keep
the public surface (variant / depth / concerns / context) engine-agnostic so the swap
stays internal. Versioning is plain semver; `recommended` changes conservatively,
`pedantic` is the churn bucket. See `docs/roadmap.md`.
