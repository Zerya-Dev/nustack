# `@nustack/vueuse/no-nuxt-auto-import-collision`

Alias VueUse imports whose names commonly collide with Nuxt auto-imports. This avoids ambiguous usage in files where Nuxt auto-imports and explicit VueUse imports coexist.

## Incorrect

```ts
import { useFetch } from '@vueuse/core'
```

## Correct

```ts
import { useFetch as vueuseUseFetch } from '@vueuse/core'
```

## Options

```ts
{
  additionalNames?: string[]
  ignoreNames?: string[]
}
```

Use `additionalNames` to mark project-specific auto-imports as collisions. Use `ignoreNames` to allow selected default names without an alias.
