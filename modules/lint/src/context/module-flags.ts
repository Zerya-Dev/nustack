import type { NustackContext } from '.'

/**
 * Module/package name → context flag. Shared by both detection sources so they
 * resolve to the *same* `ctx.modules.*`: the Nuxt-registry path (`addon.ts`,
 * `nuxt prepare`) and the standalone `package.json` path (`detect.ts`, non-Nuxt
 * targets). Every consumer (tailwind `:ui` wiring, the nuxt-ui rule pack, the
 * `nuxtEcosystem` gate) stays source-agnostic.
 */
export const MODULE_FLAGS = {
  '@nuxt/ui': 'nuxtUi',
  '@nuxt/ui-pro': 'nuxtUi',
  '@pinia/nuxt': 'pinia',
  '@nuxt/image': 'nuxtImage',
  '@nuxt/content': 'nuxtContent',
  '@comark/nuxt': 'mdc',
  '@nuxtjs/mdc': 'mdc',
} as const satisfies Record<string, keyof NustackContext['modules']>

/** Resolves `ctx.modules` from a set of installed/declared module or package names. */
export function resolveModuleFlags(names: Iterable<string>): NustackContext['modules'] {
  const installed = new Set(names)

  const modules: NustackContext['modules'] = {
    nuxtUi: false,
    pinia: false,
    nuxtImage: false,
    nuxtContent: false,
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
