# `@nustack/nuxt/no-explicit-auto-import`

Disallow explicit imports of identifiers and components that Nuxt already auto-imports for the project.

The rule is driven by options supplied by the umbrella preset from Nuxt's generated context, so it can use the project's actual auto-import and component lists instead of a small hardcoded name list.

## Incorrect

```ts
import { ref } from 'vue'

const count = ref(0)
```

```ts
import AppButton from '~/components/AppButton.vue'
```

## Correct

```ts
const count = ref(0)
```

```vue
<template>
  <AppButton />
</template>
```

## Options

```ts
{
  imports?: string[]
  components?: string[]
}
```

`imports` and `components` should come from Nuxt's generated import/component metadata.
You can configure those by hand, but preferably you should use `@nustackjs/lint` module, which
already does that for you.
