import type { Linter } from 'eslint'
import type { NustackContext } from '../context'
import type { ConcernOptions } from './types'
import { mdcLint } from 'mdclint'
import { resolveConcernRules } from './types'

const GLOB_MARKDOWN = ['content/**/*.md']
export type MarkdownPreset = NonNullable<MarkdownConcernOptions['preset']>

export interface MarkdownConcernOptions extends ConcernOptions {
  /** Markdown files to lint. Defaults to Nuxt Content's conventional directory. */
  files?: string[]
  /** Force plain Markdown or MDC parsing. Defaults to project context detection. */
  preset?: 'markdown' | 'mdc'
  /** markdownlint-compatible rule configuration passed through to mdclint. */
  config?: Record<string, unknown>
}

export function resolveMarkdownPreset(
  ctx: NustackContext,
  options: Pick<MarkdownConcernOptions, 'preset'> = {},
): MarkdownPreset {
  return options.preset ?? (ctx.modules.mdc ? 'mdc' : 'markdown')
}

/**
 * Markdown/MDC linting via mdclint. MDC rules are enabled only when the Nuxt
 * context proves an MDC-capable module is configured, or when users force
 * `preset: 'mdc'`.
 */
export function markdownConfig(
  ctx: NustackContext,
  options: MarkdownConcernOptions = {},
): Linter.Config[] {
  const files = options.files ?? GLOB_MARKDOWN
  const preset = resolveMarkdownPreset(ctx, options)
  const rules = resolveConcernRules(options)

  return [
    mdcLint({
      files,
      preset,
      config: options.config,
    } as Parameters<typeof mdcLint>[0] & { config?: Record<string, unknown> }) as unknown as Linter.Config,
    {
      name: 'nustack/markdown',
      files,
      rules,
    },
  ]
}
