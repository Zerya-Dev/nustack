# `@nustack/nuxt-ui/prefer-u-table`

Prefer Nuxt UI's `<UTable>` over raw `<table>` elements when `@nuxt/ui` is available.

Unlike the other `prefer-u-*` rules, `UTable` is **data-driven** (`:data` / `:columns`)
rather than a structural drop-in for hand-written `<tr>`/`<td>` markup. Reach for `data-raw`
whenever a bespoke static table genuinely reads better as markup.

## Incorrect

```vue
<template>
  <table>
    <tbody>
      <tr><td>{{ row.name }}</td></tr>
    </tbody>
  </table>
</template>
```

## Correct

```vue
<template>
  <UTable :data="rows" :columns="columns" />
</template>
```

Use `data-raw` as a local escape hatch when a raw native table is intentional.

## Further reading

- [Nuxt UI Table](https://ui.nuxt.com/docs/components/table)
