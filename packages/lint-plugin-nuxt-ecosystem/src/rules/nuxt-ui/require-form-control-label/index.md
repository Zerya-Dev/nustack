# `@nustack/nuxt-ui/require-form-control-label`

Require an accessible name for Nuxt UI form controls. The rule understands each component's
supported `label` or `legend` API, ARIA naming, native `<label>` associations, and enclosing
`UFormField` labels.

`label` is a real API on `UCheckbox`, `USwitch`, and `UFileUpload`. `legend` is a real API on
`UCheckboxGroup` and `URadioGroup`. The same attribute on other controls is ignored because it
does not create an accessible name.

A native `<label>` (wrapping the control, or `for` matching a static `id`) is an accessible
name. `prefer-u-form-field` still prefers `UFormField` for that pair.

## Incorrect

```vue
<template>
  <UInput placeholder="Search" />
  <UInput label="Email" />
  <UFormField label="Range">
    <UInput />
    <UInput />
  </UFormField>
</template>
```

## Correct

```vue
<template>
  <UFormField label="Search">
    <UInput placeholder="Search" />
  </UFormField>
  <UCheckboxGroup legend="Options" :items="items" />
  <USwitch aria-label="Enable notifications" />
  <UFileUpload label="Drop a file" />
  <label for="email">Email</label>
  <UInput id="email" />
  <UFormField label="Contact">
    <UInput v-if="useEmail" />
    <UTextarea v-else />
  </UFormField>
</template>
```

A `UFormField` label only names a field that renders a single control. Controls in one
`v-if` / `v-else-if` / `v-else` chain are alternatives, so the chain counts as one control.

Dynamic bindings are accepted because their runtime value cannot be proven statically.
An intentional exception uses a standard ESLint disable comment.

## Further reading

- [Nuxt UI FormField](https://ui.nuxt.com/docs/components/form-field)
- [Nuxt UI CheckboxGroup](https://ui.nuxt.com/docs/components/checkbox-group)
- [Nuxt UI FileUpload](https://ui.nuxt.com/docs/components/file-upload)
