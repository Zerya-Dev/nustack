# `@nustack/nuxt-ui/require-popover-content`

Require the `#content` slot on `UPopover`. The similarly named `content` prop configures
floating position, collision handling, and alignment; it does not provide displayed content.

## Incorrect

The `content` prop configures floating position; it is not displayed content:

```vue
<template>
  <UPopover :content="{ side: 'right' }">
    <UButton label="Details" />
  </UPopover>
</template>
```

## Correct

```vue
<template>
  <UPopover>
    <UButton label="Details" />
    <template #content>
      Details
    </template>
  </UPopover>
</template>
```

## Further reading

- [Nuxt UI Popover](https://ui.nuxt.com/docs/components/popover)
