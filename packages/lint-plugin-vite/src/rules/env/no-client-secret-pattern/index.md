# `@nustack/vite/no-client-secret-pattern`

Disallow secret-looking `VITE_*` environment variable names.

Vite exposes variables with the configured client prefix to browser code. A `VITE_*` variable with words like `TOKEN`, `SECRET`, `PASSWORD`, or `PRIVATE` is likely a leak. Key names qualified as public, publishable, or site keys are allowed.

## Incorrect

```ts
const token = import.meta.env.VITE_API_TOKEN
```

## Correct

```ts
const apiBase = import.meta.env.VITE_API_BASE
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
```

Keep private values server-only instead of prefixing them for client exposure.
