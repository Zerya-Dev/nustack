# `@nustack/nuxt-ui/prefer-open-model`

Use the explicit `open` model on `UModal`, `UDrawer`, `USlideover`, `UPopover`, and
`UTooltip`. Nuxt UI documents these components with `v-model:open`.

```vue
<!-- Incorrect -->
<UModal v-model="open" />

<!-- Correct -->
<UModal v-model:open="open" />
```
