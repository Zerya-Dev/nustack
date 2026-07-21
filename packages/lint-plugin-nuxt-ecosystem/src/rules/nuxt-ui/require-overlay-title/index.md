# `@nustack/nuxt-ui/require-overlay-title`

Require an accessible title on `UModal`, `UDrawer`, and `USlideover`. A `title` prop,
`#title` slot, `aria-label`, or `aria-labelledby` satisfies the rule.

```vue
<!-- Incorrect -->
<UModal><template #body>Delete this project?</template></UModal>

<!-- Correct -->
<UModal title="Delete project" />
<UModal><template #title>Delete project</template></UModal>
```

## Further reading

- [Nuxt UI Modal](https://ui.nuxt.com/docs/components/modal)
- [Nuxt UI Drawer](https://ui.nuxt.com/docs/components/drawer)
- [Nuxt UI Slideover](https://ui.nuxt.com/docs/components/slideover)
