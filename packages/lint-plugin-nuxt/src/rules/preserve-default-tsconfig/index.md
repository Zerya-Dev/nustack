# `@nustack/nuxt/preserve-default-tsconfig`

Require Nuxt projects to preserve the default root TypeScript configuration.

Nuxt generates separate TypeScript configurations for its app, server, shared, and
Node contexts. The root `tsconfig.json` should only reference those generated files;
changing it directly can overwrite settings supplied by Nuxt or its modules. Configure
TypeScript through `nuxt.config.ts` instead.

See Nuxt's [`tsconfig.json`](https://nuxt.com/docs/4.x/directory-structure/tsconfig)
documentation.

## Incorrect

```json
{
  "extends": "./.nuxt/tsconfig.json",
  "compilerOptions": {
    "strict": true
  }
}
```

## Correct

```json
{
  "files": [],
  "references": [
    { "path": "./.nuxt/tsconfig.app.json" },
    { "path": "./.nuxt/tsconfig.server.json" },
    { "path": "./.nuxt/tsconfig.shared.json" },
    { "path": "./.nuxt/tsconfig.node.json" }
  ]
}
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  typescript: {
    tsConfig: {
      compilerOptions: {
        strict: true,
      },
    },
  },
})
```
