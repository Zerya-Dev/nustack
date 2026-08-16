# `@nustack/nuxt-ui/no-deprecated-components`

Disallow Nuxt UI components that were renamed or removed, pointing at their migration.

| Deprecated | Current | Renamed in |
|---|---|---|
| `UButtonGroup` | `UFieldGroup` | v4 |
| `UPageMarquee` | `UMarquee` | v4 |
| `UPageAccordion` | `UAccordion` plus former wrapper defaults | v4 |
| `UFormGroup` | `UFormField` | v3 |
| `UDropdown` | `UDropdownMenu` | v3 |
| `UDivider` | `USeparator` | v3 |
| `URange` | `USlider` | v3 |
| `UToggle` | `USwitch` | v3 |

This is a hand-maintained table (Nuxt UI ships no machine-readable deprecation feed, and
ESLint/Oxlint can't resolve a component's `@deprecated` prop JSDoc in templates). Entries are
verified against the live migration guides; the v3 names are still gone in v4.

`eslint --fix` rewrites the tag for every pure name swap, in the spelling it finds it — a
kebab-case tag stays kebab-case, a `Lazy` wrapper stays lazy, and the closing tag follows. It
deliberately leaves two cases to a human: `UPageAccordion` (see below) and any tag that resolves
through a binding rather than spelling the component out, such as an aliased import or
`<component :is>`.

`UPageAccordion` was not a tag-only rename. It was a wrapper around `UAccordion` that set
`unmount-on-hide="false"` and typography-oriented `ui` defaults. Preserve those values when
the old behavior is required.

## Incorrect

```vue
<template>
  <UButtonGroup>
    <UButton>One</UButton>
    <UButton>Two</UButton>
  </UButtonGroup>
</template>
```

## Correct

```vue
<template>
  <UFieldGroup>
    <UButton>One</UButton>
    <UButton>Two</UButton>
  </UFieldGroup>
</template>
```

## Options

Register team-specific renames, merged onto the built-in table. Canonical unprefixed names are
preferred because they remain unambiguous when a name itself starts with the configured prefix
(`UserCard` with prefix `U`). Prefixed keys remain supported for existing configurations:

```js
'@nustack/nuxt-ui/no-deprecated-components': ['warn', {
  components: { OldWidget: 'NewWidget' },
}]
```

## Further reading

- [Migrating to Nuxt UI v4](https://ui.nuxt.com/docs/getting-started/migration/v4)
- [Migrating to Nuxt UI v3](https://ui.nuxt.com/docs/getting-started/migration/v3)
