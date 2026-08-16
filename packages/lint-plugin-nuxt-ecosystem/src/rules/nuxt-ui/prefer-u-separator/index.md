# `@nustack/nuxt-ui/prefer-u-separator`

Prefer `USeparator` over a raw `hr` element for consistent orientation, color, size, and
optional label handling.

## Incorrect

```vue
<template>
  <hr>
</template>
```

## Correct

```vue
<template>
  <USeparator />
</template>
```

Suppress intentional native markup with
`<!-- eslint-disable-next-line @nustack/nuxt-ui/prefer-u-separator -->`.

Only genuine native elements are reported: a component whose name merely lowercases to the
tag (`<Hr>`) is left alone.

## Further reading

- [Nuxt UI Separator](https://ui.nuxt.com/docs/components/separator)
