import { defineNuxtModule, installModule } from '@nuxt/kit'
import { defu } from 'defu'
import { setupNustackContext } from './addon'

export type { NustackContext } from './context'

/**
 * Options are intentionally empty: `@nustackjs/lint` is zero-config. It auto-detects
 * the project's modules, auto-imports, components and Tailwind entry point, and
 * activates the matching rule packs automatically.
 */
export interface ModuleOptions {}

function hasModule(nuxt: { options: { modules: unknown[] } }, name: string): boolean {
  return nuxt.options.modules.some(m => (Array.isArray(m) ? m[0] : m) === name)
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@nustackjs/lint',
  },
  defaults: {},
  async setup(_options, nuxt) {
    // `@nuxt/eslint` must run in composable mode (`standalone: false`) so the preset
    // owns the Vue/TS rules. We set that here instead of asking the user to write
    // `eslint: { config: { standalone: false } }` in their nuxt.config. `@nuxt/eslint`
    // is bundled, so we install it ourselves — list only `@nustackjs/lint`.
    nuxt.options.eslint = defu(nuxt.options.eslint, { config: {} })
    ;(nuxt.options.eslint as { config: { standalone: boolean } }).config.standalone = false
    if (!hasModule(nuxt, '@nuxt/eslint'))
      await installModule('@nuxt/eslint')

    setupNustackContext(nuxt)
  },
})
