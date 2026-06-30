# `@nustack/nuxt-ui/prefer-u-form-controls`

Prefer Nuxt UI form controls over raw native form elements when `@nuxt/ui` is available.

The rule is also `type`-aware: when an input `type` has a dedicated Nuxt UI component, it
points you at that component — both for a raw `<input type="number">` and for a generic
`<UInput type="number">`.

| `type` | Component |
|---|---|
| `number` | `UInputNumber` |
| `file` | `UFileUpload` |
| `color` | `UColorPicker` |
| `date` | `UInputDate` |
| `time` | `UInputTime` |
| `range` | `USlider` |
| `checkbox` | `UCheckbox` |
| `radio` | `URadioGroup` |

## Incorrect

```vue
<template>
  <input v-model="email">
  <select v-model="country" />
  <textarea v-model="bio" />
  <input type="number" v-model="age">
  <UInput type="number" v-model="age" />
</template>
```

## Correct

```vue
<template>
  <UInput v-model="email" />
  <USelect v-model="country" />
  <UTextarea v-model="bio" />
  <UInputNumber v-model="age" />
</template>
```

Dynamic types (`<UInput :type="kind" />`) are ignored — only a statically-written `type`
is checked. Use `data-raw` as a local escape hatch when a native control is intentional.

## Options

Both maps are extensible (entries are merged onto the built-ins):

```js
'@nustack/nuxt-ui/prefer-u-form-controls': ['warn', {
  controls: { progress: 'UProgress' }, // extra raw-element → component
  types: { email: 'UEmailInput' },     // extra input-type → component
}]
```
