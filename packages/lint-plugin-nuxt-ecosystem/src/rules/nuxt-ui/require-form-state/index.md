# `@nustack/nuxt-ui/require-form-state`

Require the reactive `state` prop documented by Nuxt UI's `UForm` API.

```vue
<!-- Incorrect -->
<UForm :schema="schema" />

<!-- Correct -->
<UForm :schema="schema" :state="state" />
```

Dynamic bindings (`:state`) are accepted.
Nested forms (`<UForm nested>`) are also accepted because Nuxt UI explicitly makes them
inherit the parent form's state.
