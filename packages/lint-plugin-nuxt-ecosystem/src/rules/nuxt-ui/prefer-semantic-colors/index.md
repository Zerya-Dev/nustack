# `@nustack/nuxt-ui/prefer-semantic-colors`

Prefer Nuxt UI's semantic tokens (`text-muted`, `bg-elevated`, `border-default`,
`text-success`, and similar) over hard-coded Tailwind palette classes. Semantic tokens
adapt to the configured theme and dark mode.

Use `data-raw` for a deliberate brand or illustration color.

```vue
<!-- Incorrect -->
<div class="border-gray-200 bg-gray-50 text-gray-500" />

<!-- Correct -->
<div class="border-default bg-elevated text-muted" />
```

## Further reading

- [Nuxt UI design system](https://ui.nuxt.com/docs/getting-started/theme/design-system)
