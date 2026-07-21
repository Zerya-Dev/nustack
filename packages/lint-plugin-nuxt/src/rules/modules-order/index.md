# `@nustack/nuxt/modules-order`

Enforce a correct registration order for interdependent Nuxt modules.

Several Nuxt ecosystem modules read configuration or register components from one
another at setup time, so the order they appear in the `modules` array is significant.
When the order is wrong the failure is usually **silent**, the build succeeds but a
feature quietly does nothing.

This rule only reports when both modules of a pair are present; modules it doesn't know
about, and entries it can't statically resolve, are left alone.

## Enforced order

| Must come first | Must come after | Why |
|---|---|---|
| `@nuxt/ui` | `@nuxt/content` | Nuxt UI registers the prose components Content renders. ([docs](https://ui.nuxt.com/docs/getting-started/integrations/content)) |
| `@nuxtjs/i18n` | `@nuxtjs/seo` | Nuxt Site Config reads `baseUrl` and the current locale from the i18n config. ([docs](https://nuxtseo.com/docs/site-config/guides/i18n)) |
| `@nuxtjs/i18n` | `nuxt-site-config` | Same Site Config ⇄ i18n integration, when Site Config is used directly. |
| `@nuxtjs/seo` | `@nuxt/content` | With @nuxt/content v3 the wrong order silently breaks Content frontmatter processing. ([docs](https://nuxtseo.com/docs/nuxt-seo/guides/using-the-modules)) |

These constraints compose: `@nuxtjs/i18n` → `@nuxtjs/seo` → `@nuxt/content`, with
`@nuxt/ui` also before `@nuxt/content`.

## Incorrect

```ts
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxt/ui', // ✗ Nuxt UI prose components are not available to Content
  ],
})
```

## Correct

```ts
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/i18n',
    '@nuxtjs/seo',
    '@nuxt/ui',
    '@nuxt/content',
  ],
})
```
