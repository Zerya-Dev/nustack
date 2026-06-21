# `@nustackjs/lint` — design notes

The architectural contract for the module. If the code and this doc disagree, treat it
as a bug in one of them. Read it before changing the config surface, adding a rule, or
touching the composition pipeline.

## The big picture

There are two layers:

1. **Domain plugins** (`packages/lint-plugin-*`) — small, standalone ESLint/Oxlint
   plugins that own the actual custom rules (`@nustack/nuxt/*`, `@nustack/vueuse/*`,
   `@nustack/vite/*`, `@nustack/nuxt-ui/*`). They have no Nuxt dependency and can be used
   on their own.
2. **The umbrella module** (this package) — composes those plugins with the antfu base,
   `@nuxt/eslint`, and better-tailwindcss into one zero-config preset, and wires it into
   a Nuxt project at `nuxt prepare`.

The module never defines rules; it only configures and composes.

## Composition pipeline

Modelled on `@antfu/eslint-config`: a single factory takes per-concern options and
returns a `FlatConfigComposer`. Each concern is a small factory that emits flat-config
objects. There's no distinction between "our rules" and "configuring a third-party
plugin" — both are just config layers. Organisation uses native ESLint structure (globs,
plugins, config `name`s, rule ids), not a tag system.

```
nustack(options, ...userConfigs)        // public API (src/config.ts)
  → resolve depth from NUSTACK_LINT_DEPTH
  → prepend the antfu base               (unless base: false)
  → append each enabled, context-gated concern(ctx, axes, opts)
  → append the type-aware layer          (only when depth: full)
  → append global options.rules
  → append user flat configs
  → return the FlatConfigComposer        (caller can .override()/.append()/.remove())
```

The generated Nuxt wrapper exposes the same `nustack(options, ...userConfigs)` shape but
starts from `withNuxt()`. The standalone default export starts from an empty composer and
turns Nuxt-only concerns off by default.

## Two axes

| Axis | Values | Set where | Controls |
|---|---|---|---|
| `variant` | `minimal` ⊂ `recommended` (default) ⊂ `pedantic` | config, in `eslint.config.ts` | which rules / how opinionated. Cumulative. |
| `depth` | `quick` (default) ⊂ `full` | per run, env `NUSTACK_LINT_DEPTH` | how expensive. `full` adds the type-aware layer (`projectService`). |

They're different kinds of setting and live in different places on purpose: you set
opinion strength once for the project, but pick depth per invocation (quick locally, full
in CI). Keeping `depth` out of the options object also keeps the surface engine-agnostic
for the planned Oxlint migration. `variant` is read via `variantAtLeast` in
`src/configs/types.ts`; `depth` via `resolveDepth()`.

## Options (`src/config.ts`)

```ts
interface NustackLintOptions {
  variant?: 'minimal' | 'recommended' | 'pedantic' // default 'recommended'
  base?: AntfuOptions | false // antfu style base; false disables
  nuxt?: boolean | NuxtConcernOptions // auto-imports, runtimeConfig, process.env
  vue?: boolean | VueConcernOptions // SFC conventions (vue/block-lang)
  vueUse?: boolean | VueUseConcernOptions // VueUse/browser API conventions
  vite?: boolean | ViteConcernOptions // Vite asset/env safety
  nuxtUi?: boolean | NuxtUiConcernOptions // prefer-u-*
  tailwind?: boolean | TailwindConcernOptions // better-tailwindcss config
  rules?: Record<string, Linter.RuleEntry> // global, merged last
  context?: NustackContext // injected by codegen; rarely set by hand
}
```

A per-concern value is `true | false | { ...opts, rules }`: `false` disables it,
`true`/absent uses the default (auto-gated on detection), an object tunes it. We do
**not** add bespoke wrapper knobs for third-party plugin settings — configure those
directly through the concern's `rules` (rule options) and, where relevant, a `settings`
passthrough (e.g. `tailwind.settings`). Merging is done with `defu`.

## Concerns (`src/configs/*`)

One file per concern. Each exports `concern(ctx, axes, opts): Linter.Config[]`, where
`axes` is `{ variant, depth }`.

| Concern | File | Gated on |
|---|---|---|
| `base` | `base.ts` | always (unless `base: false`) — the antfu config, prepended |
| `vue` | `vue.ts` | always — SFC rules incl. `vue/block-lang` (`lang="ts"`) |
| `nuxt` | `nuxt.ts` | always — auto-import enforcement, `runtimeConfig`, `process.env` |
| `vite` | `vite.ts` | always — Vite asset/env safety |
| `vueuse` | `vueuse.ts` | always in Nuxt — VueUse/browser API conventions |
| `nuxt-ui` | `nuxt-ui.ts` | `ctx.modules.nuxtUi` |
| `tailwind` | `tailwind.ts` | `ctx.tailwind.detected` |

A concern decides which rules to emit from `axes.variant` (e.g. `nuxt` adds
`no-process-env`/`no-explicit-auto-import` only at `recommended`+). The type-aware layer
(`type-aware.ts`, `ts/no-deprecated` + `projectService`) is appended once by the factory
at `depth: full`, not per concern. `pedantic` exists in the ladder but no concern adds
pedantic-only rules yet — that's where new aggressive rules will land.

## Naming

Two distinct namespaces — don't conflate them:

