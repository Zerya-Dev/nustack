# `@nustack/nuxt-ui/prefer-u-link`

Prefer Nuxt UI's `<ULink>` over raw `<a>` elements when `@nuxt/ui` is available. `ULink`
wraps `<NuxtLink>` with active-state styling and accessibility handling, and is a near
drop-in for an anchor.

## Incorrect

```vue
<template>
  <a href="/home">Home</a>
</template>
```

## Correct

```vue
<template>
  <ULink to="/home">Home</ULink>
</template>
```

Use `data-raw` as a local escape hatch when a raw native anchor is intentional (e.g. a
`mailto:` or external download link you don't want routed).

## Further reading

- [Nuxt UI Link](https://ui.nuxt.com/docs/components/link)
