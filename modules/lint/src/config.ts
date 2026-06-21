import type { Linter } from 'eslint'
import type { FlatConfigComposer } from 'eslint-flat-config-utils'
import type { AntfuOptions } from './configs/base'
import type { NuxtConcernOptions } from './configs/nuxt'
import type { NuxtUiConcernOptions } from './configs/nuxt-ui'
import type { TailwindConcernOptions } from './configs/tailwind'
import type { ConcernContext, Depth, Rules, Variant } from './configs/types'
import type { ViteConcernOptions } from './configs/vite'
import type { VueConcernOptions } from './configs/vue'
import type { VueUseConcernOptions } from './configs/vueuse'
import type { NustackContext } from './context'
import { defu } from 'defu'
import { composer } from 'eslint-flat-config-utils'
import { antfuBase } from './configs/base'
import { nuxtConfig } from './configs/nuxt'
import { nuxtUiConfig } from './configs/nuxt-ui'
import { tailwindConfig } from './configs/tailwind'
import { typeAwareConfig } from './configs/type-aware'
import { viteConfig } from './configs/vite'
import { vueConfig } from './configs/vue'
import { vueUseConfig } from './configs/vueuse'
import { EMPTY_CONTEXT } from './context'

export type { Depth, Variant } from './configs/types'
export type { Rules } from './configs/types'

export type Awaitable<T> = T | Promise<T>
export type NustackFlatConfig = Linter.Config | Linter.Config[] | FlatConfigComposer
export type NustackUserConfig = Awaitable<NustackFlatConfig>

/** A per-concern toggle: `true`/`undefined` = default, `false` = off, object = tune. */
type ConcernToggle<T> = boolean | T

/**
 * Options for the public nustack ESLint factory. Mirrors `@antfu/eslint-config`'s
 * shape: one options object, then optional flat config objects appended last.
 * `depth` is intentionally absent — it is read per-run from `NUSTACK_LINT_DEPTH`.
 */
export interface NustackLintOptions {
  /** Opinion strength. Default `recommended`. Cumulative: minimal ⊂ recommended ⊂ pedantic. */
  variant?: Variant
  /** The antfu style base. Object tunes it, `false` disables it. */
  base?: AntfuOptions | false
  /** Core Nuxt conventions (auto-imports, runtimeConfig, process.env). */
  nuxt?: ConcernToggle<NuxtConcernOptions>
  /** SFC conventions (vue/block-lang etc.). */
  vue?: ConcernToggle<VueConcernOptions>
  /** VueUse usage conventions. */
  vueUse?: ConcernToggle<VueUseConcernOptions>
  /** Vite build/runtime conventions. */
  vite?: ConcernToggle<ViteConcernOptions>
  /** Nuxt UI component preferences. Auto-gated on `@nuxt/ui` detection. */
  nuxtUi?: ConcernToggle<NuxtUiConcernOptions>
  /** Tailwind class sorting/correctness. Auto-gated on a detected entry point. */
  tailwind?: ConcernToggle<TailwindConcernOptions>
  /** Global rule changes, merged after every concern. */
  rules?: Rules
  /** @deprecated Use `rules` instead. */
  overrides?: Rules
  /** Detected project context. Injected by the generated `.nuxt/nustack-eslint.mjs`. */
  context?: NustackContext
}

export type NustackOptions = NustackLintOptions

/** Reads the per-run analysis depth from the environment. Defaults to `quick`. */
export function resolveDepth(): Depth {
  return process.env.NUSTACK_LINT_DEPTH === 'full' ? 'full' : 'quick'
}

function mergeContext(context: NustackContext | undefined): NustackContext {
  return defu(context, EMPTY_CONTEXT)
}

/** `false` = disabled; object = explicit opt-in; `true`/`undefined` = default. */
function isEnabled<T>(toggle: ConcernToggle<T> | undefined, gate: boolean): boolean {
  if (toggle === false)
    return false
  // Explicit opt-in (`true` or an options object) forces the concern on even when
  // the detection gate is false; otherwise rely on the gate.
  if (toggle === true || (typeof toggle === 'object' && toggle !== null))
    return true
  return gate
}

function subOptions<T>(toggle: ConcernToggle<T> | undefined): T {
  return (typeof toggle === 'object' && toggle !== null ? toggle : {}) as T
}

function resolveRules(options: Pick<NustackLintOptions, 'rules' | 'overrides'>): Rules {
  return {
    ...options.overrides,
    ...options.rules,
  }
}

/**
 * Wraps a `withNuxt()` composer with the full nustack config. Mirrors antfu: the
 * style base is prepended, then each enabled, context-gated concern is appended,
 * then global rules and user flat configs. Returns the same composer for chaining.
 *
 * The generated `.nuxt/nustack-eslint.mjs` calls this with the detected context in
 * `options.context`; callers normally import the pre-bound `nustack` from there
 * and may pass their own options plus file-scoped flat configs.
 */
export function applyNustackConfig(
  base: FlatConfigComposer,
  options: NustackLintOptions = {},
  ...userConfigs: NustackUserConfig[]
): FlatConfigComposer {
  const variant: Variant = options.variant ?? 'recommended'
  const depth = resolveDepth()
  const ctx = mergeContext(options.context)
  const axes: ConcernContext = { variant, depth }

  // Style base, prepended so it's foundational (concerns win on conflicts).
  const antfu = antfuBase(options.base, depth)
  if (antfu)
    base.prepend(antfu)

  const configs: Linter.Config[] = []

  if (isEnabled(options.nuxt, true))
    configs.push(...nuxtConfig(ctx, axes, subOptions(options.nuxt)))
  if (isEnabled(options.vue, true))
    configs.push(...vueConfig(ctx, axes, subOptions(options.vue)))
  if (isEnabled(options.vueUse, true))
    configs.push(...vueUseConfig(axes, subOptions(options.vueUse)))
  if (isEnabled(options.vite, true))
    configs.push(...viteConfig(axes, subOptions(options.vite)))
  if (isEnabled(options.tailwind, ctx.tailwind.detected))
    configs.push(...tailwindConfig(ctx, axes, subOptions(options.tailwind)))
  if (isEnabled(options.nuxtUi, ctx.modules.nuxtUi))
    configs.push(...nuxtUiConfig(ctx, axes, subOptions(options.nuxtUi)))

  // The type-aware layer is a full-depth-only, cross-cutting concern.
  if (depth === 'full')
    configs.push(...typeAwareConfig())

  const rules = resolveRules(options)
  if (Object.keys(rules).length) {
    configs.push({
      name: 'nustack/rules',
      rules,
    })
  }

  return base.append(...configs, ...userConfigs as any)
}

/**
 * Public standalone (non-Nuxt) entry. Builds a composer from scratch — no `withNuxt()` —
 * so a plain TypeScript/Vue repo can consume the nustack preset directly. The
 * Nuxt/project-detected concerns default off here since there's no Nuxt project
 * to detect; enable them explicitly if you want them. Used to dogfood `@nustackjs/lint`
 * on its own (non-Nuxt) source.
 */
export function nustack(
  options: NustackLintOptions = {},
  ...userConfigs: NustackUserConfig[]
): FlatConfigComposer {
  return applyNustackConfig(composer(), {
    nuxt: false,
    nuxtUi: false,
    vite: false,
    vueUse: false,
    ...options,
    context: options.context ?? EMPTY_CONTEXT,
  }, ...userConfigs)
}

export default nustack
