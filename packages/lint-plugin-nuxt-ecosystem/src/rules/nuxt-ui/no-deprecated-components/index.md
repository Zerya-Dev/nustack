# `@nustack/nuxt-ui/no-deprecated-components`

Disallow Nuxt UI components that were **renamed in v4**, pointing at their current names.

| Deprecated | Current |
|---|---|
| `UButtonGroup` | `UFieldGroup` |
| `UPageMarquee` | `UMarquee` |
| `UPageAccordion` | `UAccordion` |

This is a hand-maintained table (Nuxt UI ships no machine-readable deprecation feed, and
ESLint/Oxlint can't resolve a component's `@deprecated` prop JSDoc in templates). Entries are
verified against the live v4 docs.

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
