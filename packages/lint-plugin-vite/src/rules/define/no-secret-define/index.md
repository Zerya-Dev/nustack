# `@nustack/vite/no-secret-define`

Disallow secret-looking values in Vite `define` config.

Vite's `define` option does compile-time text substitution — any secret placed there gets inlined into every bundle it touches (client and server alike), where it's readable in plain text. This flags `define` keys with secret-shaped names (`SECRET`, `TOKEN`, `PASSWORD`, `PRIVATE`, or an unqualified `KEY`), and `define` values that read a secret-shaped `process.env` variable regardless of the key name.

## Incorrect

```ts
export default defineConfig({
  define: {
    __API_SECRET__: JSON.stringify(process.env.API_SECRET),
    __CONFIG__: JSON.stringify(process.env.STRIPE_SECRET_KEY),
  },
})
```

## Correct

```ts
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __PUBLIC_API_KEY__: JSON.stringify(process.env.VITE_PUBLIC_API_KEY),
  },
})
```

Keep secrets server-only instead of inlining them through `define`.
