# @nustackjs/lint-plugin-nuxt-ecosystem

ESLint and [Oxlint](https://oxc.rs) rules for the Nuxt module ecosystem — today that
means [Nuxt UI](https://ui.nuxt.com) component-preference rules. Used by
[`@nustackjs/lint`](../../modules/lint), but works standalone in any flat ESLint config.

This package is the home for ecosystem sub-packs (Nuxt UI, and more to come); they all
ship under the scoped plugin name `@nustack/nuxt-ui` for now.

## Install

```bash
pnpm add -D @nustackjs/lint-plugin-nuxt-ecosystem
```

## Usage

Rule ids read `@nustack/nuxt-ui/<rule>`. Use `configs.ui` for just the Nuxt UI pack, or
`configs.recommended` for the union of every ecosystem pack in this package.

```js
// eslint.config.js
import nuxtEcosystem from '@nustackjs/lint-plugin-nuxt-ecosystem'

export default [
  // just the Nuxt UI pack…
  nuxtEcosystem.configs.ui,

  // …or wire rules yourself
  {
    plugins: { '@nustack/nuxt-ui': nuxtEcosystem },
    rules: { '@nustack/nuxt-ui/prefer-u-button': 'warn' },
  },
]
```

The same default export also loads in Oxlint via its
[JS-plugin support](https://oxc.rs/docs/guide/usage/linter/plugins) (built on
`@oxlint/plugins`).

## Rules

### Nuxt UI

| Rule | Description |
|---|---|
| [`@nustack/nuxt-ui/prefer-u-button`](./src/rules/nuxt-ui/prefer-u-button/index.md) | Prefer `<UButton>` over raw `<button>` when `@nuxt/ui` is available. |
| [`@nustack/nuxt-ui/prefer-u-form-controls`](./src/rules/nuxt-ui/prefer-u-form-controls/index.md) | Prefer Nuxt UI form controls over raw native form elements; type-aware (e.g. `<input type="number">` / `<UInput type="number">` → `<UInputNumber>`). |
| [`@nustack/nuxt-ui/prefer-u-link`](./src/rules/nuxt-ui/prefer-u-link/index.md) | Prefer `<ULink>` over raw `<a>` when `@nuxt/ui` is available. |
| [`@nustack/nuxt-ui/prefer-u-table`](./src/rules/nuxt-ui/prefer-u-table/index.md) | Prefer `<UTable>` over raw `<table>` when `@nuxt/ui` is available. |
| [`@nustack/nuxt-ui/no-deprecated-components`](./src/rules/nuxt-ui/no-deprecated-components/index.md) | Disallow Nuxt UI components renamed in v4 (e.g. `UButtonGroup` → `UFieldGroup`). |
| [`@nustack/nuxt-ui/no-deprecated-model-modifiers`](./src/rules/nuxt-ui/no-deprecated-model-modifiers/index.md) | Disallow the `v-model.nullify` modifier renamed to `.nullable` in Nuxt UI v4. |

## License

[MIT](./LICENSE) © Zerya
