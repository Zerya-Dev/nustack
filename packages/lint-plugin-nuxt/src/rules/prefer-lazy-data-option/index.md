# `@nustack/nuxt/prefer-lazy-data-option`

Prefer regular Nuxt data composables with `lazy: true` over the dedicated lazy composables.

The rule covers both pairs:

- `useLazyFetch(...)` → `useFetch(..., { lazy: true })`
- `useLazyAsyncData(...)` → `useAsyncData(..., { lazy: true })`

Incorrect:

```ts
useLazyFetch('/api/posts')
useLazyAsyncData('posts', () => $fetch('/api/posts'))
```

Correct:

```ts
useFetch('/api/posts', { lazy: true })
useAsyncData('posts', () => $fetch('/api/posts'), { lazy: true })
```

Only direct composable calls are checked.

See Nuxt's [`useLazyFetch`](https://nuxt.com/docs/4.x/api/composables/use-lazy-fetch) and [`useLazyAsyncData`](https://nuxt.com/docs/4.x/api/composables/use-lazy-async-data) documentation.
