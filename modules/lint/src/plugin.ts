import type { ESLint } from 'eslint'
import { rules } from './rules/catalog'

/**
 * The nustack ESLint plugin, registered once under the `nustack` namespace. Rule
 * keys carry their area (`nuxt/…`, `nuxt-ui/…`), so a rule reads as
 * `nustack/nuxt/no-process-env` in config — ESLint resolves that to plugin
 * `nustack` + rule `nuxt/no-process-env`.
 */
export const nustackPlugin: ESLint.Plugin = {
  meta: { name: '@nustackjs/lint' },
  rules,
}