- **Config object `name`** (used by `composer.override(name, …)`): `nustack/<concern>`,
  e.g. `nustack/nuxt`, `nustack/tailwind`. Larger concerns expose finer names, e.g.
  `nustack/nuxt/runtime-config`, `nustack/nuxt/auto-imports`, `nustack/nuxt/no-process-env`.
- **Rule id** (used in `rules: { … }`): `@nustack/<domain>/<rule>`, owned by the domain
  plugin packages, e.g. `@nustack/nuxt/no-process-env` from `@nustackjs/lint-plugin-nuxt`.

### Why the scoped `@nustack` prefix

ESLint parses a rule id into `plugin` + `rule`. For a **scoped** id it splits on the
**last** `/` (`ruleId.slice(0, ruleId.lastIndexOf('/'))`), so:

- `@nustack/vueuse/no-namespace-import` → plugin `@nustack/vueuse`, rule
  `no-namespace-import`.

That gives every domain plugin its own ESLint plugin name (`@nustack/<domain>`) — no
shared `nustack` key, so the standalone packages never collide, and there's no merged
plugin to maintain. The consequence for rule authors: **a rule key must be a single
segment** (no `/`). That's why `@nustack/lint-plugin-vite` keys its rules
`no-public-src-import` (not `assets/no-public-src-import`) even though the source lives
under `src/rules/assets/`.

## Custom rules (`packages/lint-plugin-*/src/rules/<area>/<name>/`)

Custom rules belong in the domain plugin packages, not in `modules/lint`. The umbrella
imports and configures those plugins. Prefer an upstream rule when one is configurable to
our convention (e.g. `vue/block-lang` over a custom `script-lang-ts`); only keep a custom
rule when its domain-specific scoping or message earns its place.

Rules that only need syntax-level matching should use `createOnce`. Use `create` when the
rule needs per-file options, source code, or parser services. Vue template rules depend on
`vue-eslint-parser`'s `defineTemplateBodyVisitor`, so they are guarded and are not
Oxlint-portable until Oxlint has equivalent Vue SFC template support.

The rule packages are still small, so shared AST/test helpers are local for now. Before
adding a larger rule batch, extract common predicates and RuleTester setup into an
internal `@nustackjs/lint-rule-kit` package instead of copy-pasting boilerplate.

## Overriding (must stay true)

1. Disable a concern or the base: `nuxt: false`, `base: false`.
2. Per-concern rule changes: `tailwind: { rules: { '<rule>': 'off' } }`.
3. Global rule changes: `rules: { '@nustack/nuxt/no-process-env': 'off' }`.
4. File-scoped flat configs: `nustack({}, { files: ['scripts/**'], rules: { … } })`.
5. Composer floor: `nustack().override('nustack/nuxt', { … }).remove('nustack/tailwind')`.

Note (3) takes a **rule id** (`@nustack/…`); (5) takes a **config object name**
(`nustack/…`).

## The Nuxt module (`src/module.ts`, `src/addon.ts`, `src/context.ts`)

The module does two things:

- **Installs `@nuxt/eslint` in composable mode** (`standalone: false`) so the preset owns
  the Vue/TS rules. The user lists only `@nustackjs/lint` in `modules`, with no `eslint`
  key and no `nustack` key — all configuration lives in `eslint.config.ts`.
- **Detects project context** (installed modules, Tailwind entry point, auto-imports,
  components) at `nuxt prepare` and writes `.nuxt/nustack-eslint.mjs`.

The generated file does the `withNuxt()` wiring for the user. It imports the sibling
`./eslint.config.mjs` (the `@nuxt/eslint` output) and exposes `nustack(options = {},
...configs)` — which calls `applyNustackConfig(withNuxt(), { ...options, context },
...configs)` — plus `export default nustack()` as the ready-to-use config, and a
`nustackLint` alias for back-compat. So a user's `eslint.config.ts` is either zero-config:

```ts
export { default } from './.nuxt/nustack-eslint.mjs'
```

or, with options:

```ts
import { nustack } from './.nuxt/nustack-eslint.mjs'

export default nustack({ variant: 'pedantic' })
```

They never import or call `withNuxt` themselves. `applyNustackConfig(base, options,
...configs)` is the low-level bridge used by codegen and by the standalone
`@nustackjs/lint/config` entry.

## Engine roadmap

ESLint is the current engine and a deliberate stepping stone. v1.0 targets a full
[Oxlint](https://oxc.rs) migration for speed, blocked on Oxlint's Vue SFC support. The
domain plugins are already built on `@oxlint/plugins` so their non-template rules port
directly. Keep the public surface (variant / depth / concerns / context) engine-agnostic
so the swap stays internal. Versioning is plain semver; `recommended` changes
conservatively, `pedantic` is the churn bucket. See `docs/roadmap.md`.

## Local workflow

```bash
pnpm install
pnpm dev:prepare   # build the domain plugins + module, then nuxt prepare the playground
pnpm lint          # dogfoods the preset on its own source
pnpm test          # builds the plugins, then runs the vitest suite
```

Gotcha: after editing codegen (`src/addon.ts`), `rm -rf dist` before `pnpm dev:prepare`
— Nuxt's module loader can otherwise serve a stale compiled `dist/module.mjs` and write
an outdated `.nuxt/nustack-eslint.mjs`.
