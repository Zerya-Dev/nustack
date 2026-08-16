# `@nustack/nuxt-ui/prefer-u-form-field`

Prefer `<UFormField>` over hand-written label/control pairs. `UFormField` consistently
connects labels, hints, errors, required state, and accessibility metadata to Nuxt UI form
controls such as `<UInput>`.

The rule reports a `<label>` when it wraps a known native or Nuxt UI form control, or when
its static `for` value matches the static `id` of one. It does not report standalone
label-like text or labels targeting non-form elements, nor a component whose name merely
lowercases to a native tag (`<Label>`, `<Input>`). Suppress an intentional native label with
`<!-- eslint-disable-next-line @nustack/nuxt-ui/prefer-u-form-field -->`.

When the original control is native, migrate both halves of the pair. Keeping a native
`<input>` inside `UFormField` is not equivalent because it does not consume the ID provided
by Nuxt UI.

## Incorrect

```vue
<template>
  <label for="email">Email</label>
  <UInput id="email" v-model="email" />
</template>
```

For a native pair, replace the control as well:

```vue
<template>
  <UFormField label="Email" name="email">
    <UInput v-model="email" />
  </UFormField>
</template>
```

## Correct

```vue
<template>
  <UFormField label="Email" name="email">
    <UInput v-model="email" />
  </UFormField>
</template>
```
