# `nustack/nuxt-ui/prefer-u-form-controls`

> Variant: `recommended` · Concern: `nuxt-ui` (active only when `@nuxt/ui` is detected) · Fixable: no

The companion to [`prefer-u-button`](../prefer-u-button/index.md) for form fields. Nuxt
UI ships `<UInput>`, `<USelect>` and `<UTextarea>` with consistent styling, sizing and
a11y wiring. Raw `<input>` / `<select>` / `<textarea>` bypass all of that and create a
second, inconsistent flavor of form control. NuStack standardizes on the Nuxt UI
controls; opt out of a specific element with `data-raw`.

| Raw element | Nuxt UI replacement |
|---|---|
| `<input>` | `<UInput>` |
| `<select>` | `<USelect>` |
| `<textarea>` | `<UTextarea>` |

## ❌ Incorrect

```vue
<template>
  <input v-model="email" type="email">
</template>
```

## ✅ Correct

```vue
<template>
  <UInput v-model="email" type="email" />
</template>
```

```vue
<template>
  <input data-raw type="file" @change="onPick">
</template>
```

## Not auto-fixed

Mapping native attributes onto Nuxt UI props isn't always 1:1, so the swap is left to a
human/agent.
