# `@nustack/nuxt/no-empty-async-data-key`

Disallow empty explicit keys in `useAsyncData` and `useLazyAsyncData`.

Nuxt uses async-data keys to cache and deduplicate requests across components. An explicitly empty key cannot identify the request, so Nuxt reports the `NUXT_E3008` diagnostic.

Incorrect:

```ts
useAsyncData('', () => $fetch('/api/users'))
useLazyAsyncData(``, () => $fetch('/api/users'))
```

Correct:

```ts
useAsyncData('users', () => $fetch('/api/users'))
useLazyAsyncData('users', () => $fetch('/api/users'))

// Nuxt's compiler generates a key for this overload.
useAsyncData(() => $fetch('/api/users'))
```

The rule recognizes Nuxt auto-imports, named imports and aliases from `#app`, `#imports`, and `nuxt/app`, and Nuxt namespace imports. It reports only statically empty string and template literals; dynamic and reactive keys are validated by Nuxt at runtime.

See [Nuxt error `NUXT_E3008`](https://nuxt.com/docs/4.x/errors/e3008) and the [`useAsyncData` documentation](https://nuxt.com/docs/4.x/api/composables/use-async-data).
