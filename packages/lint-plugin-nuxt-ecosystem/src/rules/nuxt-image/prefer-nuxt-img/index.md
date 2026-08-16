# `@nustack/nuxt-image/prefer-nuxt-img`

Prefer `<NuxtImg>` over a raw `<img>` once `@nuxt/image` is installed. A native `<img>` bypasses
the provider entirely: no resizing, no modern formats, no `densities`, and no lazy-loading
defaults.

An `<img>` inside a native `<picture>` or inside `<NuxtPicture>` is correct markup and stays
unreported. Only genuine native elements are reported: a component whose name merely lowercases to
`img` (`<Img>`) is left alone, as is `<image>` inside SVG.

Suppress intentional native markup with
`<!-- eslint-disable-next-line @nustack/nuxt-image/prefer-nuxt-img -->`.

## Incorrect

```vue
<template>
  <img src="/hero.png" alt="" width="640" height="360">
</template>
```

## Correct

```vue
<template>
  <NuxtImg src="/hero.png" alt="" width="640" height="360" />

  <picture>
    <source srcset="/hero.avif" type="image/avif">
    <img src="/hero.png" alt="" width="640" height="360">
  </picture>
</template>
```

## Further reading

- [Nuxt Image `<NuxtImg>`](https://image.nuxt.com/usage/nuxt-img)
