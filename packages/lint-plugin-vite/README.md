# @nustackjs/lint-plugin-vite

ESLint and [Oxlint](https://oxc.rs) rules for [Vite](https://vite.dev) asset and
environment safety — catching `public/` imports and secret-looking `VITE_*` variables
that leak into the client bundle. Used by
[`@nustackjs/lint`](https://github.com/Zerya-Dev/nustack/tree/master/modules/lint), but
works standalone in any flat ESLint config.

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
  // turn on the curated set…
  vite.configs.recommended,

  // …or wire rules yourself
  {
    plugins: { '@nustack/vite': vite },
    rules: { '@nustack/vite/no-client-secret-pattern': 'error' },
  },
]
```

The same default export also loads in Oxlint via its
[JS-plugin support](https://oxc.rs/docs/guide/usage/linter/plugins) (built on
`@oxlint/plugins`).

## Rules

| Rule | Description |
|---|---|
| [`@nustack/vite/no-public-src-import`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-vite/src/rules/assets/no-public-src-import/index.md) | Disallow importing files from Vite `public/` directories. |
| [`@nustack/vite/no-client-secret-pattern`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-vite/src/rules/env/no-client-secret-pattern/index.md) | Disallow secret-looking `VITE_*` environment variable names. |

## License

[MIT](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-vite/LICENSE) © Zerya
