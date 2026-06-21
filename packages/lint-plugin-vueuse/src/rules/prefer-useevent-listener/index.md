# `@nustack/vueuse/prefer-useevent-listener`

Prefer `useEventListener()` from VueUse over `window.addEventListener()` or `document.addEventListener()` in Vue/Nuxt code. The composable automatically removes listeners when the current effect scope is disposed.

## Incorrect

```ts
window.addEventListener('resize', onResize)
```

## Correct

```ts
useEventListener(window, 'resize', onResize)
```
