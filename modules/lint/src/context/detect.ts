import type { NustackContext } from '.'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { resolveModulePath } from 'exsolve'
import { EMPTY_CONTEXT } from '.'
import { MODULE_FLAGS, resolveModuleFlags } from './module-flags'

const TAILWIND_IMPORT_RE = /@import\s+["']tailwindcss["']/

/** Common Tailwind v4 CSS entry points, scanned in order (project-root relative). */
const CSS_ENTRY_CANDIDATES = [
  'src/main.css',
  'src/style.css',
  'src/styles.css',
  'src/assets/css/main.css',
  'assets/css/main.css',
  'app/assets/css/main.css',
  'app.css',
]

/**
 * Whether `id` is resolvable from the project. Uses node resolution rather than reading
 * the root `package.json`, so a dependency pulled in through a workspace sub-package or a
 * hoisted `node_modules` still counts; what matters is that the module is reachable.
 */
function isResolvable(id: string, cwd: string): boolean {
  return resolveModulePath(id, { try: true, from: join(cwd, 'package.json') }) !== undefined
}

function detectTailwind(cwd: string, resolvable: (id: string) => boolean): NustackContext['tailwind'] {
  for (const entry of CSS_ENTRY_CANDIDATES) {
    const abs = join(cwd, entry)
    if (!existsSync(abs))
      continue
    try {
      const source = readFileSync(abs, 'utf-8')
      if (TAILWIND_IMPORT_RE.test(source))
        return { detected: true, entryPoint: entry }
    } catch {
      // unreadable css entry, ignore and keep scanning
    }
  }
  // No importing entry found; fall back to a bare resolvability check so the concern
  // still gates on (with `entryPoint` unknown, needs an explicit override then).
  if (resolvable('tailwindcss'))
    return { detected: true, entryPoint: null }
  return { detected: false, entryPoint: null }
}

/**
 * Lightweight, non-Nuxt context detection for standalone targets (`vue-app`, and
 * `nuxt-module`'s `src/**`). There's no `nuxt prepare` here, so it deliberately doesn't
 * fake Nuxt's auto-import/component registries, `autoImports`/`components` stay empty.
 * Pass an explicit `context` (`createContext`) to add them.
 */
export function detectStandaloneContext(cwd: string = process.cwd()): NustackContext {
  const resolvable = (id: string): boolean => isResolvable(id, cwd)
  const installedModules = Object.keys(MODULE_FLAGS).filter(resolvable)

  return {
    modules: resolveModuleFlags(installedModules),
    tailwind: detectTailwind(cwd, resolvable),
    autoImports: [],
    components: [],
  }
}

/**
 * Builds a full `NustackContext` from a partial one, filling any gaps from
 * `EMPTY_CONTEXT`. The manual escape hatch for projects where auto-detection isn't
 * enough, e.g. supplying `autoImports`/`components` outside Nuxt.
 */
export type PartialContext = Partial<Omit<NustackContext, 'modules' | 'tailwind'>> & {
  modules?: Partial<NustackContext['modules']>
  tailwind?: Partial<NustackContext['tailwind']>
}

export function createContext(partial: PartialContext = {}): NustackContext {
  return {
    ...EMPTY_CONTEXT,
    ...partial,
    modules: { ...EMPTY_CONTEXT.modules, ...partial.modules },
    tailwind: { ...EMPTY_CONTEXT.tailwind, ...partial.tailwind },
  }
}
