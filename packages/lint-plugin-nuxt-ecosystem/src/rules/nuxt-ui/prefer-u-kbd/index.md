# `@nustack/nuxt-ui/prefer-u-kbd`

Prefer Nuxt UI's `UKbd` over a raw `kbd` element for theme-aware keyboard hints.

## Incorrect

```vue
<template>
  <kbd>K</kbd>
</template>
```

## Correct

```vue
<template>
  <UKbd value="K" />
</template>
```

Suppress intentional native markup with
`<!-- eslint-disable-next-line @nustack/nuxt-ui/prefer-u-kbd -->`.

Only genuine native elements are reported: a component whose name merely lowercases to the
tag (`<Kbd>`) is left alone.

## Further reading

- [Nuxt UI Kbd](https://ui.nuxt.com/docs/components/kbd)
