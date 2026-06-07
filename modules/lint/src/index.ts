/**
 * `@nustackjs/lint/config` — the ESLint side of the package (no Nuxt runtime).
 * Consumed by the generated `.nuxt/nustack-eslint.mjs` and by advanced users who
 * want to pass context/options manually.
 */
export { defineNustackConfig, nustackLint } from './config'
export type { Depth, NustackLintOptions, Variant } from './config'
export { EMPTY_CONTEXT } from './context'
export type { NustackContext } from './context'
export { nustackPlugin } from './plugin'
