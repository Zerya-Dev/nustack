# `@nustack/nuxt-ui/prefer-u-form-controls`

Prefer Nuxt UI form controls over raw native form elements when `@nuxt/ui` is available.

## Incorrect

```vue
<template>
  <input v-model="email">
  <select v-model="country" />
  <textarea v-model="bio" />
</template>
```

## Correct

```vue
<template>
  <UInput v-model="email" />
  <USelect v-model="country" />
  <UTextarea v-model="bio" />
</template>
```

Use `data-raw` as a local escape hatch when a native control is intentional.
