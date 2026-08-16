# `@nustack/nuxt-image/require-image-alt`

Require `alt` on `<NuxtImg>` and `<NuxtPicture>`, plus Nuxt UI's wrappers around them
(`<UColorModeImage>`, `<ProseImg>`). None of them invents alternative text. Use `aria-hidden` for
a decorative image; an empty `alt=""` counts as one too.

Components are matched by identity: `<nuxt-img>`, `<LazyNuxtImg>` and an aliased import are all
reported, your own local `NuxtImg` is not.

## Incorrect

```vue
<template>
  <NuxtImg src="/team/ada.png" width="320" height="320" />
</template>
```

## Correct

```vue
<template>
  <!-- meaningful image -->
  <NuxtImg src="/team/ada.png" alt="Ada Lovelace" width="320" height="320" />

  <!-- decorative image -->
  <NuxtPicture src="/pattern.png" aria-hidden="true" width="16" height="16" />

  <!-- Nuxt UI wrapper, same requirement -->
  <UColorModeImage light="/logo-light.svg" dark="/logo-dark.svg" alt="Nustack" />
</template>
```

## Further reading

- [Nuxt Image `<NuxtImg>`](https://image.nuxt.com/usage/nuxt-img)
- [WCAG 1.1.1 Non-text Content](https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html)
