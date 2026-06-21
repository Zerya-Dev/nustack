# `@nustack/vueuse/prefer-usewindow-size`

Prefer `useWindowSize()` over direct `window.innerWidth` or `window.innerHeight` reads. The composable returns reactive dimensions and avoids stale one-time snapshots.

## Incorrect

```ts
const width = window.innerWidth
```

## Correct

```ts
const { width, height } = useWindowSize()
```
