import type { Linter } from 'eslint'
import type { FlatConfigComposer } from 'eslint-flat-config-utils'
import type { AntfuBaseOptions } from './configs/base'
import type { MarkdownConcernOptions } from './configs/markdown'
import type { NuxtConcernOptions } from './configs/nuxt'
import type { NuxtEcosystemToggle } from './configs/nuxt-ecosystem'
import type { TailwindConcernOptions } from './configs/tailwind'
import type { ViteConcernOptions } from './configs/vite'
import type { VueConcernOptions } from './configs/vue'
import type { VueUseConcernOptions } from './configs/vueuse'
import type { NustackContext } from './context'
import type { Target } from './target'
import type { ConcernToggle, Depth, Rules } from './utils'
import { defu } from 'defu'
import { composer } from 'eslint-flat-config-utils'
import { antfuBase } from './configs/base'
import { complexityConfig } from './configs/complexity'
import { markdownConfig } from './configs/markdown'
import { nuxtConfig } from './configs/nuxt'
import { nuxtEcosystemConfig } from './configs/nuxt-ecosystem'
import { tailwindConfig } from './configs/tailwind'
import { typeAwareConfig } from './configs/type-aware'
import { viteConfig } from './configs/vite'
import { vueConfig } from './configs/vue'
import { vueUseConfig } from './configs/vueuse'
import { EMPTY_CONTEXT } from './context'
import { detectStandaloneContext } from './context/detect'
import { resolveTarget } from './target'
import { isEnabled, resolveConcernRules, subOptions } from './utils'

export type { Target, TargetKind } from './target'
export type { Depth, Rules } from './utils'

/** Opt-in opinionated checks that not every team wants. Plain on/off, not tiers. */
export interface EnforceOptions {
  /** Cyclomatic-complexity + size-limit budget. Off by default (noisy on existing code). @default false */
  complexity?: boolean
}

export type Awaitable<T> = T | Promise<T>
export type NustackFlatConfig = Linter.Config | Linter.Config[] | FlatConfigComposer
export type NustackUserConfig = Awaitable<NustackFlatConfig>

/**
 * Options for the public nustack ESLint factory. Mirrors `@antfu/eslint-config`'s
 * shape: one options object, then optional flat config objects appended last.
 * `depth` is intentionally absent; it is read per-run from `NUSTACK_LINT_DEPTH`.
 */
export interface NustackLintOptions {
  /**
   * The project environment: `'nuxt-app' | 'vue-app' | 'nuxt-module'`. Pre-fills concern
   * toggles and base rules for that environment as a `defu` layer, so any option set
   * explicitly below still wins. Defaults to `'nuxt-app'` in `applyNustackConfig`; the
   * standalone `nustack()` factory defaults to `'vue-app'`.
   */
  target?: Target
  /** Opt-in opinionated checks (each a plain on/off), e.g. `enforce: { complexity: true }`. */
  enforce?: EnforceOptions
  /**
   * The antfu style base. Object tunes it, `false` disables it. `base.preset` picks the
   * style preset: `'nustack'` (default, antfu + our overrides like `1tbs`) or `'antfu'`
   * (plain antfu). `base: { stylistic: false }` drops the stylistic layer entirely.
   */
  base?: AntfuBaseOptions | false
  /** Core Nuxt conventions (auto-imports, runtimeConfig, process.env). */
  nuxt?: ConcernToggle<NuxtConcernOptions>
  /** SFC conventions (vue/block-lang etc.). */
  vue?: ConcernToggle<VueConcernOptions>
  /** VueUse usage conventions. */
  vueUse?: ConcernToggle<VueUseConcernOptions>
  /** Vite build/runtime conventions. */
  vite?: ConcernToggle<ViteConcernOptions>
  /**
   * Nuxt-ecosystem rules (Nuxt UI today; Pinia/Content later). `false` disables the whole
   * ecosystem; an object tunes each module, e.g. `{ nuxtUi: false }`. Each module
   * auto-gates on its own detection.
   */
  nuxtEcosystem?: NuxtEcosystemToggle
  /** Tailwind class sorting/correctness. Auto-gated on a detected entry point. */
  tailwind?: ConcernToggle<TailwindConcernOptions>
  /** Markdown/MDC linting via mdclint. MDC auto-gates on @nuxt/content, @comark/nuxt, or @nuxtjs/mdc. */
  markdown?: ConcernToggle<MarkdownConcernOptions>
  /** Global rule changes, merged after every concern. */
  rules?: Rules
  /** @deprecated Use `rules` instead. */
  overrides?: Rules
  /**
   * Detected project context. Injected by the generated `.nuxt/nustack-eslint.mjs`
   * for Nuxt apps; the standalone `nustack()` factory fills it via
   * `detectStandaloneContext()` when omitted.
   */
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

/** Applies the resolved nustack config to a Nuxt flat-config composer. */
export function applyNustackConfig(
  base: FlatConfigComposer,
  options: NustackLintOptions = {},
  ...userConfigs: NustackUserConfig[]
): FlatConfigComposer {
  const target = options.target ?? 'nuxt-app'
  const merged: NustackLintOptions = defu(options, resolveTarget(target))
  // `defu(false, {...})` yields the object, so re-honour an explicit `base: false` that a
  // target's base defaults would otherwise resurrect.
  if (options.base === false)
    merged.base = false

  const depth = resolveDepth()
  const context = mergeContext(merged.context)

  // Prepended so it's foundational; concerns win on conflicts.
  const antfu = antfuBase(merged.base, depth)
  if (antfu)
    base.prepend(antfu)

  const configs: Linter.Config[] = []

  if (isEnabled(merged.nuxt, true))
    configs.push(...nuxtConfig(context, subOptions(merged.nuxt)))
  if (isEnabled(merged.vue, true))
    configs.push(...vueConfig(context, subOptions(merged.vue)))
  if (isEnabled(merged.vueUse, true))
    configs.push(...vueUseConfig(subOptions(merged.vueUse)))
  if (isEnabled(merged.vite, true))
    configs.push(...viteConfig(subOptions(merged.vite)))
  if (isEnabled(merged.tailwind, context.tailwind.detected))
    configs.push(...tailwindConfig(context, subOptions(merged.tailwind)))
  if (isEnabled(merged.markdown, true))
    configs.push(...markdownConfig(context, subOptions(merged.markdown)))
  // The ecosystem concern owns its per-module gating; the umbrella toggle only honours
  // an explicit `false`.
  if (merged.nuxtEcosystem !== false)
    configs.push(...nuxtEcosystemConfig(context, subOptions(merged.nuxtEcosystem)))

  configs.push(...complexityConfig(merged.enforce?.complexity ?? false))

  if (depth === 'full')
    configs.push(...typeAwareConfig())

  const rules = resolveConcernRules(merged)
  if (Object.keys(rules).length) {
    configs.push({
      name: 'nustack/rules',
      rules,
    })
  }

  return base.append(...configs, ...userConfigs as any)
}

/** Creates a standalone config; defaults to the `vue-app` target. */
export function nustack(
  options: NustackLintOptions = {},
  ...userConfigs: NustackUserConfig[]
): FlatConfigComposer {
  return applyNustackConfig(composer(), {
    ...options,
    target: options.target ?? 'vue-app',
    context: options.context ?? detectStandaloneContext(),
  }, ...userConfigs)
}

export default nustack
