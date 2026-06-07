import type { Linter } from 'eslint'
import type { FlatConfigComposer } from 'eslint-flat-config-utils'
import type { AntfuOptions } from './configs/base'
import type { NuxtConcernOptions } from './configs/nuxt'
import type { NuxtUiConcernOptions } from './configs/nuxt-ui'
import type { TailwindConcernOptions } from './configs/tailwind'
import type { ConcernContext, Depth, Variant } from './configs/types'
import type { VueConcernOptions } from './configs/vue'
import type { NustackContext } from './context'
import { defu } from 'defu'
import { composer } from 'eslint-flat-config-utils'
import { antfuBase } from './configs/base'
import { nuxtConfig } from './configs/nuxt'
import { nuxtUiConfig } from './configs/nuxt-ui'
import { tailwindConfig } from './configs/tailwind'
import { typeAwareConfig } from './configs/type-aware'
import { vueConfig } from './configs/vue'
import { EMPTY_CONTEXT } from './context'

export type { Depth, Variant } from './configs/types'

/** A per-concern toggle: `true`/`undefined` = default, `false` = off, object = tune. */
type ConcernToggle<T> = boolean | T

/**
 * Options for the nustack ESLint factory. Mirrors `@antfu/eslint-config`'s shape:
 * per-concern toggles plus overrides, all resolved into a `FlatConfigComposer`.
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
  /** Nuxt UI component preferences. Auto-gated on `@nuxt/ui` detection. */
  nuxtUi?: ConcernToggle<NuxtUiConcernOptions>
  /** Tailwind class sorting/correctness. Auto-gated on a detected entry point. */
  tailwind?: ConcernToggle<TailwindConcernOptions>
  /** Global rule overrides, merged after every concern. */
  overrides?: Record<string, Linter.RuleEntry>
  /** Detected project context. Injected by the generated `.nuxt/nustack-eslint.mjs`. */
  context?: NustackContext
}

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

/**
 * Wraps a `withNuxt()` composer with the full nustack config. Mirrors antfu: the
 * style base is prepended, then each enabled, context-gated concern is appended,
 * then global overrides. Returns the same composer for chaining `.override()` etc.
 *
 * The generated `.nuxt/nustack-eslint.mjs` calls this with the detected context in
 * `options.context`; callers normally import the pre-bound `nustackLint` from there
 * and may pass their own `options` (variant, per-concern toggles, overrides).
 */
export function nustackLint(
  base: FlatConfigComposer,
  options: NustackLintOptions = {},
): FlatConfigComposer {
  const variant: Variant = options.variant ?? 'recommended'
  const depth = resolveDepth()
  const ctx = mergeContext(options.context)
  const axes: ConcernContext = { variant, depth }

  // Style base, prepended so it's foundational (concerns win on conflicts).
  const antfu = antfuBase(options.base)
  if (antfu)
    base.prepend(antfu)

  const configs: Linter.Config[] = []

  if (isEnabled(options.nuxt, true))
    configs.push(...nuxtConfig(ctx, axes, subOptions(options.nuxt)))
  if (isEnabled(options.vue, true))
    configs.push(...vueConfig(ctx, axes, subOptions(options.vue)))
  if (isEnabled(options.tailwind, ctx.tailwind.detected))
    configs.push(...tailwindConfig(ctx, axes, subOptions(options.tailwind)))
  if (isEnabled(options.nuxtUi, ctx.modules.nuxtUi))
    configs.push(...nuxtUiConfig(ctx, axes, subOptions(options.nuxtUi)))

  // The type-aware layer is a full-depth-only, cross-cutting concern.
  if (depth === 'full')
    configs.push(...typeAwareConfig())

  if (options.overrides) {
    configs.push({
      name: 'nustack/overrides',
      rules: options.overrides,
    })
  }

  return base.append(...configs)
}

/**
 * Standalone (non-Nuxt) entry. Builds a composer from scratch — no `withNuxt()` —
 * so a plain TypeScript/Vue repo can consume the nustack preset directly. The
 * Nuxt-specific concerns (`nuxt`, `nuxtUi`) default off here since there's no Nuxt
 * project to detect; enable them explicitly if you want them. Used to dogfood
 * `@nustackjs/lint` on its own (non-Nuxt) source.
 */
export function defineNustackConfig(
  options: NustackLintOptions = {},
): FlatConfigComposer {
  return nustackLint(composer(), {
    nuxt: false,
    nuxtUi: false,
    ...options,
    context: options.context ?? EMPTY_CONTEXT,
  })
}
