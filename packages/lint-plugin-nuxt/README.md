# @nustackjs/lint-plugin-nuxt

ESLint and [Oxlint](https://oxc.rs) rules for [Nuxt](https://nuxt.com) conventions - 
`runtimeConfig` safety, auto-imports, keeping `process.env` out of app
code, and `nuxt.config` `modules` correctness (registration order, deprecated modules).

Every rule is grounded in Nuxt's official docs, conventions, and recommendations, so
they're enforced in your project, not just documented.

Used by [`@nustackjs/lint`](https://github.com/Zerya-Dev/nustack/tree/master/modules/lint), but works standalone in any flat ESLint config.

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
  // turn on the curated set...
  nuxt.configs.recommended,

  // ...or wire rules yourself
  {
    plugins: { '@nustack/nuxt': nuxt },
    rules: { '@nustack/nuxt/no-process-env': 'warn' },
  },
]
```

The same applies for OXLint, but some rules may not work due to limited Vue support.

## Rules

| Rule | Description |
|---|---|
| [`@nustack/nuxt/modules-order`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt/src/rules/modules-order/index.md) | Enforce a correct registration order for interdependent Nuxt modules. |
| [`@nustack/nuxt/no-deprecated-modules`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt/src/rules/no-deprecated-modules/index.md) | Disallow deprecated Nuxt modules in favor of their maintained successors. |
| [`@nustack/nuxt/no-explicit-auto-import`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt/src/rules/no-explicit-auto-import/index.md) | Disallow explicit imports of identifiers/components Nuxt already auto-imports. |
| [`@nustack/nuxt/no-process-env`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt/src/rules/no-process-env/index.md) | Disallow `process.env` in app code; use `runtimeConfig` / `useRuntimeConfig()`. |
| [`@nustack/nuxt/no-secret-in-public-runtimeconfig`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt/src/rules/no-secret-in-public-runtimeconfig/index.md) | Disallow secret-looking keys under `runtimeConfig.public`. |

## License

[MIT](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt/LICENSE) © Zerya and contributors
