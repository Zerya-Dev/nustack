# `nustack/nuxt-ui/prefer-u-button`

> Variant: `recommended` · Concern: `nuxt-ui` (active only when `@nuxt/ui` is detected) · Fixable: no

When a project uses Nuxt UI, it has a styled, accessible `<UButton>`. Reaching for a raw
`<button>` reintroduces the styling/a11y decisions Nuxt UI already made, and splits your
buttons into two inconsistent kinds. NuStack standardizes on the component so buttons are
built one way. Genuinely need a bare element (resets, third-party slots)? Opt out
explicitly with `data-raw`.

## ❌ Incorrect

```vue
<template>
  <button @click="submit">
    Save
  </button>
</template>
```

## ✅ Correct

```vue
<template>
  <UButton @click="submit">
    Save
  </UButton>
</template>
```

```vue
<template>
  <!-- deliberate bare element -->
  <button data-raw class="sr-only-focusable">
    Skip to content
  </button>
</template>
```

## Not auto-fixed

Swapping `<button>` for `<UButton>` can require prop/slot changes, so the replacement is
intentionally a human/agent decision rather than a blind rewrite.
