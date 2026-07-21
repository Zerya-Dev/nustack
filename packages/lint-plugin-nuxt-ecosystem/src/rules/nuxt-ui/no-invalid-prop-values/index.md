# `@nustack/nuxt-ui/no-invalid-prop-values`

Catch statically invalid `color`, `variant`, and `size` values for commonly used Nuxt UI
components. Dynamic bindings are ignored so custom runtime themes remain possible.

```vue
<!-- Incorrect: `colour` is not a Nuxt UI color -->
<UButton color="colour" />

<!-- Correct -->
<UButton color="primary" variant="outline" size="md" />
```

Project-specific theme values can be registered without replacing the documented values:

```js
'@nustack/nuxt-ui/no-invalid-prop-values': ['warn', {
  values: { UButton: { variant: ['brand'] } },
}]
```
