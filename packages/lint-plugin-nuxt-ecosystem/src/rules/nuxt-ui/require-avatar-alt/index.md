# `@nustack/nuxt-ui/require-avatar-alt`

Require `alt` on image-backed `UAvatar` components. Use `aria-hidden` for an explicitly
decorative avatar. An empty `alt=""` counts as a deliberate decorative marker, but a binding
known to be nullish (`:alt="undefined"`) renders no alternative text and is reported.

## Incorrect

```vue
<template>
  <UAvatar src="/users/ben.png" />
</template>
```

## Correct

```vue
<template>
  <!-- meaningful image -->
  <UAvatar src="/users/ben.png" alt="Benjamin" />

  <!-- decorative image -->
  <UAvatar src="/brand-mark.png" aria-hidden="true" />
</template>
```

## Further reading

- [Nuxt UI Avatar](https://ui.nuxt.com/docs/components/avatar)
