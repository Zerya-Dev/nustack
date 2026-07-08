# @nustackjs/lint-plugin-vite

ESLint and [Oxlint](https://oxc.rs) rules for [Vite](https://vite.dev) asset and environment safety -
catching `public/` imports and secret-looking `VITE_*` variables that leak 
into the client bundle.

Every rule is grounded in Vite's official docs, conventions, and recommendations, so
they're enforced in your project, not just documented.

Used by [`@nustackjs/lint`](https://github.com/Zerya-Dev/nustack/tree/master/modules/lint), but works standalone in any flat ESLint config.

## Install

```bash
pnpm add -D @nustackjs/lint-plugin-vite
```

## Usage

The plugin registers under the scoped name `@nustack/vite`, so every rule id reads
`@nustack/vite/<rule>`.

```js
// eslint.config.js
import vite from '@nustackjs/lint-plugin-vite'

export default [
  // turn on the curated set...
  vite.configs.recommended,

  // ...or wire rules yourself
  {
    plugins: { '@nustack/vite': vite },
    rules: { '@nustack/vite/no-client-secret-pattern': 'error' },
  },
]
```

The same applies for OXLint — these rules are plain JS/TS, so they run there too.

## Rules

| Rule | Description |
|---|---|
| [`@nustack/vite/no-public-src-import`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-vite/src/rules/assets/no-public-src-import/index.md) | Disallow importing files from Vite `public/` directories. |
| [`@nustack/vite/no-dynamic-new-url`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-vite/src/rules/assets/no-dynamic-new-url/index.md) | Disallow dynamic template literals in `new URL(..., import.meta.url)`. |
| [`@nustack/vite/no-client-secret-pattern`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-vite/src/rules/env/no-client-secret-pattern/index.md) | Disallow secret-looking `VITE_*` environment variable names. |
| [`@nustack/vite/no-secret-define`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-vite/src/rules/define/no-secret-define/index.md) | Disallow secret-looking values in Vite `define` config. |

## License

[MIT](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-vite/LICENSE) © Zerya and contributors
