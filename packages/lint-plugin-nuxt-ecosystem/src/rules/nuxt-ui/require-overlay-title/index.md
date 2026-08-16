# `@nustack/nuxt-ui/require-overlay-title`

Require an accessible title on `UModal`, `UDrawer`, and `USlideover`. A `title` prop, a
non-empty `#title` slot, or an accessible name in the `content` configuration satisfies the
rule. Root ARIA attributes label the trigger path, not the rendered overlay content.

## Incorrect

```vue
<template>
  <UModal><template #body>Delete this project?</template></UModal>
</template>
```

## Correct

```vue
<template>
  <UModal title="Delete project" />
  <UModal><template #title>Delete project</template></UModal>
</template>
```

## Further reading

- [Nuxt UI Modal](https://ui.nuxt.com/docs/components/modal)
- [Nuxt UI Drawer](https://ui.nuxt.com/docs/components/drawer)
- [Nuxt UI Slideover](https://ui.nuxt.com/docs/components/slideover)
