# `nustack/nuxt/no-explicit-auto-import`

> Variant: `recommended` · Concern: `nuxt` · Fixable: yes (removes the import)

Nuxt already makes Vue/Nuxt composables, your `composables/` + `utils/` exports, and
your components globally available. Writing an explicit `import` for one of them is a
second, redundant way to do the same thing. NuStack standardizes on **the auto-import**
so a symbol is referenced one way across the codebase — no mix of imported-here /
auto-there that humans and agents have to reconcile.

The rule only flags identifiers the project *actually* auto-imports (it reads the
resolved unimport + component registries from the detected context), so it never
false-positives on names you really do need to import.

## ❌ Incorrect

```ts
import { ref } from 'vue' // ref is auto-imported

const count = ref(0)
```

```vue
<script setup lang="ts">
import MyWidget from '~/components/MyWidget.vue' // components are auto-imported
</script>
```

## ✅ Correct

```ts
const count = ref(0) // ref is in scope, no import needed
```

```ts
import type { Ref } from 'vue' // type-only imports are never auto-imported
import { ref } from 'pinia' // not a Nuxt auto-import → keep it
```

## Auto-fix

Removes the redundant specifier (or the whole declaration when every specifier is
redundant). The symbol stays in scope via the auto-import.

## Why a custom rule

No upstream rule knows your project's *resolved* auto-import set. This rule is fed the
real registry by the `nuxt` concern, which is what makes it safe to auto-fix.
