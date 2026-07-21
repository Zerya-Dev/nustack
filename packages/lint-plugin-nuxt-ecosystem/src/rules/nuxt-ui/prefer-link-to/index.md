# `@nustack/nuxt-ui/prefer-link-to`

Use `to` on `ULink` and link-capable `UButton` components. It follows Nuxt UI's Link API
and keeps routing-aware links consistent.

```vue
<UButton to="/settings">Settings</UButton>
<ULink to="/docs">Docs</ULink>
```

Use `data-raw` when native `href` behavior is intentional.
