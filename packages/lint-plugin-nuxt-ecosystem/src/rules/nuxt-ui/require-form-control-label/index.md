# `@nustack/nuxt-ui/require-form-control-label`

Require an accessible name for Nuxt UI form controls. A label may be provided by
`label`, `legend`, `aria-label`, `aria-labelledby`, the matching slot, or an enclosing
`UFormField` that has a `label` prop or `#label` slot.

```vue
<!-- Incorrect -->
<UInput placeholder="Search" />

<!-- Correct -->
<UFormField label="Search">
  <UInput placeholder="Search" />
</UFormField>
<UCheckboxGroup legend="Options" :items="items" />
<USwitch aria-label="Enable notifications" />
```

Dynamic bindings are accepted because their runtime value cannot be proven statically.
Use `data-raw` for an intentional low-level exception.

## Further reading

- [Nuxt UI FormField](https://ui.nuxt.com/docs/components/form-field)
- [Nuxt UI CheckboxGroup](https://ui.nuxt.com/docs/components/checkbox-group)
