# @nustackjs/lint-plugin-nuxt

ESLint and [Oxlint](https://oxc.rs) rules for [Nuxt](https://nuxt.com) runtime
conventions — `runtimeConfig` safety, auto-imports, and keeping `process.env` out of app
code. Used by [`@nustackjs/lint`](../../modules/lint), but works standalone in any flat
ESLint config.

## Install

```bash
pnpm add -D @nustackjs/lint-plugin-nuxt
```

## Usage

The plugin registers under the scoped name `@nustack/nuxt`, so every rule id reads
`@nustack/nuxt/<rule>`.

```js
// eslint.config.js
import nuxt from '@nustackjs/lint-plugin-nuxt'

export default [
  // turn on the curated set…
  nuxt.configs.recommended,

  // …or wire rules yourself
  {
    plugins: { '@nustack/nuxt': nuxt },
    rules: { '@nustack/nuxt/no-process-env': 'warn' },
  },
]
```

The same default export also loads in Oxlint via its
[JS-plugin support](https://oxc.rs/docs/guide/usage/linter/plugins) (built on
`@oxlint/plugins`).

## Rules

| Rule | Description |
|---|---|
| [`@nustack/nuxt/no-explicit-auto-import`](./src/rules/no-explicit-auto-import/index.md) | Disallow explicit imports of identifiers/components Nuxt already auto-imports. |
| [`@nustack/nuxt/no-process-env`](./src/rules/no-process-env/index.md) | Disallow `process.env` in app code; use `runtimeConfig` / `useRuntimeConfig()`. |
| [`@nustack/nuxt/no-secret-in-public-runtimeconfig`](./src/rules/no-secret-in-public-runtimeconfig/index.md) | Disallow secret-looking keys under `runtimeConfig.public`. |

## License

[MIT](./LICENSE) © Zerya
