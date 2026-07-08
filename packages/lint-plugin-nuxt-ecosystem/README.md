# @nustackjs/lint-plugin-nuxt-ecosystem

ESLint and [Oxlint](https://oxc.rs) rules for the [Nuxt module ecosystem](https://nuxt.com/modules).
Currently supports `@nuxt/ui`, but the list will grow fast.

Every rule is grounded in each module's official docs, conventions, and recommendations,
so they're enforced in your project, not just documented.

If you are a developer of a fairly popular module, please reach out; we'd love to add it!

Used by [`@nustackjs/lint`](https://github.com/Zerya-Dev/nustack/tree/master/modules/lint), but works standalone in any flat ESLint config.

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
  // just the Nuxt UI pack...
  nuxtEcosystem.configs.ui,

  // ...or wire rules yourself
  {
    plugins: { '@nustack/nuxt-ui': nuxtEcosystem },
    rules: { '@nustack/nuxt-ui/prefer-u-button': 'warn' },
  },
]
```

The same applies for OXLint, but some rules may not work due to limited Vue support.

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

[MIT](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/LICENSE) © Zerya and contributors
