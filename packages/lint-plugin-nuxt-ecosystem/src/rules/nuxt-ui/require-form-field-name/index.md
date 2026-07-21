# `@nustack/nuxt-ui/require-form-field-name`

Inside `UForm`, each `UFormField` needs a `name` or `error-pattern` so Nuxt UI can route
schema/custom-validation errors to the correct field. Standalone display-only form fields
are ignored.

```vue
<UForm :schema="schema" :state="state">
  <UFormField name="email" label="Email">
    <UInput v-model="state.email" />
  </UFormField>
</UForm>
```
