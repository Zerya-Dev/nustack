# `@nustack/nuxt-ui/require-icon-button-label`

Icon-, avatar-, and loading-only `UButton` instances need an accessible label. `label`,
`aria-label`, `title`, or visible slot content satisfies the rule.

A button counts as icon-only when it carries `icon`, `leading-icon`, `trailing-icon` or `avatar`,
when it can be `loading` (anything but a statically `false` value), or when its only content is a
`UIcon`/`UAvatar` — including one passed through a `#leading` or `#trailing` slot. Those two
components render an image and no text, so they never answer for the label themselves.

## Incorrect

```vue
<template>
  <UButton icon="i-lucide-search" />
  <UButton loading />
  <UButton leading-icon="i-lucide-search" />
  <UButton>
    <UIcon name="i-lucide-search" />
  </UButton>
</template>
```

## Correct

```vue
<template>
  <UButton icon="i-lucide-search" aria-label="Search" />
  <UButton loading label="Saving" />
</template>
```

## Further reading

- [Nuxt UI Button](https://ui.nuxt.com/docs/components/button)
