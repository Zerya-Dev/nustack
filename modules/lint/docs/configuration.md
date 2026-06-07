# Configuration

All configuration is passed to the factory in `eslint.config.ts`. There is no `nustack`
key in `nuxt.config`. Everything is optional — the defaults are the opinionated preset.

The generated `nustackLint` already wraps `withNuxt()`, so you just pass options:

```ts
import { nustackLint } from './.nuxt/nustack-eslint.mjs'

export default nustackLint({
  variant: 'recommended', // 'minimal' | 'recommended' | 'pedantic'
  base: { /* antfu options */ }, // or `false` to drop the style base entirely
  nuxt: true, // each concern: true | false | { ...opts, overrides }
  vue: true,
  nuxtUi: true, // auto-gated on @nuxt/ui detection
  tailwind: true, // auto-gated on a Tailwind entry point
  overrides: { /* global rule overrides, applied last */ },
})
```

(Extra arguments after the options object are forwarded to `withNuxt()` as additional
flat configs, if you need to customize the Nuxt composer itself.)

## The two knobs

### `variant` — how opinionated (static)

| Variant | Adds |
|---|---|
| `minimal` | only the security/correctness floor (e.g. no secrets in public runtimeConfig) |
| `recommended` *(default)* | the full opinionated, fast rule set |
| `pedantic` | extra aggressive rules with higher false-positive rates |

Cumulative: `pedantic` includes `recommended` includes `minimal`. Set it once for the
project.

### `depth` — how expensive (per run)

Depth is **not** a config option. It's read from the `NUSTACK_LINT_DEPTH` environment
variable so you can run a quick check locally and the full check in CI:

```bash
eslint .                            # quick (default) — fast, syntactic
NUSTACK_LINT_DEPTH=full eslint .    # full — adds type-aware / cross-file rules
```

`full` turns on the TypeScript project service and type-information rules
(e.g. deprecated-API detection), which are slower.

## Concerns

Each concern is `true | false | { ...opts, overrides }`. They auto-gate on detection,
but you can force or disable any of them:

| Concern | What it does | Auto-gated on |
|---|---|---|
| `base` | the antfu style/TS/Vue base (style, imports, etc.) | always (set `base: false` to drop) |
| `nuxt` | auto-import enforcement, `runtimeConfig` safety, no `process.env` in app code | always |
| `vue` | SFC conventions (`vue/block-lang` → `lang="ts"`) | `.vue` files |
| `nuxtUi` | prefer Nuxt UI components | `@nuxt/ui` installed |
| `tailwind` | class sorting/correctness via better-tailwindcss (incl. the `:ui` prop) | a Tailwind entry point |

## Overriding (the escape hatches)

Nothing is locked. From least to most surgical:

```ts
// 1. Disable a concern or the base
nustackLint({ tailwind: false, base: false })

// 2. Configure a third-party plugin directly — rule options via `overrides`,
//    shared plugin settings via `settings`. There are no bespoke wrapper knobs.
nustackLint({
  tailwind: {
    overrides: { 'better-tailwindcss/enforce-consistent-line-wrapping': ['warn', { printWidth: 100 }] },
    settings: { attributes: ['myClassProp'] },
  },
})

// 3. Global overrides (applied after everything)
nustackLint({
  overrides: { 'nustack/nuxt/no-process-env': 'off' },
})

// 4. Tune the antfu base directly (it's the same options antfu takes)
nustackLint({
  base: { stylistic: { quotes: 'double' }, rules: { 'antfu/if-newline': 'off' } },
})

// 5. The composer floor — append or override any named config
nustackLint()
  .override('nustack/nuxt', { rules: { /* … */ } })
  .append({ files: ['scripts/**'], rules: { 'no-console': 'off' } })
```

`.override(name, …)` targets config objects by their `name` — nustack names its objects
`nustack/<concern>` (e.g. `nustack/nuxt`, `nustack/tailwind`); antfu names its own
similarly.
