# `@nustack/vueuse/prefer-useclipboard`

Prefer `useClipboard()` from VueUse over `navigator.clipboard`. The composable gives Vue-friendly state like `copied`, `isSupported`, and a scoped `copy()` function.

## Incorrect

```ts
await navigator.clipboard.writeText(value)
```

## Correct

```ts
const { copy, copied } = useClipboard()
await copy(value)
```
