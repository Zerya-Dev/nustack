# `@nustack/nuxt-ui/require-popover-content`

Require the `#content` slot on `UPopover`. The similarly named `content` prop configures
floating position, collision handling, and alignment; it does not provide displayed content.

```vue
<!-- Incorrect: content config is not displayed content -->
<UPopover :content="{ side: 'right' }">
  <UButton label="Details" />
</UPopover>

<!-- Correct -->
<UPopover>
  <UButton label="Details" />
  <template #content>
    Details
  </template>
</UPopover>
```

## Further reading

- [Nuxt UI Popover](https://ui.nuxt.com/docs/components/popover)
