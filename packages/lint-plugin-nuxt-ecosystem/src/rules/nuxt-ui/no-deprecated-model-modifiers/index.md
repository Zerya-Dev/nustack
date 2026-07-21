# `@nustack/nuxt-ui/no-deprecated-model-modifiers`

Disallow the `v-model.nullify` modifier on Nuxt UI inputs. It was renamed to `.nullable` in
Nuxt UI v4 (both convert empty/blank values to `null`; v4 also adds `.optional` for
`undefined`). Applies to `UInput`, `UInputNumber`, and `UTextarea`.

## Incorrect

```vue
<template>
  <UInput v-model.nullify="value" />
  <UTextarea v-model="value" :model-modifiers="{ nullify: true }" />
</template>
```

## Correct

```vue
<template>
  <UInput v-model.nullable="value" />
  <UTextarea v-model="value" :model-modifiers="{ nullable: true }" />
</template>
```

## Options

```js
'@nustack/nuxt-ui/no-deprecated-model-modifiers': ['warn', {
  modifiers: { coerce: 'transform' }, // extra old → new renames, merged onto the built-ins
  components: ['uinput', 'utextarea'], // lowercased components to check (replaces the default list)
}]
```
