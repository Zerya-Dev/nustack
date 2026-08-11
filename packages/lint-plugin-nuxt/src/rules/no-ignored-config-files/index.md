# `@nustack/nuxt/no-ignored-config-files`

Disallow external configuration files that Nuxt ignores.

Nuxt uses `nuxt.config` as its single source of truth and does not read several
configuration files that their underlying tools commonly use. Keeping configuration in
one of these files makes it look active even though Nuxt silently skips it.
The rule reports candidates only when a `nuxt.config.{js,mjs,cjs,ts,mts,cts}` exists in
the same directory, so unrelated tool packages in a mixed monorepo are unaffected.

| Ignored file | Configure in `nuxt.config` |
|---|---|
| `nitro.config.{js,mjs,cjs,ts,mts,cts}` | `nitro` key |
| `postcss.config.{js,mjs,cjs,ts,mts,cts}` | `postcss` key |
| `vite.config.{js,mjs,cjs,ts,mts,cts}` | `vite` key |
| `webpack.config.{js,mjs,cjs,ts,mts,cts}` | `webpack` key |

See Nuxt's [External Configuration Files](https://nuxt.com/docs/4.x/getting-started/configuration#external-configuration-files) documentation.

The recommended config checks only the current Nuxt project root by default, so unrelated
tooling packages in a monorepo are not included. Configure nested Nuxt roots explicitly:

```ts
nuxtConfigs({ projectDirectories: ['apps/site', 'apps/admin'] })

// With @nustackjs/lint:
nustack({ nuxt: { projectDirectories: ['apps/site'] } })
```

## Incorrect

```ts
// vite.config.ts — ignored by Nuxt
export default defineConfig({
  build: {
    sourcemap: true,
  },
})
```

## Correct

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  vite: {
    build: {
      sourcemap: true,
    },
  },
})
```
