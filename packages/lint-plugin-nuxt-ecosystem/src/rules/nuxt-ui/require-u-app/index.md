# `@nustack/nuxt-ui/require-u-app`

Require `UApp` in the Nuxt `app.vue` root. Nuxt UI documents it as the provider for global
configuration, reading direction, body-lock behavior, toasts, tooltips, and programmatic
modals/slideovers.

```vue
<!-- Incorrect: app.vue without the Nuxt UI provider -->
<template>
  <NuxtPage />
</template>

<!-- Correct -->
<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>
```

Files under `components`, `pages`, and `layouts` are ignored even if named `App.vue`.

## Further reading

- [Nuxt UI App](https://ui.nuxt.com/docs/components/app)
