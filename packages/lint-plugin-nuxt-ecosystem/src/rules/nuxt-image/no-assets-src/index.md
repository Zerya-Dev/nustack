# `@nustack/nuxt-image/no-assets-src`

Disallow a build-time `assets/` alias in the `src` of `<NuxtImg>` and `<NuxtPicture>`.

`src` is not resolved by the bundler — it is handed to the image provider as a URL at runtime, so
`~/assets/hero.png` is requested verbatim and 404s in production. Images the provider optimises
belong in `public/`; a file that has to stay in `assets/` must be imported and bound, which this
rule leaves alone, along with anything else it cannot resolve statically.

Every URL attribute is checked, including both `light` and `dark` on `<UColorModeImage>`.

## Incorrect

```vue
<template>
  <NuxtImg src="~/assets/hero.png" alt="" width="640" height="360" />
  <NuxtImg src="@/assets/hero.png" alt="" width="640" height="360" />
</template>
```

## Correct

```vue
<script setup lang="ts">
import hero from '~/assets/hero.png'
</script>

<template>
  <!-- served from `public/` and optimised by the provider -->
  <NuxtImg src="/hero.png" alt="" width="640" height="360" />

  <!-- bundled asset, resolved by Vite -->
  <NuxtImg :src="hero" alt="" width="640" height="360" />
</template>
```

## Further reading

- [Nuxt Image — static images](https://image.nuxt.com/get-started/installation#static-images)
- [Nuxt — `public/` vs `assets/`](https://nuxt.com/docs/guide/directory-structure/public)
