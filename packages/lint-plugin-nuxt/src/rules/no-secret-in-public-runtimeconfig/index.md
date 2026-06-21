# `@nustack/nuxt/no-secret-in-public-runtimeconfig`

Disallow secret-looking keys under `runtimeConfig.public` in Nuxt config.

Values inside `runtimeConfig.public` are serialized into the client bundle. Keys containing words like `secret`, `token`, `private`, or `password` usually belong in private runtime config instead. Key names qualified as public, publishable, or site keys are allowed.

## Incorrect

```ts
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiToken: process.env.API_TOKEN,
    },
  },
})
```

## Correct

```ts
export default defineNuxtConfig({
  runtimeConfig: {
    apiToken: process.env.API_TOKEN,
    public: {
      apiBase: '/api',
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    },
  },
})
```
