# `@nustack/vueuse/prefer-use-observers`

Prefer VueUse observer composables over raw browser observer constructors. VueUse wraps observer cleanup in the active Vue scope.

## Incorrect

```ts
const observer = new ResizeObserver(onResize)
```

## Correct

```ts
useResizeObserver(target, onResize)
```
