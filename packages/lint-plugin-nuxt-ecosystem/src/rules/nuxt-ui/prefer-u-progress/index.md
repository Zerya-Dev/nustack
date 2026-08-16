# `@nustack/nuxt-ui/prefer-u-progress`

Prefer Nuxt UI's accessible and theme-aware `UProgress` over a raw `progress` element.

## Incorrect

```vue
<template>
  <progress :value="50" max="100" />
</template>
```

## Correct

```vue
<template>
  <UProgress :model-value="50" :max="100" />
</template>
```

Suppress intentional native markup with
`<!-- eslint-disable-next-line @nustack/nuxt-ui/prefer-u-progress -->`.

Only genuine native elements are reported: a component whose name merely lowercases to the
tag (`<Progress>`) is left alone, and so are SVG elements.

## Further reading

- [Nuxt UI Progress](https://ui.nuxt.com/docs/components/progress)
