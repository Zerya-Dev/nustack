# `nustack/nuxt/no-secret-in-public-runtimeconfig`

> Variant: `minimal` (security floor) · Concern: `nuxt` · Fixable: no

Everything under `runtimeConfig.public` is serialized into the client bundle and shipped
to the browser. A key that looks like a secret (`*secret`, `*token`, `*key`,
`*password`) there is almost certainly a leak. This is a correctness/security floor, so
it's on at every variant — including `minimal`.

The rule walks `runtimeConfig.public` in `nuxt.config` (including nested groups) and
flags secret-looking keys.

## ❌ Incorrect

```ts
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiToken: '', // shipped to the browser
      auth: { password: '' }, // nested — still public
    },
  },
})
```

## ✅ Correct

```ts
export default defineNuxtConfig({
  runtimeConfig: {
    apiToken: '', // private — server only
    public: {
      siteName: 'nustack', // safe to expose
    },
  },
})
```

## Not auto-fixed

Moving a key out of `public` can change how it's read at runtime, so the fix is left to
a human.
