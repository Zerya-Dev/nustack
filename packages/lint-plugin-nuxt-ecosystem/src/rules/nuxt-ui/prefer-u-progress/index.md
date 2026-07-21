# `@nustack/nuxt-ui/prefer-u-progress`

Prefer Nuxt UI's accessible and theme-aware `UProgress` over a raw `progress` element.

```vue
<!-- Incorrect -->
<progress :value="50" max="100" />

<!-- Correct -->
<UProgress :model-value="50" :max="100" />
```

Use `data-raw` when native markup is intentional.

## Further reading

- [Nuxt UI Progress](https://ui.nuxt.com/docs/components/progress)
