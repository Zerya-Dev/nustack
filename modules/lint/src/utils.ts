import type { Linter } from 'eslint'

export type Rules = Record<string, Linter.RuleEntry>

/** Analysis depth — per-run, from `NUSTACK_LINT_DEPTH`. Cumulative. */
export type Depth = 'quick' | 'full'

const DEPTH_ORDER: Record<Depth, number> = { quick: 0, full: 1 }

/** True when `depth` is at least `min` in the cumulative ladder. */
export function depthAtLeast(depth: Depth, min: Depth): boolean {
  return DEPTH_ORDER[depth] >= DEPTH_ORDER[min]
}

/** Base options shared by every per-concern option object. */
export interface ConcernOptions {
  /** Per-concern rule changes, merged after the concern's defaults. */
  rules?: Rules
  /** @deprecated Use `rules` instead. */
  overrides?: Rules
}

/** Backward-compatible rule resolver while `rules` becomes the single public API. */
export function resolveConcernRules(options: ConcernOptions): Rules {
  return {
    ...options.overrides,
    ...options.rules,
  }
}

/** A per-concern toggle: `true`/`undefined` = default, `false` = off, object = tune. */
export type ConcernToggle<T> = boolean | T

/** `false` = disabled; object = explicit opt-in; `true`/`undefined` = default. */
export function isEnabled<T>(toggle: ConcernToggle<T> | undefined, gate: boolean): boolean {
  if (toggle === false)
    return false
  // Explicit opt-in (`true` or an options object) forces the concern on even when
  // the detection gate is false; otherwise rely on the gate.
  if (toggle === true || (typeof toggle === 'object' && toggle !== null))
    return true
  return gate
}

/** Extracts the options object from a toggle, or `{}` for `true`/`undefined`/`false`. */
export function subOptions<T>(toggle: ConcernToggle<T> | undefined): T {
  return (typeof toggle === 'object' && toggle !== null ? toggle : {}) as T
}
