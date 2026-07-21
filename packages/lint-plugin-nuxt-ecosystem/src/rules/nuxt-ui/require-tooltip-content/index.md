# `@nustack/nuxt-ui/require-tooltip-content`

Require `text` or a `#content` slot on `UTooltip`. This prevents empty hover targets and
keeps the component useful for keyboard and pointer users.

```vue
<!-- Incorrect -->
<UTooltip><UButton icon="i-lucide-settings" aria-label="Settings" /></UTooltip>

<!-- Correct -->
<UTooltip text="Open settings"><UButton icon="i-lucide-settings" aria-label="Settings" /></UTooltip>
```

## Further reading

- [Nuxt UI Tooltip](https://ui.nuxt.com/docs/components/tooltip)
