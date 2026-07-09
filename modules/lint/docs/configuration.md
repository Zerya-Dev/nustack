# Configuration

All configuration is passed to the factory in `eslint.config.ts`. There is no `nustack`
key in `nuxt.config`. Everything is optional — the defaults are the opinionated preset.

The generated `nustack` factory already wraps `withNuxt()`, so you just pass options:

```ts
import { nustack } from './.nuxt/nustack-eslint.mjs'

export default nustack({
  target: 'nuxt-app', // 'nuxt-app' | 'vue-app' | 'nuxt-module' - pre-fills the rest
  enforce: { complexity: true }, // opt-in opinionated checks (all off by default)
  base: { /* Antfu options — visual style lives here */ }, // or `false` to drop the style base entirely
  nuxt: true, // each concern: true | false | { ...opts, rules }
  vue: true,
  vueUse: true,
  vite: true,
  nuxtEcosystem: true, // auto-gated per module, e.g. Nuxt UI on @nuxt/ui detection
  tailwind: true, // auto-gated on a Tailwind entry point
  markdown: true, // mdclint for content/**/*.md; MDC auto-detected
  rules: { /* global rule changes, applied last */ },
})
```

Extra arguments after the options object are appended as normal flat config objects.

## `target`

| Target        | Environment                                                                                                | What it pre-fills                                                                                                                                                                                                                                 |
| ------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `nuxt-app`    | A normal Nuxt app. Default in the generated `.nuxt/nustack-eslint.mjs`.                                    | Every concern stays on its own detection gate; carries the Nitro `node/prefer-global/process: 'always'` base rule.                                                                                                                                |
| `vue-app`     | A non-Nuxt Vue SPA (`@nuxt/ui`'s Vite plugin, VueUse, Vite, Tailwind).                                     | `nuxt: false`; `vue`/`vueUse`/`vite` on unconditionally; `tailwind`/`nuxtEcosystem` stay detection-gated (never blanket-disabled); no Nitro base rule (there's no Nitro server). Context comes from lightweight standalone detection — see below. |
| `nuxt-module` | Authoring a Nuxt module/library: `src/**` is a TS package, an embedded `playground/**` is a full Nuxt app. | Antfu `type: 'lib'`; `nuxt`/`vueUse`/`vite` off for `src/**`; every nested Nuxt app dir is added to the antfu `ignores` so this config never double-lints it; carries the Nitro base rule (module code runs on Nitro).                            |

The standalone `@nustackjs/lint/config` entry (`nustack()`) defaults `target` to
`'vue-app'`; the generated Nuxt-path factory always passes `target: 'nuxt-app'`.

Under `nuxt-module`, every direct subdirectory that is its own Nuxt app — any dir holding
a `nuxt.config.{ts,js,mjs}`, regardless of name (`playground`, `demo`, `example`, …) — is
detected and added to the antfu `ignores`, so each one lints itself via its own config
instead of being double-linted by the root.

### The `nuxt-module` two-config playground pattern

The playground _is_ a real Nuxt app, so it lints itself — no cross-root compose or path
rewriting. Two config files:

```ts
// eslint.config.ts (repo root) — src/** as a library, playground/** ignored
import { nustack } from '@nustackjs/lint/config'

export default nustack({ target: 'nuxt-module' })
```

```js
// playground/eslint.config.mjs — the full nuxt-app config the module generates
export { default } from './.nuxt/nustack-eslint.mjs'
```

