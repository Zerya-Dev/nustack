# `vueuse/prefer-use-storage`

Prefer VueUse storage composables over direct `localStorage` or `sessionStorage` calls. VueUse storage refs are reactive and are safer in SSR-aware Vue/Nuxt code.

## Incorrect

```ts
localStorage.setItem('theme', theme)
```

## Correct

```ts
const theme = useStorage('theme', 'light')
```
