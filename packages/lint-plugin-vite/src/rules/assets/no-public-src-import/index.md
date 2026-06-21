# `@nustack/vite/no-public-src-import`

Disallow importing files from Vite `public/` directories.

Files in `public/` are served as static root URLs and are not transformed by Vite. Import source assets from the application source tree, or reference public files by URL.

## Incorrect

```ts
import logoUrl from '../public/logo.svg'
```

## Correct

```ts
import logoUrl from '../assets/logo.svg'
```

```ts
const logoUrl = '/logo.svg'
```
