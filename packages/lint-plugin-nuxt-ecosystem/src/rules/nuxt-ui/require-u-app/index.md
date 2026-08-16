# `@nustack/nuxt-ui/require-u-app`

Require `UApp` in the Nuxt `app.vue` root. Nuxt UI documents it as the provider for global
configuration, reading direction, body-lock behavior, toasts, tooltips, and programmatic
modals/slideovers.

## Incorrect

`app.vue` without the Nuxt UI provider:

```vue
<template>
  <NuxtPage />
</template>
```

## Correct

```vue
<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>
```

Only the project-root `app.vue` and Nuxt 4's `app/app.vue` are checked. Other files named
`App.vue`, including Vue entry components and components inside workspace packages, are ignored.

## Further reading

- [Nuxt UI App](https://ui.nuxt.com/docs/components/app)
