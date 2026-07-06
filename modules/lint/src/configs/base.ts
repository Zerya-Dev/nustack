import type { FlatConfigComposer } from 'eslint-flat-config-utils'
import type { Depth } from './types'
import antfu from '@antfu/eslint-config'
import { defu } from 'defu'

/** Options accepted by `@antfu/eslint-config`'s factory. */
export type AntfuOptions = NonNullable<Parameters<typeof antfu>[0]>

/**
 * The style base. The factory applies it so consumers never hand-wire the
 * style/quality layer. `@nuxt/eslint` must run in `standalone: false` so antfu owns
 * the Vue/TS/import rules and there is no plugin-instance conflict.
 *
 * TypeScript is resolved separately so it is always enabled. In quick mode this
 * keeps Antfu's syntax-only TS rules on; in full mode it passes `tsconfigPath`
 * so Antfu also enables its type-aware rule set.
 */
const ANTFU_DEFAULTS: Omit<AntfuOptions, 'typescript'> = {
  // Markdown is handled by another plugin - `mdclint`.
  markdown: false,
  stylistic: true,
  vue: true,
  rules: {
    // `process` is always available as a Nuxt/Nitro global, so prefer it over
    // importing `node:process` (antfu's default is the opposite, `'never'`). App
    // code is separately steered off `process.env` by @nustack/nuxt/no-process-env.
    'node/prefer-global/process': ['error', 'always'],
    // oxfmt (planned formatter migration) hardcodes 1tbs and doesn't allow
    // customizing brace style, so we align ESLint with it now.
    'style/brace-style': ['warn', '1tbs'],
  },
}

function resolveTypescriptOptions(
  userBase: AntfuOptions | undefined,
  depth: Depth,
): NonNullable<AntfuOptions['typescript']> {
  const userTypescript = userBase?.typescript

  if (depth === 'full') {
    return defu(
      typeof userTypescript === 'object' && userTypescript !== null ? userTypescript : {},
      { tsconfigPath: 'tsconfig.json' },
    )
  }

  return typeof userTypescript === 'object' && userTypescript !== null ? userTypescript : true
}

/**
 * Builds the antfu base, with user `base` options taking precedence over the
 * defaults (their `rules` merge over ours). Returns `null` when `base: false`.
 */
export function antfuBase(userBase: AntfuOptions | false | undefined, depth: Depth): FlatConfigComposer | null {
  if (userBase === false)
    return null

  return antfu({
    ...defu(userBase, ANTFU_DEFAULTS),
    typescript: resolveTypescriptOptions(userBase, depth),
  })
}
