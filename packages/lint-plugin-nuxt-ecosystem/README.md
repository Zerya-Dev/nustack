# @nustackjs/lint-plugin-nuxt-ecosystem

[![npm version](https://img.shields.io/npm/v/@nustackjs/lint-plugin-nuxt-ecosystem)](https://www.npmjs.com/package/@nustackjs/lint-plugin-nuxt-ecosystem)
[![GitHub License](https://img.shields.io/github/license/Zerya-Dev/nustack)](https://github.com/Zerya-Dev/nustack/blob/master/LICENSE)

ESLint and [Oxlint](https://oxc.rs) rules for the [Nuxt module ecosystem](https://nuxt.com/modules). The plugin currently supports `@nuxt/ui` with plans to expand.

Every rule is based on the respective module's official documentation and recommendations.
The Nuxt UI source review, enforceable conventions, and false-positive policy are recorded
in [`NUXT_UI_RESEARCH.md`](./NUXT_UI_RESEARCH.md).

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
| [`@nustack/nuxt-ui/no-conflicting-state-props`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/no-conflicting-state-props/index.md) | Disallow controlled state together with `default-open` or `default-value`. |
| [`@nustack/nuxt-ui/prefer-u-button`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/prefer-u-button/index.md) | Prefer `<UButton>` over raw `<button>` when `@nuxt/ui` is available. |
| [`@nustack/nuxt-ui/no-invalid-icon-name`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/no-invalid-icon-name/index.md) | Validate static Iconify-style icon names. |
| [`@nustack/nuxt-ui/no-invalid-prop-combinations`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/no-invalid-prop-combinations/index.md) | Disallow documented incompatible prop combinations such as `UFileUpload variant="button" multiple`. |
| [`@nustack/nuxt-ui/prefer-u-dialog`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/prefer-u-dialog/index.md) | Prefer `<UModal>` over raw `<dialog>`. |
| [`@nustack/nuxt-ui/prefer-u-form-controls`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/prefer-u-form-controls/index.md) | Prefer Nuxt UI form controls over raw native form elements; type-aware (e.g. `<input type="number">` / `<UInput type="number">` → `<UInputNumber>`). |
| [`@nustack/nuxt-ui/prefer-u-link`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/prefer-u-link/index.md) | Prefer `<ULink>` over raw `<a>` when `@nuxt/ui` is available. |
| [`@nustack/nuxt-ui/prefer-u-kbd`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/prefer-u-kbd/index.md) | Prefer `<UKbd>` over raw `<kbd>`. |
| [`@nustack/nuxt-ui/prefer-u-progress`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/prefer-u-progress/index.md) | Prefer `<UProgress>` over raw `<progress>`. |
| [`@nustack/nuxt-ui/prefer-u-separator`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/prefer-u-separator/index.md) | Prefer `<USeparator>` over raw `<hr>`. |
| [`@nustack/nuxt-ui/prefer-u-table`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/prefer-u-table/index.md) | Prefer `<UTable>` over raw `<table>` when `@nuxt/ui` is available. |
| [`@nustack/nuxt-ui/no-deprecated-components`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/no-deprecated-components/index.md) | Disallow Nuxt UI components renamed in v4 (e.g. `UButtonGroup` → `UFieldGroup`). |
| [`@nustack/nuxt-ui/no-deprecated-model-modifiers`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/no-deprecated-model-modifiers/index.md) | Disallow the `v-model.nullify` modifier renamed to `.nullable` in Nuxt UI v4. |
| [`@nustack/nuxt-ui/no-invalid-prop-values`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/no-invalid-prop-values/index.md) | Catch invalid static `color`, `variant`, and `size` values on common components. |
| [`@nustack/nuxt-ui/prefer-link-to`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/prefer-link-to/index.md) | Prefer `to` over `href` on `ULink` and link-capable `UButton`. |
| [`@nustack/nuxt-ui/prefer-open-model`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/prefer-open-model/index.md) | Prefer explicit `v-model:open` for Nuxt UI overlays. |
| [`@nustack/nuxt-ui/prefer-semantic-colors`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/prefer-semantic-colors/index.md) | Prefer theme-aware semantic color tokens over hard-coded palette classes. |
| [`@nustack/nuxt-ui/prefer-u-icon`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/prefer-u-icon/index.md) | Prefer `<UIcon name="...">` over raw Iconify class markup. |
| [`@nustack/nuxt-ui/require-avatar-alt`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/require-avatar-alt/index.md) | Require alt text on image-backed avatars. |
| [`@nustack/nuxt-ui/require-form-field-name`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/require-form-field-name/index.md) | Require `name` or `error-pattern` on form fields inside `<UForm>`. |
| [`@nustack/nuxt-ui/require-form-control-label`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/require-form-control-label/index.md) | Require an accessible label for Nuxt UI form controls. |
| [`@nustack/nuxt-ui/require-form-state`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/require-form-state/index.md) | Require the reactive `state` prop on `<UForm>`. |
| [`@nustack/nuxt-ui/require-icon-button-label`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/require-icon-button-label/index.md) | Require an accessible label for icon-only buttons. |
| [`@nustack/nuxt-ui/require-overlay-title`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/require-overlay-title/index.md) | Require accessible titles on modal, drawer, and slideover. |
| [`@nustack/nuxt-ui/require-popover-content`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/require-popover-content/index.md) | Require a `#content` slot on `<UPopover>`. |
| [`@nustack/nuxt-ui/require-tooltip-content`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/require-tooltip-content/index.md) | Require tooltip text or a content slot. |
| [`@nustack/nuxt-ui/require-u-app`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/require-u-app/index.md) | Require `<UApp>` in the Nuxt `app.vue` root. |

## License

[MIT](https://github.com/Zerya-Dev/nustack/blob/master/LICENSE) © Zerya and contributors
