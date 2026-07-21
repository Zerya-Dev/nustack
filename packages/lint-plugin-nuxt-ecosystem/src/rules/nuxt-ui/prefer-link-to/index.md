# `@nustack/nuxt-ui/prefer-link-to`

Use `to` on `ULink` and link-capable `UButton` components. It follows Nuxt UI's Link API
and keeps routing-aware links consistent.

```vue
<!-- Incorrect -->
<UButton href="/settings">Settings</UButton>
<ULink href="/docs">Docs</ULink>

<!-- Correct -->
<UButton to="/settings">Settings</UButton>
<ULink to="/docs">Docs</ULink>
```

Use `data-raw` when native `href` behavior is intentional.

## Further reading

- [Nuxt UI Link](https://ui.nuxt.com/docs/components/link)
- [Nuxt UI Button](https://ui.nuxt.com/docs/components/button)
