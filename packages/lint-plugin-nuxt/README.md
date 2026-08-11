# @nustackjs/lint-plugin-nuxt

[![npm version](https://img.shields.io/npm/v/@nustackjs/lint-plugin-nuxt)](https://www.npmjs.com/package/@nustackjs/lint-plugin-nuxt)
[![GitHub License](https://img.shields.io/github/license/Zerya-Dev/nustack)](https://github.com/Zerya-Dev/nustack/blob/master/LICENSE)

ESLint and [Oxlint](https://oxc.rs) rules for [Nuxt](https://nuxt.com) conventions. This plugin enforces `runtimeConfig` safety, correct auto-imports usage, prevents `process.env` leaks in app code, detects ignored external config files and validates `nuxt.config` module settings like registration order and deprecated modules.

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
| [`@nustack/nuxt/head-tag-style`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt/src/rules/head-tag-style/index.md) | Enforce either `useHead` (default) or Nuxt head components for head tags. |
| [`@nustack/nuxt/modules-order`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt/src/rules/modules-order/index.md) | Enforce a correct registration order for interdependent Nuxt modules. |
| [`@nustack/nuxt/no-async-data-after-mount`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt/src/rules/no-async-data-after-mount/index.md) | Disallow Nuxt data composables in callbacks that can run after component setup. |
| [`@nustack/nuxt/no-deprecated-modules`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt/src/rules/no-deprecated-modules/index.md) | Disallow deprecated Nuxt modules in favor of their maintained successors. |
| [`@nustack/nuxt/no-empty-async-data-key`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt/src/rules/no-empty-async-data-key/index.md) | Disallow empty explicit keys in Nuxt async-data composables. |
| [`@nustack/nuxt/no-explicit-auto-import`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt/src/rules/no-explicit-auto-import/index.md) | Disallow explicit imports of identifiers/components Nuxt already auto-imports. |
| [`@nustack/nuxt/no-fetch-during-setup`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt/src/rules/no-fetch-during-setup/index.md) | Disallow `$fetch` for data loaded during initial component setup. |
| [`@nustack/nuxt/no-ignored-config-files`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt/src/rules/no-ignored-config-files/index.md) | Disallow external configuration files that Nuxt ignores. |
| [`@nustack/nuxt/no-invalid-status-text`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt/src/rules/no-invalid-status-text/index.md) | Disallow non-HTTP-compliant characters in `createError()` status text. |
| [`@nustack/nuxt/no-process-env`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt/src/rules/no-process-env/index.md) | Disallow `process.env` in app code; use `runtimeConfig` / `useRuntimeConfig()`. |
| [`@nustack/nuxt/no-proxying-unsafe-headers`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt/src/rules/no-proxying-unsafe-headers/index.md) | Disallow proxying unsafe client headers with `useRequestHeaders()`. |
| [`@nustack/nuxt/no-ref-outside-setup`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt/src/rules/no-ref-outside-setup/index.md) | Disallow Vue refs outside `<script setup>` or a `setup()` function. |
| [`@nustack/nuxt/no-secret-in-public-runtimeconfig`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt/src/rules/no-secret-in-public-runtimeconfig/index.md) | Disallow secret-looking keys under `runtimeConfig.public`. |
| [`@nustack/nuxt/no-unserializable-use-state`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt/src/rules/no-unserializable-use-state/index.md) | Disallow values that Nuxt's default payload serializer cannot serialize in `useState` initializers. |
| [`@nustack/nuxt/prefer-lazy-data-option`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt/src/rules/prefer-lazy-data-option/index.md) | Prefer regular Nuxt data composables with `lazy: true` over dedicated lazy composables. |
| [`@nustack/nuxt/preserve-default-tsconfig`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt/src/rules/preserve-default-tsconfig/index.md) | Require Nuxt projects to preserve the default root TypeScript configuration. |

## License

[MIT](https://github.com/Zerya-Dev/nustack/blob/master/LICENSE) © Zerya and contributors
