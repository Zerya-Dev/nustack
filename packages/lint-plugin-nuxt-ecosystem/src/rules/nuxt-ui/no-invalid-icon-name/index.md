# `@nustack/nuxt-ui/no-invalid-icon-name`

Validate static icon props against Nuxt UI's documented `i-<collection>-<icon>` Iconify
format. Dynamic bindings are accepted because Nuxt UI also supports Vue components.

```vue
<UIcon name="i-lucide-lightbulb" />
<UButton icon="i-lucide-search" />
<UIcon :name="IconLightbulb" />
```

Register project-specific names with `{ names: ['brand-logo'] }`, or use `data-raw` locally.
