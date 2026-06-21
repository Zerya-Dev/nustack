/**
 * `@nustackjs/lint/config` — the ESLint side of the package (no Nuxt runtime).
 * Consumed by the generated `.nuxt/nustack-eslint.mjs` and by advanced users who
 * want to pass context/options manually.
 */
export { applyNustackConfig, default, nustack } from './config'
export type { Awaitable, Depth, NustackFlatConfig, NustackLintOptions, NustackOptions, NustackUserConfig, Rules, Variant } from './config'
export { EMPTY_CONTEXT } from './context'
export type { NustackContext } from './context'
