# `@nustack/nuxt-ui/require-form-field-name`

Inside `UForm`, each `UFormField` needs a `name` or `error-pattern` so Nuxt UI can route
schema/custom-validation errors to the correct field. Standalone display-only form fields
are ignored.

```vue
<!-- Incorrect: validation errors cannot be matched to this field -->
<UForm :schema="schema" :state="state">
  <UFormField label="Email">
    <UInput v-model="state.email" />
  </UFormField>
</UForm>

<!-- Correct -->
<UForm :schema="schema" :state="state">
  <UFormField name="email" label="Email">
    <UInput v-model="state.email" />
  </UFormField>
</UForm>
```

## Further reading

- [Nuxt UI Form](https://ui.nuxt.com/docs/components/form)
- [Nuxt UI FormField](https://ui.nuxt.com/docs/components/form-field)
