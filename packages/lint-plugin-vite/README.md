# @nustackjs/lint-plugin-vite

[![npm version](https://img.shields.io/npm/v/@nustackjs/lint-plugin-vite)](https://www.npmjs.com/package/@nustackjs/lint-plugin-vite)
[![GitHub License](https://img.shields.io/github/license/Zerya-Dev/nustack)](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-vite/LICENSE)

ESLint and [Oxlint](https://oxc.rs) rules for [Vite](https://vite.dev) asset and environment safety. This plugin catches `public/` imports and secret-looking `VITE_*` variables that could leak into the client bundle.

Every rule is based on Vite's official documentation and recommendations.

This package is used by [`@nustackjs/lint`](https://github.com/Zerya-Dev/nustack/tree/master/modules/lint) but can also be used standalone in any flat ESLint configuration.

## Install

```bash
pnpm add -D @nustackjs/lint-plugin-vite
```

## Usage

The plugin registers under the scoped name `@nustack/vite`. Every rule ID starts with `@nustack/vite/<rule>`.

```js
// eslint.config.js
import vite from '@nustackjs/lint-plugin-vite'

export default [
  // turn on the curated set
  vite.configs.recommended,

  // or configure rules manually
  {
    plugins: { '@nustack/vite': vite },
    rules: { '@nustack/vite/no-client-secret-pattern': 'error' },
  },
]
```

These rules are written in plain JS/TS and are fully compatible with Oxlint.

## Rules

| Rule | Description |
|---|---|
| [`@nustack/vite/no-public-src-import`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-vite/src/rules/assets/no-public-src-import/index.md) | Disallow importing files from Vite `public/` directories. |
| [`@nustack/vite/no-dynamic-new-url`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-vite/src/rules/assets/no-dynamic-new-url/index.md) | Disallow dynamic template literals in `new URL(..., import.meta.url)`. |
| [`@nustack/vite/no-client-secret-pattern`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-vite/src/rules/env/no-client-secret-pattern/index.md) | Disallow secret-looking `VITE_*` environment variable names. |
| [`@nustack/vite/no-secret-define`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-vite/src/rules/define/no-secret-define/index.md) | Disallow secret-looking values in Vite `define` config. |

## License

[MIT](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-vite/LICENSE) © Zerya and contributors
