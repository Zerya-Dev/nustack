# @nustackjs/lint-plugin-nuxt

[![npm version](https://img.shields.io/npm/v/@nustackjs/lint-plugin-nuxt)](https://www.npmjs.com/package/@nustackjs/lint-plugin-nuxt)
[![GitHub License](https://img.shields.io/github/license/Zerya-Dev/nustack)](https://github.com/Zerya-Dev/nustack/blob/master/LICENSE)

ESLint and [Oxlint](https://oxc.rs) rules for [Nuxt](https://nuxt.com) conventions. This plugin enforces `runtimeConfig` safety, correct auto-imports usage, prevents `process.env` leaks in app code, and validates `nuxt.config` module settings like registration order and deprecated modules.

Every rule is based on Nuxt's official documentation and recommendations.

This package is used by [`@nustackjs/lint`](https://github.com/Zerya-Dev/nustack/tree/master/modules/lint) but can also be used standalone in any flat ESLint configuration.

## Install

```bash
pnpm add -D @nustackjs/lint-plugin-nuxt
```

## Usage

The plugin registers under the scoped name `@nustack/nuxt`. Every rule ID starts with `@nustack/nuxt/<rule>`.

```js
// eslint.config.js
import nuxt from '@nustackjs/lint-plugin-nuxt'

export default [
  // turn on the curated set
  nuxt.configs.recommended,

  // or configure rules manually
  {
    plugins: { '@nustack/nuxt': nuxt },
    rules: { '@nustack/nuxt/no-process-env': 'warn' },
  },
]
```

These rules are compatible with Oxlint, although some may not work perfectly due to limited Vue support in Oxlint.

## Rules

| Rule | Description |
|---|---|
| [`@nustack/nuxt/modules-order`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt/src/rules/modules-order/index.md) | Enforce a correct registration order for interdependent Nuxt modules. |
| [`@nustack/nuxt/no-deprecated-modules`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt/src/rules/no-deprecated-modules/index.md) | Disallow deprecated Nuxt modules in favor of their maintained successors. |
| [`@nustack/nuxt/no-explicit-auto-import`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt/src/rules/no-explicit-auto-import/index.md) | Disallow explicit imports of identifiers/components Nuxt already auto-imports. |
| [`@nustack/nuxt/no-process-env`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt/src/rules/no-process-env/index.md) | Disallow `process.env` in app code; use `runtimeConfig` / `useRuntimeConfig()`. |
| [`@nustack/nuxt/no-secret-in-public-runtimeconfig`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt/src/rules/no-secret-in-public-runtimeconfig/index.md) | Disallow secret-looking keys under `runtimeConfig.public`. |

## License

[MIT](https://github.com/Zerya-Dev/nustack/blob/master/LICENSE) © Zerya and contributors
