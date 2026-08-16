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

Suppress an intentional raw native button with
`<!-- eslint-disable-next-line @nustack/nuxt-ui/prefer-u-button -->`.

Only genuine native elements are reported: a component whose name merely lowercases to the
tag (`<Button>`) is left alone.

## Further reading

- [Nuxt UI Button](https://ui.nuxt.com/docs/components/button)
