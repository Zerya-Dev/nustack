# `@nustack/nuxt-ui/require-overlay-title`

Require an accessible title on `UModal`, `UDrawer`, and `USlideover`. A `title` prop,
`#title` slot, `aria-label`, or `aria-labelledby` satisfies the rule.

```vue
<UModal title="Delete project" />
<UModal><template #title>Delete project</template></UModal>
```
