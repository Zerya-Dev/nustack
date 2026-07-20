# 🧹 NuStack Lint

[![npm version](https://img.shields.io/npm/v/@nustackjs/lint.svg)](https://npmjs.com/package/@nustackjs/lint)
[![npm downloads](https://img.shields.io/npm/dm/@nustackjs/lint.svg)](https://npmjs.com/package/@nustackjs/lint)
[![License](https://img.shields.io/npm/l/@nustackjs/lint.svg)](https://github.com/Zerya-Dev/nustack/blob/master/LICENSE)
[![Nuxt][nuxt-src]][nuxt-href]

Zero-config linting for Nuxt: one project-aware module that catches real bugs and validates conventions that usually live only in documentation across the ecosystem: Nuxt, Vite, Nuxt UI, VueUse, Tailwind, and more. Part of [NuStack](https://github.com/Zerya-Dev/nustack).

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

## ✨ What it does for you

- **Deep, ecosystem-aware rules**
  - Detect the Nuxt modules and tools your project uses, then auto-enable rules built from each tool's best practices.
- **One module, shared presets**
  - Stop wiring the same plugins and configs in every project; install one module and reuse the same preset across your apps.
- **Enforced decisions**
  - Keep practices and architectural decisions in executable rules instead of review comments or _even worse_ [`AGENTS.md`](https://evilmartians.com/chronicles/stop-writing-rules-in-agents-md-use-agent-hooks-and-nano-staged-instead).

For the longer design rationale, see the [RFC 01: NuStack Lint](../../rfcs/01-nustack-lint.md).

## 🛡️ Coverage

The preset composes these layers and gates each on what your project actually uses:

| Layer              | What it checks                                                 | Plugin                                                                                                                          |
| ------------------ | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Antfu base**     | Style, TypeScript, imports, and JS hygiene                     | [`@antfu/eslint-config`](https://github.com/antfu/eslint-config)                                                                |
| **Nuxt core**      | Auto-imports, `runtimeConfig`, module order, and `process.env` | [`@nuxt/eslint`](https://eslint.nuxt.com), [`nuxt`](https://github.com/Zerya-Dev/nustack/tree/master/packages/lint-plugin-nuxt) |
| **VueUse**         | Conventions and best practices for VueUse                      | [`vueuse`](https://github.com/Zerya-Dev/nustack/tree/master/packages/lint-plugin-vueuse)                                        |
| **Vite**           | Vite-specific rules and configurations                         | [`vite`](https://github.com/Zerya-Dev/nustack/tree/master/packages/lint-plugin-vite)                                            |
| **Nuxt ecosystem** | Conventions for popular Nuxt modules                           | [`nuxt-ecosystem`](https://github.com/Zerya-Dev/nustack/tree/master/packages/lint-plugin-nuxt-ecosystem)                        |
| **Tailwind**       | Class order and correctness                                    | [`better-tailwindcss`](https://github.com/schoero/eslint-plugin-better-tailwindcss)                                             |
| **Vue SFC**        | Conventions from `eslint-plugin-vue` (e.g. `lang="ts"` blocks) | `eslint-plugin-vue`                                                                                                             |

**Want a rule added, or a plugin integrated?** [Open an issue](https://github.com/Zerya-Dev/nustack/issues) as the ruleset is meant to grow with what the community uses.

## 🚀 Quick Start

### 1. Install Module

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

### 2. Add ESLint Config

Then point `eslint.config.ts` at the generated config:

```ts
// eslint.config.ts
export { default } from './.nuxt/nustack-eslint.mjs'
```

### 3. Run Checks

```bash
eslint .                            # quick checks (fast)
NUSTACK_LINT_DEPTH=full eslint .    # + type-aware checks (CI), not recommended below v1
```

See [Installation](docs/installation.md), [Configuration](docs/configuration.md), and [Migration](docs/migration.md) for full setup, options, and overrides.

> [!TIP]
> **Environments**
> A `target` option pre-fills the preset for the project you're actually in, such as a normal Nuxt app, a non-Nuxt Vue SPA, or a Nuxt module/library:
>
> ```ts
> nustack({ target: 'nuxt-app' })    // default for the generated Nuxt-path config
> nustack({ target: 'vue-app' })     // non-Nuxt Vue SPA (no `nuxt prepare` needed)
> nustack({ target: 'nuxt-module' }) // authoring a Nuxt module; `playground/**` lints itself
> ```
>
> See [Configuration](docs/configuration.md) for what each target pre-fills.

> [!TIP]
> **Config inspector**
> The preset returns a `FlatConfigComposer`, so the exact resolved config is inspectable:
>
> ```bash
> npx @eslint/config-inspector --config eslint.config.ts
> ```

## 🤝 Contributing

See [DEVELOPMENT.md](https://github.com/Zerya-Dev/nustack/blob/master/modules/lint/DEVELOPMENT.md) for the design specification and other important information.

## 👏 Credits

- [Anthony Fu](https://github.com/antfu): for [`@antfu/eslint-config`](https://github.com/antfu/eslint-config) which this project is based on.

## 📜 License

[MIT](https://github.com/Zerya-Dev/nustack/blob/master/LICENSE) © Zerya and contributors

<!-- Badges -->

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt
[nuxt-href]: https://nuxt.com
