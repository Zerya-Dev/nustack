# `@nustack/nuxt/no-deprecated-modules`

Disallow deprecated Nuxt modules in favor of their maintained successors.

Some widely used Nuxt modules are deprecated or were only ever needed for Nuxt 2.
Keeping them means missing fixes, fighting the framework's built-ins, or shipping an
unmaintained dependency. This rule flags them in the `modules` array and points at the
maintained replacement plus its migration guide.

## Deprecated modules

| Module | Use instead | Why |
|---|---|---|
| `@nuxtjs/mdc` | `@comark/nuxt` | MDC is superseded by [Comark](https://comark.dev), faster and framework-agnostic. Markdown files stay compatible; only the JS API changes. ([migration](https://comark.dev/kb/migration-from-mdc)) |
| `@nuxtjs/axios` | `$fetch` / `useFetch` | Nuxt 3+ ships `$fetch` (ofetch) and `useFetch`/`useAsyncData` with SSR payload dedupe. ([docs](https://nuxt.com/docs/getting-started/data-fetching)) |
| `@nuxt/http` | `$fetch` / `useFetch` | A Nuxt 2 module, replaced by the built-in `$fetch` and data-fetching composables. ([docs](https://nuxt.com/docs/getting-started/data-fetching)) |

## Incorrect

```ts
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/mdc',
    '@nuxtjs/axios',
  ],
})
```

## Correct

```ts
export default defineNuxtConfig({
  modules: [
    '@comark/nuxt',
  ],
})

// Data fetching uses the built-ins, no module needed:
const { data } = await useFetch('/api/posts')
```
