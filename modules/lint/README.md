# NuStack Lint

[![Nuxt][nuxt-src]][nuxt-href]

Zero-config linting for Nuxt: one project-aware module that catches real bugs and
validates conventions that usually live only in documentation across the ecosystem:
Nuxt, Vite, Nuxt UI, VueUse, Tailwind, and more. Part of [NuStack](https://github.com/Zerya-Dev/nustack).

> [!NOTE]
> The rules also ship as standalone ESLint/Oxlint plugins if you only want one slice.
> Use the individual packages for focused checks without the full Nuxt module:
> [nuxt](../../packages/lint-plugin-nuxt),
> [vueuse](../../packages/lint-plugin-vueuse),
> [vite](../../packages/lint-plugin-vite), and
> [nuxt-ecosystem](../../packages/lint-plugin-nuxt-ecosystem).

> [!IMPORTANT]
> ESLint is the current engine; [Oxlint](https://oxc.rs) is the `v1` target. Expect
> breaking rule changes before reaching stable `v1`. Feel free to track the roadmap in
> [issue #7](https://github.com/Zerya-Dev/nustack/issues/7).

## What it does for you

- **Deep, ecosystem-aware rules.** Detect the Nuxt modules and tools your project uses, then auto-enable rules built from each tool's best practices.
- **One module, shared presets.** Stop wiring the same plugins and configs in every project; install one module and reuse the same preset across your apps.
- **Enforced decisions.** Keep practices and architectural decisions in executable rules instead of review comments or _even worse_ [`AGENTS.md`](https://evilmartians.com/chronicles/stop-writing-rules-in-agents-md-use-agent-hooks-and-nano-staged-instead).

For the longer design rationale, see the [RFC 01: NuStack Lint](../../rfcs/01-nustack-lint.md).

## Coverage

The preset composes these layers and gates each on what your project actually uses:

- **Antfu base**: style, TypeScript, imports, and JS hygiene via [`@antfu/eslint-config`](https://github.com/antfu/eslint-config).
- **Nuxt core**: auto-imports, `runtimeConfig`, module order, and `process.env` via [`@nuxt/eslint`](https://eslint.nuxt.com) and [`@nustackjs/lint-plugin-nuxt`](https://github.com/Zerya-Dev/nustack/tree/master/packages/lint-plugin-nuxt).
- **VueUse**: prefer lifecycle-aware composables via [`@nustackjs/lint-plugin-vueuse`](https://github.com/Zerya-Dev/nustack/tree/master/packages/lint-plugin-vueuse).
- **Vite**: asset and env safety via [`@nustackjs/lint-plugin-vite`](https://github.com/Zerya-Dev/nustack/tree/master/packages/lint-plugin-vite).
- **Nuxt ecosystem**: conventions for individual Nuxt modules via [`@nustackjs/lint-plugin-nuxt-ecosystem`](https://github.com/Zerya-Dev/nustack/tree/master/packages/lint-plugin-nuxt-ecosystem).
- **Tailwind**: class order and correctness via [better-tailwindcss](https://github.com/schoero/eslint-plugin-better-tailwindcss).
- **Vue SFC** conventions from `eslint-plugin-vue` (e.g. `lang="ts"` blocks).

**Want a rule added, or a plugin integrated?** [Open an issue](https://github.com/Zerya-Dev/nustack/issues) -
the ruleset is meant to grow with what the community uses.

## Setup

```bash
npx nuxi module add @nustackjs/lint
```

That's the only Nuxt module you list:

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

```bash
eslint .                            # quick checks (fast)
NUSTACK_LINT_DEPTH=full eslint .    # + type-aware checks (CI), not recommended below v1
```

See [Installation](docs/installation.md), [Configuration](docs/configuration.md), and
[Migration](docs/migration.md) for full setup, options, and overrides.

## Config inspector

The preset returns a `FlatConfigComposer`, so the exact resolved config is inspectable:

```bash
npx @eslint/config-inspector --config eslint.config.ts
```

## Contributing

See [DEVELOPMENT.md](https://github.com/Zerya-Dev/nustack/blob/master/modules/lint/DEVELOPMENT.md) -
the design specification and other important information.

## Credits

- [Anthony Fu](https://github.com/antfu): for
  [`@antfu/eslint-config`](https://github.com/antfu/eslint-config) which this project is based on.

## License

[MIT](https://github.com/Zerya-Dev/nustack/blob/master/modules/lint/LICENSE) © Zerya and contributors

<!-- Badges -->

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt
[nuxt-href]: https://nuxt.com
