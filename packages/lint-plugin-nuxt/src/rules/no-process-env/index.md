# `@nustack/nuxt/no-process-env`

Disallow `process.env` in Nuxt app code. App configuration should be exposed through Nuxt `runtimeConfig` and read with `useRuntimeConfig()` so server/client access stays explicit.

## Incorrect

```ts
const apiBase = process.env.API_BASE
```

## Correct

```ts
const { public: { apiBase } } = useRuntimeConfig()
```

This rule is intended to be scoped by the umbrella preset to app code, excluding server-only and config files where direct environment access can still be valid.
