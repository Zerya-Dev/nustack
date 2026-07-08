# @nustackjs/lint-plugin-vueuse

ESLint and [Oxlint](https://oxc.rs) rules for [VueUse](https://vueuse.org) — nudging you
toward the composables and away from the raw browser APIs they wrap.

Every rule is grounded in VueUse's official docs, conventions, and recommendations, so
they're enforced in your project, not just documented.

Used by [`@nustackjs/lint`](https://github.com/Zerya-Dev/nustack/tree/master/modules/lint), but works standalone in any flat ESLint config.

## Install

```bash
pnpm add -D @nustackjs/lint-plugin-vueuse
```

## Usage

The plugin registers under the scoped name `@nustack/vueuse`, so every rule id reads
`@nustack/vueuse/<rule>`.

```js
// eslint.config.js
import vueuse from '@nustackjs/lint-plugin-vueuse'

export default [
  // turn on the curated set...
  vueuse.configs.recommended,

  // ...or wire rules yourself
  {
    plugins: { '@nustack/vueuse': vueuse },
    rules: { '@nustack/vueuse/no-namespace-import': 'error' },
  },
]
```

The same applies for OXLint, but some rules may not work due to limited Vue support.

## Rules

| Rule | Description |
|---|---|
| [`@nustack/vueuse/no-namespace-import`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-vueuse/src/rules/no-namespace-import/index.md) | Use named imports from `@vueuse/core` instead of namespace imports. |
| [`@nustack/vueuse/no-nuxt-auto-import-collision`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-vueuse/src/rules/no-nuxt-auto-import-collision/index.md) | Alias VueUse imports whose names collide with Nuxt auto-imports. |
| [`@nustack/vueuse/prefer-use-observers`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-vueuse/src/rules/prefer-use-observers/index.md) | Prefer VueUse observer composables over raw observer constructors. |
| [`@nustack/vueuse/prefer-use-storage`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-vueuse/src/rules/prefer-use-storage/index.md) | Prefer VueUse storage composables over direct `localStorage`/`sessionStorage`. |
| [`@nustack/vueuse/prefer-use-timers`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-vueuse/src/rules/prefer-use-timers/index.md) | Prefer VueUse timer composables over raw `setTimeout`/`setInterval`. |
| [`@nustack/vueuse/prefer-useclipboard`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-vueuse/src/rules/prefer-useclipboard/index.md) | Prefer `useClipboard()` over `navigator.clipboard`. |
| [`@nustack/vueuse/prefer-useevent-listener`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-vueuse/src/rules/prefer-useevent-listener/index.md) | Prefer `useEventListener()` over `add/removeEventListener`. |
| [`@nustack/vueuse/prefer-usewindow-size`](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-vueuse/src/rules/prefer-usewindow-size/index.md) | Prefer `useWindowSize()` over direct `window.innerWidth`/`innerHeight`. |

## License

[MIT](https://github.com/Zerya-Dev/nustack/blob/master/packages/lint-plugin-vueuse/LICENSE) © Zerya
