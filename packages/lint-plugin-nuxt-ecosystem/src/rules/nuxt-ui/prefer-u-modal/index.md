# `@nustack/nuxt-ui/prefer-u-modal`

Prefer `UModal` over a raw `dialog` element. `UModal` supplies Nuxt UI styling and Reka UI
dialog behavior, including focus management and screen-reader semantics.

## Incorrect

```vue
<template>
  <dialog open>Confirm deletion?</dialog>
</template>
```

## Correct

```vue
<template>
  <UModal title="Confirm deletion">
    <template #body>Are you sure?</template>
  </UModal>
</template>
```

The migration is structural rather than a direct tag rename. Suppress a deliberately
hand-written native dialog with `<!-- eslint-disable-next-line @nustack/nuxt-ui/prefer-u-modal -->`.

Only genuine native elements are reported: a component whose name merely lowercases to the
tag (`<Dialog>`) is left alone.

## Further reading

- [Nuxt UI Modal](https://ui.nuxt.com/docs/components/modal)
