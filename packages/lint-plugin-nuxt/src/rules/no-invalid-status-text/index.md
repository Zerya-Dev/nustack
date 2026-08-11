# `@nustack/nuxt/no-invalid-status-text`

Disallow non-HTTP-compliant characters in the `statusText` passed to Nuxt's `createError()`.

HTTP status text is a short reason phrase and may contain only horizontal tabs, spaces, and visible ASCII characters (`[\t\u0020-\u007E]`). Put detailed descriptions, multi-line messages, and non-ASCII content in `message` instead.

The rule checks statically known string and template literals. Dynamic values are left unchanged.

## Incorrect

```ts
throw createError({
  status: 404,
  statusText: 'Page non trouvée\nVeuillez réessayer.',
})
```

## Correct

```ts
throw createError({
  status: 404,
  statusText: 'Not Found',
  message: 'Page non trouvée. Veuillez réessayer.',
})
```

See Nuxt's [`createError` error-handling guidance](https://nuxt.com/docs/4.x/getting-started/error-handling#createerror).
