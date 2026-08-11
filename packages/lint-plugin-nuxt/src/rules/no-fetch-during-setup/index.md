# `@nustack/nuxt/no-fetch-during-setup`

Disallow `$fetch` for data loaded during initial component setup.

Nuxt components run setup during server rendering and again during client hydration. A direct `$fetch` request on that path can therefore run twice, does not transfer its result through the Nuxt payload, does not automatically proxy request headers for relative server requests, and does not participate in Nuxt's async-data lifecycle. Use `useFetch` or `useAsyncData` for initial render data.

Incorrect:

```vue
<script setup lang="ts">
const project = await $fetch(`/api/projects/${projectId.value}`)

watch(projectId, async () => {
  project.value = await $fetch(`/api/projects/${projectId.value}`)
}, { immediate: true })
</script>
```

Correct:

```vue
<script setup lang="ts">
const projectId = ref('example')
const { data: project } = await useFetch(() => `/api/projects/${projectId.value}`)

async function submitProject() {
  await $fetch('/api/projects', {
    method: 'POST',
    body: project.value,
  })
}
</script>
```

For non-blocking initial data, set `lazy: true` on `useFetch` or `useAsyncData`. If the data is intentionally client-only, set `server: false` on the data composable and handle its loading state.

The rule checks `<script setup>`, exported component `setup` functions, and components created with `defineComponent` or `defineNuxtComponent`. It follows same-file loader calls and local callback aliases used by `watch(..., callback, { immediate: true })`, but does not treat non-immediate watchers or nested deferred callbacks as initial execution.

Known client-only loader functions can be allowed by name:

```js
export default {
  rules: {
    '@nustack/nuxt/no-fetch-during-setup': ['error', {
      allow: ['loadClientPreview'],
    }],
  },
}
```

The rule has no autofix because choosing blocking, lazy, error, and loading behavior is application-dependent.

See [Nuxt's data fetching guide](https://nuxt.com/docs/4.x/getting-started/data-fetching), especially [the need for `useFetch` and `useAsyncData`](https://nuxt.com/docs/4.x/getting-started/data-fetching#the-need-for-usefetch-and-useasyncdata), [`$fetch`](https://nuxt.com/docs/4.x/getting-started/data-fetching#fetch), and [reactive data fetching](https://nuxt.com/docs/4.x/getting-started/data-fetching#watch).
