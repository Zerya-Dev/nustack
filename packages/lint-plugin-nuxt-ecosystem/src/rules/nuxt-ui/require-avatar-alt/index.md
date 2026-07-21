# `@nustack/nuxt-ui/require-avatar-alt`

Require `alt` on image-backed `UAvatar` components. Use `aria-hidden` for an explicitly
decorative avatar.

```vue
<!-- Incorrect -->
<UAvatar src="/users/ben.png" />

<!-- Correct: meaningful image -->
<UAvatar src="/users/ben.png" alt="Benjamin" />

<!-- Correct: decorative image -->
<UAvatar src="/brand-mark.png" aria-hidden="true" />
```

## Further reading

- [Nuxt UI Avatar](https://ui.nuxt.com/docs/components/avatar)
