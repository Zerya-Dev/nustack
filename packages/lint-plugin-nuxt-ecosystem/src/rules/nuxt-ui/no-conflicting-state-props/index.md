# `@nustack/nuxt-ui/no-conflicting-state-props`

Do not combine controlled state (`open`, `v-model:open`, `model-value`, or `v-model`) with
the corresponding uncontrolled initializer (`default-open` or `default-value`). Nuxt UI's
APIs document `default-*` for cases where the caller does not control state.

The rule is limited to Nuxt UI components, which document the pairing. It does not infer the
convention for application components — `<UserCard default-value model-value>` may mean something
else entirely — and a known nullish binding (`:open="undefined"`) supplies no state, so it does
not conflict.

## Incorrect

```vue
<template>
  <UModal v-model:open="open" default-open />
</template>
```

## Correct

```vue
<template>
  <!-- controlled -->
  <UModal v-model:open="open" />

  <!-- uncontrolled -->
  <UModal default-open />
</template>
```

## Further reading

- [Nuxt UI Modal](https://ui.nuxt.com/docs/components/modal)
- [Nuxt UI Checkbox](https://ui.nuxt.com/docs/components/checkbox)
