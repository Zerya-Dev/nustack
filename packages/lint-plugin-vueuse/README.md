# @nustackjs/lint-plugin-vueuse

ESLint and [Oxlint](https://oxc.rs) rules for [VueUse](https://vueuse.org) — nudging you
toward the composables and away from the raw browser APIs they wrap. Used by
[`@nustackjs/lint`](../../modules/lint), but works standalone in any flat ESLint config.

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
  // turn on the curated set…
  vueuse.configs.recommended,

  // …or wire rules yourself
  {
    plugins: { '@nustack/vueuse': vueuse },
    rules: { '@nustack/vueuse/no-namespace-import': 'error' },
  },
]
```

The same default export also loads in Oxlint via its
[JS-plugin support](https://oxc.rs/docs/guide/usage/linter/plugins) (built on
`@oxlint/plugins`).

## Rules

| Rule | Description |
|---|---|
| [`@nustack/vueuse/no-namespace-import`](./src/rules/no-namespace-import/index.md) | Use named imports from `@vueuse/core` instead of namespace imports. |
| [`@nustack/vueuse/no-nuxt-auto-import-collision`](./src/rules/no-nuxt-auto-import-collision/index.md) | Alias VueUse imports whose names collide with Nuxt auto-imports. |
| [`@nustack/vueuse/prefer-use-observers`](./src/rules/prefer-use-observers/index.md) | Prefer VueUse observer composables over raw observer constructors. |
| [`@nustack/vueuse/prefer-use-storage`](./src/rules/prefer-use-storage/index.md) | Prefer VueUse storage composables over direct `localStorage`/`sessionStorage`. |
| [`@nustack/vueuse/prefer-use-timers`](./src/rules/prefer-use-timers/index.md) | Prefer VueUse timer composables over raw `setTimeout`/`setInterval`. |
| [`@nustack/vueuse/prefer-useclipboard`](./src/rules/prefer-useclipboard/index.md) | Prefer `useClipboard()` over `navigator.clipboard`. |
| [`@nustack/vueuse/prefer-useevent-listener`](./src/rules/prefer-useevent-listener/index.md) | Prefer `useEventListener()` over `add/removeEventListener`. |
| [`@nustack/vueuse/prefer-usewindow-size`](./src/rules/prefer-usewindow-size/index.md) | Prefer `useWindowSize()` over direct `window.innerWidth`/`innerHeight`. |

## License

[MIT](./LICENSE) © Zerya
