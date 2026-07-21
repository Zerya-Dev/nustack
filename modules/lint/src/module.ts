import { defineNuxtModule, installModule } from '@nuxt/kit'
import { defu } from 'defu'
import { setupNustackContext } from './addon'

export type { NustackContext } from './context'

export interface ModuleOptions {}

function hasModule(nuxt: { options: { modules: unknown[] } }, name: string): boolean {
  return nuxt.options.modules.some(moduleEntry => (Array.isArray(moduleEntry) ? moduleEntry[0] : moduleEntry) === name)
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@nustackjs/lint',
  },
  defaults: {},
  async setup(_options, nuxt) {
    // Composable mode lets nustack supply the Vue and TypeScript rules.
    nuxt.options.eslint = defu(nuxt.options.eslint, { config: {} })
    ;(nuxt.options.eslint as { config: { standalone: boolean } }).config.standalone = false
    if (!hasModule(nuxt, '@nuxt/eslint'))
      await installModule('@nuxt/eslint')

    setupNustackContext(nuxt)
  },
})
