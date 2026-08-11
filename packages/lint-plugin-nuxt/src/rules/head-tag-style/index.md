# `@nustack/nuxt/head-tag-style`

Enforce one consistent way to define dynamic Nuxt head tags: the `useHead` composable or Nuxt's template components.

The default `useHead` variant follows Nuxt's general recommendation to prefer `useHead`. The `components` variant supports projects that prefer `<Head>`, `<Title>`, `<Meta>`, and the other head components in templates.

## Options

```ts
{
  variant?: 'useHead' | 'components'
}
```

`variant` defaults to `'useHead'`.

### `useHead`

Incorrect:

```vue
<template>
  <Head>
    <Title>Hello</Title>
    <Meta name="description" content="Hello" />
  </Head>
</template>
```

Correct:

```vue
<script setup lang="ts">
useHead({
  title: 'Hello',
  meta: [{ name: 'description', content: 'Hello' }],
})
</script>
```

### `components`

Incorrect:

```vue
<script setup lang="ts">
useHead({ title: 'Hello' })
</script>
```

Correct:

```vue
<template>
  <Head>
    <Title>Hello</Title>
  </Head>
</template>
```

The component variant only disallows direct `useHead(...)` calls. Other Nuxt composables such as `useSeoMeta` are outside this rule's scope.

See [Nuxt's SEO and meta component documentation](https://nuxt.com/docs/4.x/getting-started/seo-meta#components).
