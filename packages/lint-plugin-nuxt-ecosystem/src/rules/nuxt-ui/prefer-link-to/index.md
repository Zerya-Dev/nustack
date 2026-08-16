# `@nustack/nuxt-ui/prefer-link-to`

Prefer `to` on `ULink` and link-capable `UButton` components for a consistent routing-aware
API. Nuxt UI also supports `href`, so this rule is a preference rather than a defect and is
reported as a warning. Suppress an intentional `href` with
`<!-- eslint-disable-next-line @nustack/nuxt-ui/prefer-link-to -->`.

```vue
<!-- Incorrect -->
<UButton href="/settings">Settings</UButton>

<!-- Correct -->
<UButton to="/settings">Settings</UButton>
```

## Further reading

- [Nuxt UI Link](https://ui.nuxt.com/docs/components/link)
- [Nuxt UI Button](https://ui.nuxt.com/docs/components/button)
