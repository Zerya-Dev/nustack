# `vueuse/no-namespace-import`

Use named imports from `@vueuse/core` instead of namespace imports. Named imports keep tree-shaking clear and make VueUse composable usage explicit.

## Incorrect

```ts
import * as VueUse from '@vueuse/core'
```

## Correct

```ts
import { useStorage } from '@vueuse/core'
```
