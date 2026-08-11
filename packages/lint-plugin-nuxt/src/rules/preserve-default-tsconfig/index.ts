import type { Context, ESTree, Rule, Visitor } from '@oxlint/plugins'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { docsUrl } from '../../utils/docs-url.js'
import { basename } from '../../utils/path.js'

const NUXT_CONFIG_PATTERN = /^nuxt\.config\.(?:js|mjs|cjs|ts|mts|cts)$/
const DEFAULT_REFERENCE_PATHS = [
  './.nuxt/tsconfig.app.json',
  './.nuxt/tsconfig.server.json',
  './.nuxt/tsconfig.shared.json',
  './.nuxt/tsconfig.node.json',
]

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isDefaultTsconfig(value: unknown): boolean {
  if (!isRecord(value) || Object.keys(value).length !== 2)
    return false

  if (!Array.isArray(value.files) || value.files.length !== 0)
    return false

  if (!Array.isArray(value.references) || value.references.length !== DEFAULT_REFERENCE_PATHS.length)
    return false

  return value.references.every((reference, index) =>
    isRecord(reference)
    && Object.keys(reference).length === 1
    && reference.path === DEFAULT_REFERENCE_PATHS[index],
  )
}

export const preserveDefaultTsconfig: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require Nuxt projects to preserve the default root TypeScript configuration.',
      url: docsUrl('preserve-default-tsconfig'),
    },
    schema: [],
    messages: {
      modifiedTsconfig: 'Preserve Nuxt\'s default root `tsconfig.json` unchanged. Configure TypeScript through `nuxt.config.ts` instead.',
    },
  },
  createOnce(context: Context): Visitor {
    return {
      Program(node: ESTree.Program): void {
        const filename = context.physicalFilename || context.filename
        if (!NUXT_CONFIG_PATTERN.test(basename(filename)))
          return

        const tsconfigPath = join(dirname(filename), 'tsconfig.json')

        try {
          const tsconfig = JSON.parse(readFileSync(tsconfigPath, 'utf8'))
          if (isDefaultTsconfig(tsconfig))
            return
        }
        catch {
          // Missing and invalid tsconfig files both violate Nuxt's recommendation.
        }

        context.report({
          node,
          messageId: 'modifiedTsconfig',
        })
      },
    }
  },
}
