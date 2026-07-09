# Installation

Install the Nuxt module:

```bash
npx nuxi module add @nustackjs/lint
```

List only `@nustackjs/lint` in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['@nustackjs/lint'],
})
```

Point `eslint.config.ts` at the generated config:

```ts
export { default } from './.nuxt/nustack-eslint.mjs'
```

Run lint:

```bash
eslint .                            # quick checks
NUSTACK_LINT_DEPTH=full eslint .    # type-aware checks, typically for CI
```

Use [Configuration](./configuration.md) for options and overrides, or
[Migration](./migration.md) when replacing an existing ESLint setup.
