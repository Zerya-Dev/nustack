# `@nustack/nuxt/no-ref-outside-setup`

Disallow Vue `ref()` calls outside `<script setup>` or a component `setup()` function.

Nuxt server-renders multiple requests in the same process. A ref created at module scope is therefore shared across requests, which can leak user state and retain data in memory. Create request-safe shared state with `useState` instead.

Incorrect:

```ts
export const state = ref({})

export const useProjectState = () => ref({})

function setup() {
  return ref({}) // A name alone does not make this a component setup function.
}
```

Correct:

```ts
export const useProjectState = () => useState('project-state', () => ({}))
```

```vue
<script setup lang="ts">
const localState = ref({})
</script>
```

```ts
export default defineComponent({
  setup() {
    const localState = ref({})
    return { localState }
  },
})
```

The rule recognizes Nuxt's auto-imported `ref`, named imports (including aliases) from `vue`, and `ref` accessed through a Vue namespace import. Setup exemptions are limited to `<script setup>`, direct component options exported as default, and options passed to `defineComponent` or `defineNuxtComponent`. Vue's setup callback form of `defineComponent` is also supported.

See [Nuxt's state management best practices](https://nuxt.com/docs/4.x/getting-started/state-management#best-practices).
