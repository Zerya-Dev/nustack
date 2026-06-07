# `nustack/nuxt/no-process-env`

> Variant: `recommended` · Concern: `nuxt` · Fixable: no

`process.env` is not reliably present in the browser bundle, so reading config that way
works on the server and silently breaks on the client. Nuxt already provides one
blessed path — `runtimeConfig` + `useRuntimeConfig()` — that works in both. nustack
standardizes on it so configuration is accessed one consistent way everywhere in app
code, instead of a mix of `process.env` and `useRuntimeConfig()` that each reviewer has
to think about.

Scoped to app code: `server/` handlers and `*.config.*` files (where `process.env` is
legitimate) are excluded by the `nuxt` concern.

## ❌ Incorrect

```ts
const apiBase = process.env.API_BASE
```

## ✅ Correct

```ts
const { apiBase } = useRuntimeConfig().public
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    public: { apiBase: '' }, // filled from NUXT_PUBLIC_API_BASE
  },
})
```

## Not auto-fixed

The right replacement depends on whether the value is public or private, so the fix
needs a human (or agent) decision rather than a blind rewrite.
