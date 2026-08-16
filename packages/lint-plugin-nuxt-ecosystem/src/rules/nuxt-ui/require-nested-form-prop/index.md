# `@nustack/nuxt-ui/require-nested-form-prop`

Nuxt UI v4 requires an inner `UForm` to opt into parent-form integration with the `nested`
prop. The rule does not require `name`: unnamed nested forms are valid when they share the
parent state rather than target a separate state path.

## Incorrect

```vue
<UForm :state="state">
  <UForm :schema="childSchema" />
</UForm>
```

## Correct

```vue
<UForm :state="state">
  <UForm nested :schema="childSchema" />
</UForm>
```

## Further reading

- [Nuxt UI Form nesting](https://ui.nuxt.com/docs/components/form#nesting-forms)
