# Migration

NuStack Lint bundles `@nuxt/eslint` and the antfu base, so migrating mostly means
_removing_ the pieces you wired by hand and pointing your config at the factory.

## From `@nuxt/eslint`

1. Install the module; `@nuxt/eslint` is bundled, so you can drop it as a direct
   dependency.

   ```bash
   npx nuxi module add @nustackjs/lint
   ```

2. In `nuxt.config.ts`, list only `@nustackjs/lint` and remove the `eslint` key (the
   module sets `standalone: false` for you):

   ```diff
   export default defineNuxtConfig({
   -  modules: ['@nuxt/eslint'],
   -  eslint: { config: { standalone: false } },
   +  modules: ['@nustackjs/lint'],
   })
   ```

3. Point `eslint.config.ts` at the generated config (it wires in `withNuxt()` itself):

   ```diff
   - import withNuxt from './.nuxt/eslint.config.mjs'
   -
   - export default withNuxt()
   + export { default } from './.nuxt/nustack-eslint.mjs'
   ```

## From `@antfu/eslint-config` or a hand-rolled flat config

The antfu base is included and applied for you, so remove `@antfu/eslint-config` and the
standalone style/Tailwind/Vue plugins you were composing yourself, then use the setup
above. Tune the base through the `base` option instead of calling `antfu()` directly:

```ts
import { nustack } from './.nuxt/nustack-eslint.mjs'

export default nustack({
  base: { stylistic: { quotes: 'double' } }, // same options @antfu/eslint-config takes
})
```

## Keeping your own rules

Existing rule overrides don't need to be thrown away; fold them in:

```ts
nustack(
  { rules: { 'no-console': 'off' } }, // your global rules, applied last
  { files: ['scripts/**'], rules: { 'no-console': 'off' } }, // file-scoped config
)
```

See [Configuration](./configuration.md) for the full override surface.

## Non-Nuxt projects

A plain TypeScript/Vue repo migrates to the standalone entry instead of `withNuxt()`:

```ts
// eslint.config.ts
import nustack from '@nustackjs/lint/config'

export default nustack({ base: { type: 'lib' } })
```
