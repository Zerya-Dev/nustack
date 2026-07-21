# `@nustack/nuxt-ui/no-invalid-prop-combinations`

Disallow static prop combinations that Nuxt UI documents as incompatible.

Currently covered:

- `UFileUpload variant="button"` cannot be combined with `multiple`.
- `UFileUpload layout` requires `variant="area"`.
- `UFileUpload position` requires `variant="area"` and `layout="list"`.
- `UAccordion collapsible` is only meaningful for the default `type="single"`.

Dynamic values are ignored when the relationship cannot be proven at lint time.
Use `data-raw` for an intentional low-level exception.
