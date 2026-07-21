# `@nustack/nuxt-ui/require-popover-content`

Require the `#content` slot on `UPopover`. The similarly named `content` prop configures
floating position, collision handling, and alignment; it does not provide displayed content.

```vue
<UPopover>
  <UButton label="Details" />
  <template #content>
    Details
  </template>
</UPopover>
```
