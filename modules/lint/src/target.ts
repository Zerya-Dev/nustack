import type { NustackLintOptions } from './config'
import type { Rules } from './utils'
import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

export type TargetKind = 'nuxt-app' | 'vue-app' | 'nuxt-module'
export type Target = TargetKind

/** Nitro exposes `process` as a global, so antfu's `prefer-global/process: 'never'` is wrong here. */
const NITRO_BASE_RULES: Rules = {
  'node/prefer-global/process': ['error', 'always'],
}

const CONFIG_EXTENSIONS = ['ts', 'js', 'mjs']

function detectNestedNuxtApps(projectRoot: string): string[] {
  let directories: string[]
  try {
    directories = readdirSync(projectRoot, { withFileTypes: true })
      .filter(entry => entry.isDirectory() && entry.name !== 'node_modules')
      .map(entry => entry.name)
  } catch {
    return []
  }
  return directories.filter(directory => CONFIG_EXTENSIONS.some(extension => existsSync(join(projectRoot, directory, `nuxt.config.${extension}`))))
}

/**
 * Resolves a `target` into the `NustackLintOptions` defaults it pre-fills. Precedence is
 * `defu(userOptions, resolveTarget(target))` in `applyNustackConfig`, so explicit user
 * options always win.
 */
export function resolveTarget(target: Target, cwd: string = process.cwd()): Partial<NustackLintOptions> {
  switch (target) {
    case 'nuxt-app':
      return {
        base: { rules: NITRO_BASE_RULES },
      }

    case 'vue-app':
      // No Nuxt runtime, so the Nuxt concern is off and there's no Nitro base rule.
      // tailwind/nuxtEcosystem are left untouched so they keep auto-gating on detection.
      return {
        nuxt: false,
        vue: true,
        vueUse: true,
        vite: true,
      }

    case 'nuxt-module':
      // `src/**` is a plain TS library, not an app. Any nested Nuxt app (playground,
      // demo, ...) lints itself via its own config, so ignore them all here.
      return {
        base: {
          type: 'lib',
          ignores: detectNestedNuxtApps(cwd),
          rules: NITRO_BASE_RULES,
        },
        nuxt: false,
        vueUse: false,
        vite: false,
      }
  }
}
