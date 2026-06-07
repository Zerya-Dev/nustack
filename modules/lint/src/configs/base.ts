import type { FlatConfigComposer } from 'eslint-flat-config-utils'
import antfu from '@antfu/eslint-config'
import { defu } from 'defu'

/** Options accepted by `@antfu/eslint-config`'s factory. */
export type AntfuOptions = NonNullable<Parameters<typeof antfu>[0]>

/**
 * The style base. The factory applies it so consumers never hand-wire the
 * style/quality layer. `@nuxt/eslint` must run in `standalone: false` so antfu owns
 * the Vue/TS/import rules and there is no plugin-instance conflict.
 *
 * `typescript: true` is intentional — NuStack is TypeScript-first, so the (cheap,
 * syntax-only) TS rules are always on. The expensive type-aware rules live in a
 * separate layer that is gated on `depth: full`, not here.
 */
const ANTFU_DEFAULTS: AntfuOptions = {
  stylistic: true,
  vue: true,
  typescript: true,
  rules: {
    // Nuxt pages/layouts legitimately have multiple root nodes.
    'vue/no-multiple-template-root': 'off',
    // `process` is a Nuxt/Nitro global; nuxt/no-process-env handles app code.
    'node/prefer-global/process': 'off',
    'style/brace-style': ['warn', '1tbs'],
  },
}

/**
 * Builds the antfu base, with user `base` options taking precedence over the
 * defaults (their `rules` merge over ours). Returns `null` when `base: false`.
 */
export function antfuBase(userBase: AntfuOptions | false | undefined): FlatConfigComposer | null {
  if (userBase === false)
    return null
  return antfu(defu(userBase, ANTFU_DEFAULTS))
}
