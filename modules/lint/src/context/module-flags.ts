import type { NustackContext } from '.'

/** Maps installed package names to context module flags. */
export const MODULE_FLAGS = {
  '@nuxt/ui': 'nuxtUi',
  '@nuxt/ui-pro': 'nuxtUi',
  '@comark/nuxt': 'mdc',
  '@nuxtjs/mdc': 'mdc',
} as const satisfies Record<string, keyof NustackContext['modules']>

export function resolveModuleFlags(names: Iterable<string>): NustackContext['modules'] {
  const installed = new Set(names)

  const modules: NustackContext['modules'] = {
    nuxtUi: false,
    mdc: false,
  }
  for (const [name, flag] of Object.entries(MODULE_FLAGS)) {
    if (installed.has(name))
      modules[flag] = true
  }
  // @nuxt/content ships its own MDC renderer even without a dedicated `mdc` module.
  if (installed.has('@nuxt/content'))
    modules.mdc = true

  return modules
}
