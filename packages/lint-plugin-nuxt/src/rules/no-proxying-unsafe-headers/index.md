# `@nustack/nuxt/no-proxying-unsafe-headers`

Disallow passing unsafe client header names to Nuxt's `useRequestHeaders()`. Proxy only the headers an API needs, especially when calling an external API.

The rule rejects the headers Nuxt documents as unsafe to proxy:

- `host`, `accept`
- `content-length`, `content-md5`, `content-type`
- `x-forwarded-host`, `x-forwarded-port`, `x-forwarded-proto`
- `cf-connecting-ip`, `cf-ray`

Header names are matched case-insensitively.

## Incorrect

```ts
const headers = useRequestHeaders(['cookie', 'host', 'content-type'])
```

## Correct

```ts
const headers = useRequestHeaders(['cookie', 'authorization'])
```

See Nuxt's [Pass Client Headers to the API](https://nuxt.com/docs/4.x/getting-started/data-fetching#pass-client-headers-to-the-api) guidance.
