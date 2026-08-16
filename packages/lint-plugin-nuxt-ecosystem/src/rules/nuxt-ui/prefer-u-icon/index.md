# `@nustack/nuxt-ui/prefer-u-icon`

Prefer Nuxt UI's `UIcon` component and its `name` prop over raw Iconify utility classes.
Only a native `<i>` or `<span>` is reported, never a component whose name merely lowercases
to one (`<Span>`). Suppress a deliberate low-level icon implementation with
`<!-- eslint-disable-next-line @nustack/nuxt-ui/prefer-u-icon -->`.

## Incorrect

```vue
<template>
  <span class="i-lucide-search" />
</template>
```

## Correct

```vue
<template>
  <UIcon name="i-lucide-search" />
</template>
```

## Further reading

- [Nuxt UI Icon](https://ui.nuxt.com/docs/components/icon)
