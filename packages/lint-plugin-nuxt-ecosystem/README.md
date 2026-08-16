# @nustackjs/lint-plugin-nuxt-ecosystem

[![npm version](https://img.shields.io/npm/v/@nustackjs/lint-plugin-nuxt-ecosystem)](https://www.npmjs.com/package/@nustackjs/lint-plugin-nuxt-ecosystem)
[![GitHub License](https://img.shields.io/github/license/Zerya-Dev/nustack)](https://github.com/Zerya-Dev/nustack/blob/master/LICENSE)

ESLint rules for the [Nuxt module ecosystem](https://nuxt.com/modules). The plugin currently supports `@nuxt/ui` and `@nuxt/image`, with plans to expand.

Every rule is based on the respective module's official documentation and recommendations.

If you are a developer of a popular module and want to add rules for it, please reach out.

This package is used by [`@nustackjs/lint`](https://github.com/Zerya-Dev/nustack/tree/master/modules/lint) but can also be used standalone in any flat ESLint configuration.

## Usage

```bash
pnpm add -D eslint eslint-plugin-vue @typescript-eslint/parser @nustackjs/lint-plugin-nuxt-ecosystem
```

Enable the modules your project actually has — nothing is implicit, this package never inspects
your dependencies. Every rule reads the SFC template, so all of them are scoped to `**/*.vue`.

<details>
<summary><b>ESLint</b> — <code>eslint.config.js</code></summary>

```js
// `eslint-plugin-vue` supplies the SFC parser these rules use to read the template.
import tsParser from '@typescript-eslint/parser'
import { nuxtEcosystemConfigs } from '@nustackjs/lint-plugin-nuxt-ecosystem'
import vue from 'eslint-plugin-vue'

export default [
  ...vue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: { parserOptions: { parser: tsParser } },
  },
  ...nuxtEcosystemConfigs({
    nuxtUi: true,
    nuxtImage: true,
  }),
]
```

`true` enables a module with its defaults; an options object both enables and configures it.
Omitted modules stay disabled:

```js
nuxtEcosystemConfigs({ nuxtUi: true })
nuxtEcosystemConfigs({ nuxtImage: { preset: 'minimal' } })
```

`nuxtUiConfig()` and `nuxtImageConfig()` are also exported directly, for when only one of them
is needed.

</details>

<details>
<summary><b>Antfu's ESLint config</b> — <code>eslint.config.js</code></summary>

```js
// `vue: true` brings in `eslint-plugin-vue`, which these rules need for the SFC parser.
import antfu from '@antfu/eslint-config'
import { nuxtEcosystemConfigs } from '@nustackjs/lint-plugin-nuxt-ecosystem'

export default antfu(
  { vue: true },
  ...nuxtEcosystemConfigs({
    nuxtUi: true,
    nuxtImage: true,
  }),
)
```

</details>

<details>
<summary><b><code>@nustackjs/lint</code></b> — <code>eslint.config.js</code></summary>

`@nustackjs/lint` detects `@nuxt/ui` and `@nuxt/image` and enables their configs for you, with
the prefix your Nuxt UI setup uses. No ecosystem options are required:

```js
import { nustack } from '@nustackjs/lint/config'

export default nustack()
```

Use `nuxtEcosystem` only to override the detected defaults or disable a module explicitly:

```js
export default nustack({
  nuxtEcosystem: {
    nuxtUi: { rules: { '@nustack/nuxt-ui/prefer-u-button': 'off' } },
    nuxtImage: false,
  },
})
```

</details>

### Oxlint

Oxlint cannot run these rules yet. Its JavaScript plugin API does not currently support custom
Vue file formats and parsers, while every rule in this package reads the Vue template AST. The
rules use the `@oxlint/plugins` authoring API so they can become compatible when that limitation
is removed, but this is not runtime support today.

### Presets

Every module ships the same two presets, and defaults to `recommended`:

| Preset | Contents | Default |
|---|---|---|
| `minimal` | Invalid usage, accessibility defects, removed or renamed APIs (`error`) | |
| `recommended` | `minimal` plus design-system preferences (`warn`) | Yes |

```js
nuxtEcosystemConfigs({
  nuxtUi: { preset: 'minimal', prefix: 'Nu' },
  nuxtImage: { preset: 'recommended' },
})
```

`prefix` is a `nuxtUiConfig` option matching Nuxt UI's `ui.prefix`; it is shared with all UI
rules through ESLint settings rather than repeated in every rule entry.

### Individual Rules

Use `preset: false` to enable only selected rules:

```js
nuxtUiConfig({
  preset: false,
  rules: {
    '@nustack/nuxt-ui/require-avatar-alt': 'error',
    '@nustack/nuxt-ui/prefer-u-button': 'warn',
  },
})
```

For full control, `nuxtUiPlugins`/`nuxtImagePlugins` (or `nuxtEcosystemPlugins` for all of them)
and `nuxtUiRules()`/`nuxtImageRules()` are exported separately, so the plugins and their rule
records can go into a flat-config object you build yourself.

## Rules

Each module has its own rule-id namespace and presets, so rules for a module you do not use are
never registered.

### `@nuxt/ui`

Rule IDs use the `@nustack/nuxt-ui/<rule>` namespace. Set `prefix` on `nuxtUiConfig()` (or the
`nuxtUi` options passed to `nuxtEcosystemConfigs()`), not on individual rules.

| Rule | Preset | Fix | Description |
|---|---|---|---|
| [`no-conflicting-state-props`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/no-conflicting-state-props/index.md) | `minimal` | No | Disallow controlled state together with its ignored default prop. |
| [`no-invalid-prop-combinations`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/no-invalid-prop-combinations/index.md) | `minimal` | No | Disallow documented incompatible prop combinations. |
| [`require-avatar-alt`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/require-avatar-alt/index.md) | `minimal` | No | Require alt text on image-backed avatars. |
| [`require-form-control-label`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/require-form-control-label/index.md) | `minimal` | No | Require an accessible label for form controls. |
| [`require-form-field-name`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/require-form-field-name/index.md) | `minimal` | No | Require a validation target on fields inside `UForm`. |
| [`require-icon-button-label`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/require-icon-button-label/index.md) | `minimal` | No | Require an accessible name for icon-only buttons. |
| [`require-nested-form-prop`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/require-nested-form-prop/index.md) | `minimal` | No | Require `nested` on a `UForm` inside another `UForm`. |
| [`require-overlay-title`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/require-overlay-title/index.md) | `minimal` | No | Require accessible titles on modal, drawer, and slideover. |
| [`require-popover-content`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/require-popover-content/index.md) | `minimal` | No | Require a content slot on `UPopover`. |
| [`require-tooltip-content`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/require-tooltip-content/index.md) | `minimal` | No | Require tooltip text or a content slot. |
| [`require-u-app`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/require-u-app/index.md) | `minimal` | No | Require `UApp` around the Nuxt application root. |
| [`no-deprecated-components`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/no-deprecated-components/index.md) | `minimal` | Partial | Replace simple Nuxt UI component renames (v3 and v4). |
| [`no-deprecated-model-modifiers`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/no-deprecated-model-modifiers/index.md) | `minimal` | Yes | Replace the v3 `nullify` model modifier with `nullable`. |
| [`prefer-link-to`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/prefer-link-to/index.md) | `recommended` | No | Prefer `to` over `href` for internal navigation. |
| [`prefer-u-button`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/prefer-u-button/index.md) | `recommended` | No | Prefer `UButton` over raw `button`. |
| [`prefer-u-form-controls`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/prefer-u-form-controls/index.md) | `recommended` | No | Prefer Nuxt UI form controls over native controls. |
| [`prefer-u-form-field`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/prefer-u-form-field/index.md) | `recommended` | No | Prefer `UFormField` over hand-written label/control pairs. |
| [`prefer-u-icon`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/prefer-u-icon/index.md) | `recommended` | No | Prefer `UIcon` over raw Iconify class markup. |
| [`prefer-u-kbd`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/prefer-u-kbd/index.md) | `recommended` | No | Prefer `UKbd` over raw `kbd`. |
| [`prefer-u-link`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/prefer-u-link/index.md) | `recommended` | No | Prefer `ULink` over raw anchors. |
| [`prefer-u-modal`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/prefer-u-modal/index.md) | `recommended` | No | Prefer `UModal` over raw dialogs. |
| [`prefer-u-progress`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/prefer-u-progress/index.md) | `recommended` | No | Prefer `UProgress` over raw progress elements. |
| [`prefer-u-separator`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/prefer-u-separator/index.md) | `recommended` | No | Prefer `USeparator` over raw horizontal rules. |
| [`prefer-u-table`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/prefer-u-table/index.md) | `recommended` | No | Prefer `UTable` over hand-written tables. |
| [`prefer-u-tree`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-ui/prefer-u-tree/index.md) | `recommended` | No | Prefer `UTree` over hand-written tree semantics. |

### `@nuxt/image`

Rule IDs use the `@nustack/nuxt-image/<rule>` namespace. When `nuxtUiConfig()` is also present,
they cover Nuxt UI's `<UColorModeImage>` and `<ProseImg>`.

| Rule | Preset | Fix | Description |
|---|---|---|---|
| [`no-assets-src`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-image/no-assets-src/index.md) | `minimal` | No | Disallow build-time `~/assets` paths in `src`. |
| [`require-image-alt`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-image/require-image-alt/index.md) | `minimal` | No | Require alt text on `NuxtImg` and `NuxtPicture`. |
| [`prefer-nuxt-img`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-nuxt-ecosystem/src/rules/nuxt-image/prefer-nuxt-img/index.md) | `recommended` | No | Prefer `NuxtImg` over raw `img`. |

## License

[MIT](https://github.com/Zerya-Dev/nustack/blob/master/LICENSE) © Zerya and contributors
