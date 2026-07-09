import type { FlatConfigComposer } from 'eslint-flat-config-utils'
import type { Depth } from '../utils'
import antfu from '@antfu/eslint-config'
import { defu } from 'defu'

/** Options accepted by `@antfu/eslint-config`'s factory. */
export type AntfuOptions = NonNullable<Parameters<typeof antfu>[0]>

/**
 * Style preset. `'nustack'` layers nustack's stylistic overrides (`1tbs` braces) on top
 * of antfu; `'antfu'` is plain antfu with no nustack deviations.
 */
export type StylePreset = 'nustack' | 'antfu'

/** `base` options: antfu's own options plus a nustack style-preset selector. */
export type AntfuBaseOptions = AntfuOptions & {
  /** Which style preset to build on. @default 'nustack' */
  preset?: StylePreset
}

/** The nustack preset's stylistic overrides over antfu (which defaults to `stroustrup`). */
const NUSTACK_STYLISTIC: NonNullable<AntfuOptions['stylistic']> = {
  braceStyle: '1tbs',
}

const ANTFU_DEFAULTS: Omit<AntfuOptions, 'typescript' | 'stylistic'> = {
  markdown: false, // handled by the markdown concern (mdclint)
  vue: true,
  // Prettier formats what ESLint can't: CSS/HTML/Markdown and SFC `<style>` blocks.
  formatters: true,
}

function resolveTypescriptOptions(
  userBase: AntfuOptions,
  depth: Depth,
): NonNullable<AntfuOptions['typescript']> {
  const userTypescript = userBase.typescript
  const userObject = typeof userTypescript === 'object' && userTypescript !== null ? userTypescript : undefined

  // `full` depth points antfu at the tsconfig, enabling its type-aware rule set.
  if (depth === 'full')
    return defu(userObject ?? {}, { tsconfigPath: 'tsconfig.json' })

  return userObject ?? true
}

function resolveStylistic(
  preset: StylePreset,
  userStylistic: AntfuOptions['stylistic'],
): AntfuOptions['stylistic'] {
  if (userStylistic === false)
    return false
  // The preset only seeds defaults; an explicit `base.stylistic` still wins per key.
  const presetStylistic = preset === 'nustack' ? NUSTACK_STYLISTIC : {}
  return defu(userStylistic, presetStylistic)
}

/**
 * Builds the antfu base, with user `base` options taking precedence over the defaults.
 * Returns `null` when `base: false`. The style preset (default `'nustack'`) decides
 * whether nustack's stylistic overrides are seeded; `stylistic: false` drops the layer.
 */
export function antfuBase(userBase: AntfuBaseOptions | false | undefined, depth: Depth): FlatConfigComposer | null {
  if (userBase === false)
    return null

  const { preset = 'nustack', ...base } = userBase ?? {}

  return antfu({
    ...defu(base, ANTFU_DEFAULTS),
    stylistic: resolveStylistic(preset, base.stylistic),
    typescript: resolveTypescriptOptions(base, depth),
  })
}
