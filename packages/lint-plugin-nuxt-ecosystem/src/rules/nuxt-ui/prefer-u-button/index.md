# `@nustack/nuxt-ui/prefer-u-button`

Prefer Nuxt UI's `<UButton>` over raw `<button>` elements when `@nuxt/ui` is available.

## Incorrect

```vue
<template>
  <button>Save</button>
</template>
```

## Correct

```vue
<template>
  <UButton>Save</UButton>
</template>
```

Use `data-raw` as a local escape hatch when a raw native button is intentional.
