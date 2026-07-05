# `@nustack/vite/no-dynamic-new-url`

Disallow dynamic template literals in `new URL(..., import.meta.url)`.

Vite resolves this pattern statically at build time so it can locate and bundle the referenced asset. A template literal with an interpolated expression can't be analyzed and silently won't be bundled.

## Incorrect

```ts
const icon = new URL(`./icons/${name}.svg`, import.meta.url).href
```

## Correct

```ts
const icons = {
  home: new URL('./icons/home.svg', import.meta.url).href,
  settings: new URL('./icons/settings.svg', import.meta.url).href,
}
const icon = icons[name]
```
