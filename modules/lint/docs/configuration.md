# Configuration

All configuration is passed to the factory in `eslint.config.ts`. There is no `nustack`
key in `nuxt.config`. Everything is optional — the defaults are the opinionated preset.

The generated `nustack` factory already wraps `withNuxt()`, so you just pass options:

```ts
import { nustack } from './.nuxt/nustack-eslint.mjs'

export default nustack({
  variant: 'recommended', // 'minimal' | 'recommended' | 'pedantic'
  base: { /* Antfu options */ }, // or `false` to drop the style base entirely
  nuxt: true, // each concern: true | false | { ...opts, rules }
  vue: true,
  vueUse: true,
  vite: true,
  nuxtUi: true, // auto-gated on @nuxt/ui detection
  tailwind: true, // auto-gated on a Tailwind entry point
  markdown: true, // mdclint for content/**/*.md; MDC auto-detected
  rules: { /* global rule changes, applied last */ },
})
```

Extra arguments after the options object are appended as normal flat config objects.

## The two knobs

### `variant` — how opinionated (static)

| Variant                   | Adds                                                                          |
| ------------------------- | ----------------------------------------------------------------------------- |
| `minimal`                 | only the security/correctness floor (e.g. no secrets in public runtimeConfig) |
| `recommended` _(default)_ | the full opinionated, fast rule set                                           |
| `pedantic`                | extra aggressive rules with higher false-positive rates                       |

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

Each concern is `true | false | { ...opts, rules }`. They auto-gate on detection,
but you can force or disable any of them:

| Concern    | What it does                                                                  | Auto-gated on                                                                         |
| ---------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `base`     | the Antfu style/TS/Vue base (style, imports, etc.)                            | always (set `base: false` to drop)                                                    |
| `nuxt`     | auto-import enforcement, `runtimeConfig` safety, no `process.env` in app code | always                                                                                |
| `vue`      | SFC conventions (`vue/block-lang` → `lang="ts"`)                              | `.vue` files                                                                          |
| `vueUse`   | VueUse/browser API conventions                                                | Nuxt app/client files                                                                 |
| `vite`     | Vite asset/env safety                                                         | Nuxt app/client files                                                                 |
| `nuxtUi`   | prefer Nuxt UI components                                                     | `@nuxt/ui` installed                                                                  |
| `tailwind` | class sorting/correctness via better-tailwindcss (incl. the `:ui` prop)       | a Tailwind entry point                                                                |
| `markdown` | Markdown/MDC linting via mdclint for `content/**/*.md`                        | always; MDC preset when `@nuxt/content`, `@comark/nuxt`, or `@nuxtjs/mdc` is detected |

The standalone `@nustackjs/lint/config` entry defaults project-detected concerns off
(`nuxt`, `nuxtUi`, `vueUse`, `vite`). Enable them explicitly in non-Nuxt projects.

## Customizing

Nothing is locked. From least to most surgical:

```ts
// 1. Disable a concern or the base
nustack({ tailwind: false, base: false })

// 2. Configure a third-party plugin directly — rule options via `rules`,
//    shared plugin settings via `settings`. There are no bespoke wrapper knobs.
nustack({
  tailwind: {
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

`.override(name, …)` targets config objects by their `name`. Single-object concerns are
named after the concern (`nustack/vue`, `nustack/tailwind`, `nustack/nuxt-ui`,
`nustack/markdown`, `nustack/type-aware`); the `nuxt` concern is split into slices —
`nustack/nuxt/runtime-config` (secret floor), `nustack/nuxt/modules` (module order /
deprecations), `nustack/nuxt/app` (app-source rules incl. `no-process-env`); Antfu names
its own similarly. Inspect the exact names with the config inspector below.

## Config inspector

The package returns a `FlatConfigComposer`, so the final resolved config works with the
standard inspector:

```bash
npx @eslint/config-inspector --config eslint.config.ts
```
