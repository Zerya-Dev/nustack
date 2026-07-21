# `@nustack/nuxt-ui/prefer-u-kbd`

Prefer Nuxt UI's `UKbd` over a raw `kbd` element for theme-aware keyboard hints.

```vue
<!-- Incorrect -->
<kbd>K</kbd>

<!-- Correct -->
<UKbd value="K" />
```

Use `data-raw` when native markup is intentional.

## Further reading

- [Nuxt UI Kbd](https://ui.nuxt.com/docs/components/kbd)
