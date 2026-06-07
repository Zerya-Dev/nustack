import type { Linter } from 'eslint'

/** Opinion strength — static, set in `eslint.config.ts`. Cumulative. */
export type Variant = 'minimal' | 'recommended' | 'pedantic'
/** Analysis depth — per-run, from `NUSTACK_LINT_DEPTH`. Cumulative. */
export type Depth = 'quick' | 'full'

const VARIANT_ORDER: Record<Variant, number> = { minimal: 0, recommended: 1, pedantic: 2 }
const DEPTH_ORDER: Record<Depth, number> = { quick: 0, full: 1 }

/** True when `variant` is at least `min` in the cumulative ladder. */
export function variantAtLeast(variant: Variant, min: Variant): boolean {
  return VARIANT_ORDER[variant] >= VARIANT_ORDER[min]
}

/** True when `depth` is at least `min` in the cumulative ladder. */
export function depthAtLeast(depth: Depth, min: Depth): boolean {
  return DEPTH_ORDER[depth] >= DEPTH_ORDER[min]
}

/** Resolved axes handed to every concern factory. */
export interface ConcernContext {
  variant: Variant
  depth: Depth
}

/** Base options shared by every per-concern option object. */
export interface ConcernOptions {
  /** Per-concern rule overrides, appended after the concern's own rules. */
  overrides?: Record<string, Linter.RuleEntry>
}
