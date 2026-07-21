# `@nustack/nuxt-ui/prefer-u-modal`

Prefer `UModal` over a raw `dialog` element. `UModal` supplies Nuxt UI styling and Reka UI
dialog behavior, including focus management and screen-reader semantics.

```vue
<!-- Incorrect -->
<dialog open>Confirm deletion?</dialog>

<!-- Correct -->
<UModal title="Confirm deletion">
  <template #body>Are you sure?</template>
</UModal>
```

The migration is structural rather than a direct tag rename. Use `data-raw` for deliberately
hand-written native dialogs.

## Further reading

- [Nuxt UI Modal](https://ui.nuxt.com/docs/components/modal)
