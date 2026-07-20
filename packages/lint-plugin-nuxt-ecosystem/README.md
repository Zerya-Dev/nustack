# @nustackjs/lint-plugin-nuxt-ecosystem

[![npm version](https://img.shields.io/npm/v/@nustackjs/lint-plugin-nuxt-ecosystem)](https://www.npmjs.com/package/@nustackjs/lint-plugin-nuxt-ecosystem)
[![GitHub License](https://img.shields.io/github/license/Zerya-Dev/nustack)](https://github.com/Zerya-Dev/nustack/blob/master/LICENSE)

ESLint and [Oxlint](https://oxc.rs) rules for the [Nuxt module ecosystem](https://nuxt.com/modules). The plugin currently supports `@nuxt/ui` with plans to expand.

Every rule is based on the respective module's official documentation and recommendations.

If you are a developer of a popular module and want to add rules for it, please reach out.

This package is used by [`@nustackjs/lint`](https://github.com/Zerya-Dev/nustack/tree/master/modules/lint) but can also be used standalone in any flat ESLint configuration.

## Install

```bash
pnpm add -D @nustackjs/lint-plugin-nuxt-ecosystem
```

## Usage

Rule IDs start with `@nustack/nuxt-ui/<rule>`. You can use `configs.ui` to load only the Nuxt UI pack, or `configs.recommended` for all ecosystem packs included in this package.

```js
// eslint.config.js
import nuxtEcosystem from '@nustackjs/lint-plugin-nuxt-ecosystem'

export default [
  // load just the Nuxt UI pack
  nuxtEcosystem.configs.ui,

  // or configure rules manually
  {
    plugins: { '@nustack/nuxt-ui': nuxtEcosystem },
    rules: { '@nustack/nuxt-ui/prefer-u-button': 'warn' },
  },
]
```

These rules are compatible with Oxlint, although some may not work perfectly due to limited Vue support.

## Rules

### Nuxt UI

| Rule | Description |
|---|---|
| [`@nustack/nuxt-ui/prefer-u-button`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/prefer-u-button/index.md) | Prefer `<UButton>` over raw `<button>` when `@nuxt/ui` is available. |
| [`@nustack/nuxt-ui/prefer-u-form-controls`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/prefer-u-form-controls/index.md) | Prefer Nuxt UI form controls over raw native form elements; type-aware (e.g. `<input type="number">` / `<UInput type="number">` → `<UInputNumber>`). |
| [`@nustack/nuxt-ui/prefer-u-link`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/prefer-u-link/index.md) | Prefer `<ULink>` over raw `<a>` when `@nuxt/ui` is available. |
| [`@nustack/nuxt-ui/prefer-u-table`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/prefer-u-table/index.md) | Prefer `<UTable>` over raw `<table>` when `@nuxt/ui` is available. |
| [`@nustack/nuxt-ui/no-deprecated-components`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/no-deprecated-components/index.md) | Disallow Nuxt UI components renamed in v4 (e.g. `UButtonGroup` → `UFieldGroup`). |
| [`@nustack/nuxt-ui/no-deprecated-model-modifiers`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/no-deprecated-model-modifiers/index.md) | Disallow the `v-model.nullify` modifier renamed to `.nullable` in Nuxt UI v4. |

## License

[MIT](https://github.com/Zerya-Dev/nustack/blob/master/LICENSE) © Zerya and contributors
