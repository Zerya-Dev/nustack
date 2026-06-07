import type { Rule } from 'eslint'
import { rule as preferUButton } from './nuxt-ui/prefer-u-button'
import { rule as preferUFormControls } from './nuxt-ui/prefer-u-form-controls'
import { rule as noExplicitAutoImport } from './nuxt/no-explicit-auto-import'
import { rule as noProcessEnv } from './nuxt/no-process-env'
import { rule as noSecretInPublicRuntimeConfig } from './nuxt/no-secret-in-public-runtimeconfig'

/**
 * Every custom nustack rule, keyed by its `<area>/<name>` id. The key becomes the
 * rule id once the plugin is registered as `nustack` — e.g. `nuxt/no-process-env`
 * resolves to `nustack/nuxt/no-process-env`. Concerns reference these ids; docs are
 * generated from each rule's colocated `index.md`.
 */
export const rules: Record<string, Rule.RuleModule> = {
  'nuxt/no-explicit-auto-import': noExplicitAutoImport,
  'nuxt/no-process-env': noProcessEnv,
  'nuxt/no-secret-in-public-runtimeconfig': noSecretInPublicRuntimeConfig,
  'nuxt-ui/prefer-u-button': preferUButton,
  'nuxt-ui/prefer-u-form-controls': preferUFormControls,
}
