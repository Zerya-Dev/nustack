# `@nustack/nuxt-ui/no-conflicting-state-props`

Do not combine controlled state (`open`, `v-model:open`, `model-value`, or `v-model`) with
the corresponding uncontrolled initializer (`default-open` or `default-value`). Nuxt UI's
APIs document `default-*` for cases where the caller does not control state.

```vue
<!-- Incorrect -->
<UModal v-model:open="open" default-open />

<!-- Correct: controlled -->
<UModal v-model:open="open" />

<!-- Correct: uncontrolled -->
<UModal default-open />
```
