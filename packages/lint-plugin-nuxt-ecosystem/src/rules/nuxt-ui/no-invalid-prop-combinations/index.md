# `@nustack/nuxt-ui/no-invalid-prop-combinations`

Disallow static prop combinations that Nuxt UI documents as incompatible.

Currently covered:

- `UFileUpload variant="button"` cannot be combined with `multiple`.
- `UFileUpload layout` requires `variant="area"`.
- `UFileUpload position` requires `variant="area"` and `layout="list"`.
- `UAccordion collapsible` is only meaningful for the default `type="single"`.

Dynamic values are ignored when the relationship cannot be proven at lint time.
Use `data-raw` for an intentional low-level exception.

```vue
<!-- Incorrect -->
<UFileUpload variant="button" multiple />
<UFileUpload variant="area" position="outside" />
<UAccordion type="multiple" collapsible :items="items" />

<!-- Correct -->
<UFileUpload variant="button" />
<UFileUpload variant="area" layout="list" position="outside" />
<UAccordion type="single" collapsible :items="items" />
```

## Further reading

- [Nuxt UI FileUpload](https://ui.nuxt.com/docs/components/file-upload)
- [Nuxt UI Accordion](https://ui.nuxt.com/docs/components/accordion)
