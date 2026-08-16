# `@nustack/nuxt-ui/require-tooltip-content`

Require non-empty `text`, `kbds`, or a `#content` slot on `UTooltip`. This prevents empty
hover targets and keeps the component useful for keyboard and pointer users.

## Incorrect

```vue
<template>
  <UTooltip><UButton icon="i-lucide-settings" aria-label="Settings" /></UTooltip>
</template>
```

## Correct

```vue
<template>
  <UTooltip text="Open settings"><UButton icon="i-lucide-settings" aria-label="Settings" /></UTooltip>
</template>
```

## Further reading

- [Nuxt UI Tooltip](https://ui.nuxt.com/docs/components/tooltip)
