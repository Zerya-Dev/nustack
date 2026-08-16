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

Suppress an intentional raw native anchor (e.g. a `mailto:` or external download link you
don't want routed) with `<!-- eslint-disable-next-line @nustack/nuxt-ui/prefer-u-link -->`.

Only genuine native elements are reported: a component whose name merely lowercases to the
tag (`<Link>`) is left alone, and so is SVG's own `<a>`.

## Further reading

- [Nuxt UI Link](https://ui.nuxt.com/docs/components/link)