Run `nuxi prepare` inside `playground/` (as you'd do in dev anyway) so its
`.nuxt/nustack-eslint.mjs` exists, then lint both roots: `eslint . && eslint playground`
(or wire up ESLint's `workingDirectories` in your editor).

## `enforce` (opt-in opinionated checks)

Correctness rules are **always on** and are not configurable. NuStack is opinionated by
design, so there's no correctness switch. `enforce` is only for the extra opinionated
checks that not every team wants; each is a plain on/off boolean.

| Check        | Meaning                                                                                                                                                                                                                          | Default |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `complexity` | Cyclomatic-complexity + size-limit budget (`max-lines-per-function`, `max-params`, `max-statements`, and the Vue equivalents `vue/max-props` / `vue/max-lines-per-block`). Generous thresholds, but noisy on existing codebases. | `false` |

```ts
nustack({ enforce: { complexity: true } }) // opt into the complexity budget
```

## Coding style — `base` (static)

Style lives in `base`, which layers a **style preset** on top of `@antfu/eslint-config`.
`base.preset` picks it:

| Preset      | Style                                                                                         |
| ----------- | --------------------------------------------------------------------------------------------- |
| `'nustack'` | **Default.** antfu plus nustack's overrides — `1tbs` braces (antfu defaults to `stroustrup`). |
| `'antfu'`   | Plain antfu, no nustack deviations.                                                           |

Everything else in `base` is the same options Antfu takes: `stylistic`, `rules`, and `settings`.

```ts
nustack({ base: { preset: 'antfu' } }) // plain antfu, no 1tbs
nustack({ base: { stylistic: { quotes: 'double', semi: true } } }) // tune stylistic keys
nustack({ base: { stylistic: false } }) // drop styling entirely
nustack({ base: false }) // drop the whole antfu base (style + TS/Vue/imports)
```

A preset only seeds defaults: an explicit `base.stylistic` still wins per key, and
`stylistic: false` drops the stylistic layer entirely.

## `depth` — how expensive (per run)

Depth is **not** a config option. It's read from the `NUSTACK_LINT_DEPTH` environment
variable so you can run a quick check locally and the full check in CI:

```bash
eslint .                            # quick (default) — fast, syntactic
NUSTACK_LINT_DEPTH=full eslint .    # full — adds type-aware / cross-file rules
```

`full` turns on the TypeScript project service and type-information rules
(e.g. deprecated-API detection), which are slower. No option in the config object
turns on type-aware rules by itself — those stay gated behind `depth: 'full'`.

## Concerns

Each concern is `true | false | { ...opts, rules }`. They auto-gate on detection,
but you can force or disable any of them:

| Concern         | What it does                                                                  | Auto-gated on                                                                         |
| --------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `base`          | the Antfu style/TS/Vue base (style, imports, etc.)                            | always (set `base: false` to drop)                                                    |
| `nuxt`          | auto-import enforcement, `runtimeConfig` safety, no `process.env` in app code | `target: 'nuxt-app'` (off on `vue-app`/`nuxt-module`'s `src/**`)                      |
| `vue`           | SFC conventions (`vue/block-lang` → `lang="ts"`)                              | `.vue` files                                                                          |
| `vueUse`        | VueUse/browser API conventions                                                | Nuxt app/client files, or `vue-app`                                                   |
| `vite`          | Vite asset/env safety                                                         | Nuxt app/client files, or `vue-app`                                                   |
| `nuxtEcosystem` | per-module Nuxt-ecosystem preferences (Nuxt UI today)                         | each module's own detection (`@nuxt/ui` etc.) — never blanket-disabled by a target    |
| `tailwind`      | class sorting/correctness via better-tailwindcss (incl. the `:ui` prop)       | a Tailwind entry point                                                                |
| `markdown`      | Markdown/MDC linting via mdclint for `content/**/*.md`                        | always; MDC preset when `@nuxt/content`, `@comark/nuxt`, or `@nuxtjs/mdc` is detected |

## Context detection outside Nuxt

Non-Nuxt targets (`vue-app`, and `nuxt-module`'s `src/**`) have no `nuxt prepare` to
read a rich auto-import/component registry from, so nustack deliberately doesn't fake
one. `detectStandaloneContext(cwd?)` (used automatically by `nustack()`) fills
`ctx.modules.*` (e.g. `@nuxt/ui` → `nuxtUi`) by node resolution via `exsolve`
(`resolveModulePath`) rather than parsing the root `package.json`, so a dependency
reachable through a workspace sub-package or a hoisted `node_modules` is still detected.
It also scans common CSS entry points for a Tailwind v4 `@import "tailwindcss"`;
`autoImports`/`components` stay empty. (Nuxt-app detection via the module registry at
`nuxt prepare` is unchanged.)

If you need Nuxt-auto-import-aware rules outside Nuxt, pass an explicit `context`
(built with the exported `createContext()` helper, which fills any gaps from the empty
context):

```ts
import { createContext, nustack } from '@nustackjs/lint/config'

export default nustack({
  target: 'vue-app',
  context: createContext({ autoImports: ['ref', 'computed'] }),
})
```

## Customizing

Nothing is locked. From least to most surgical:

```ts
// 1. Disable a concern or the base
nustack({ tailwind: false, base: false })

// 2. Configure a third-party plugin directly — rule options via `rules`,
//    shared plugin settings via `settings`. There are no bespoke wrapper knobs
//    beyond `lineWrapping` (opt into `enforce-consistent-line-wrapping`, off by default).
nustack({
  tailwind: {
    lineWrapping: true,
    rules: { 'better-tailwindcss/enforce-consistent-line-wrapping': ['warn', { printWidth: 100 }] },
    settings: {
      selectors: [
        {
          kind: 'attribute',
          name: 'myClassProp',
          match: [{ type: 'string' }],
        },
      ],
    },
  },
})

// 3. Global rules (applied after everything)
nustack({
  rules: { '@nustack/nuxt/no-process-env': 'off' },
})

// 4. Force MDC parsing for a non-Nuxt setup
nustack({
  markdown: { preset: 'mdc', files: ['docs/**/*.md'] },
})

// 5. Tune the Antfu base directly (it's the same options Antfu takes)
nustack({
  base: { stylistic: { quotes: 'double' }, rules: { 'antfu/if-newline': 'off' } },
})

// 6. File-scoped flat configs go after the options object
nustack(
  {},
  { files: ['scripts/**'], rules: { 'no-console': 'off' } },
)

// 7. The composer floor — override or remove any named config
nustack()
  .override('nustack/nuxt/app', { rules: { '@nustack/nuxt/no-process-env': 'off' } })
  .remove('nustack/tailwind')
```

`.override(name, ...)` targets config objects by their `name`. Single-object concerns are
named after the concern (`nustack/vue`, `nustack/tailwind`, `nustack/nuxt-ui`,
`nustack/markdown`, `nustack/type-aware`, `nustack/complexity`); the `nuxt` concern is
split into slices — `nustack/nuxt/runtime-config` (secret floor), `nustack/nuxt/modules`
(module order / deprecations), `nustack/nuxt/app` (app-source rules incl.
`no-process-env`); Antfu names its own similarly. Inspect the exact names with the
config inspector below.

## Config inspector

The package returns a `FlatConfigComposer`, so the final resolved config works with the
standard inspector:

```bash
npx @eslint/config-inspector --config eslint.config.ts
```
