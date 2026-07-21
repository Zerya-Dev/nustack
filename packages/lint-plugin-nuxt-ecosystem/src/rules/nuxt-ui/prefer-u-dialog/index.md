# `@nustack/nuxt-ui/prefer-u-dialog`

Prefer `UModal` over a raw `dialog` element. `UModal` supplies Nuxt UI styling and Reka UI
dialog behavior, including focus management and screen-reader semantics.

```vue
<UModal title="Confirm deletion">
  <template #body>Are you sure?</template>
</UModal>
```

The migration is structural rather than a direct tag rename. Use `data-raw` for deliberately
hand-written native dialogs.
