# `@nustack/nuxt-ui/require-icon-button-label`

Icon-, avatar-, and loading-only `UButton` instances need an accessible label. `label`,
`aria-label`, `title`, or visible slot content satisfies the rule.

```vue
<!-- Incorrect -->
<UButton icon="i-lucide-search" />
<UButton loading />

<!-- Correct -->
<UButton icon="i-lucide-search" aria-label="Search" />
<UButton loading label="Saving" />
```

## Further reading

- [Nuxt UI Button](https://ui.nuxt.com/docs/components/button)
