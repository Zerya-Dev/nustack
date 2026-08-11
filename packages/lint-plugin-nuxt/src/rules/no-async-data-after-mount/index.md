# `@nustack/nuxt/no-async-data-after-mount`

Disallow `useAsyncData`, `useFetch`, `useLazyAsyncData`, and `useLazyFetch` in callbacks that can run after component setup.

Nuxt's data composables coordinate server rendering, hydration, payload transfer, and navigation. A data composable created after the component has mounted cannot be awaited during setup, so Nuxt reports the `NUXT_E3003` development diagnostic. Use `$fetch` for requests triggered later, or create the data composable during setup and call its `refresh`/`execute` method later.

Incorrect:

```vue
<script setup lang="ts">
onMounted(() => {
  useFetch('/api/posts')
})

const usePosts = () => useFetch('/api/posts')
onMounted(usePosts)

function handleClick() {
  useAsyncData('posts', () => $fetch('/api/posts'))
}
</script>
```

Correct:

```vue
<script setup lang="ts">
const posts = await useFetch('/api/posts')

async function handleClick() {
  await posts.refresh()
}

async function submit() {
  await $fetch('/api/posts', { method: 'POST' })
}
</script>
```

Custom composables may create data composables on their initial execution path:

```ts
export function usePosts() {
  return useAsyncData('posts', () => $fetch('/api/posts'))
}
```

The rule recognizes Nuxt auto-imports, named imports and aliases from `#app`, `#imports`, and `nuxt/app`, and Nuxt namespace imports. Calls are allowed directly in `<script setup>`, `setup()`, `use*` composables, Nuxt plugin initialization, and route middleware. Nested functions are treated as deferred because static analysis cannot prove that they run synchronously during setup.

Direct references to custom `use*` composables are also checked when passed to known deferred callback positions, including Vue lifecycle/watch APIs, timers, Promise handlers, event listeners, and runtime hooks. The analysis intentionally does not follow assignments or arbitrary callback APIs.

See [Nuxt's data fetching guide](https://nuxt.com/docs/4.x/getting-started/data-fetching) and [`useAsyncData` documentation](https://nuxt.com/docs/4.x/api/composables/use-async-data).
