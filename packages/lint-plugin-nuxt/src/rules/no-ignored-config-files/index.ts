import type { Context, ESTree, Rule, Visitor } from '@oxlint/plugins'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { docsUrl } from '../../utils/docs-url.js'
import { basename } from '../../utils/path.js'

const IGNORED_CONFIG_KEYS: Record<string, string> = {
  nitro: 'nitro',
  postcss: 'postcss',
  vite: 'vite',
  webpack: 'webpack',
}

const IGNORED_CONFIG_PATTERN = /^(nitro|postcss|vite|webpack)\.config\.(?:js|mjs|cjs|ts|mts|cts)$/
const NUXT_CONFIG_FILENAMES = ['nuxt.config.js', 'nuxt.config.mjs', 'nuxt.config.cjs', 'nuxt.config.ts', 'nuxt.config.mts', 'nuxt.config.cts']

function belongsToNuxtProject(filename: string): boolean {
  const directory = dirname(filename)
  return NUXT_CONFIG_FILENAMES.some(config => existsSync(join(directory, config)))
}

export const noIgnoredConfigFiles: Rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow external configuration files that Nuxt ignores.',
      url: docsUrl('no-ignored-config-files'),
    },
    schema: [],
    messages: {
      ignoredConfig: '`{{ filename }}` is ignored by Nuxt. Move this configuration to the `{{ key }}` key in `nuxt.config`.',
    },
  },
  createOnce(context: Context): Visitor {
    return {
      Program(node: ESTree.Program): void {
        const physicalFilename = context.physicalFilename || context.filename
        const filename = basename(physicalFilename)
        const configName = IGNORED_CONFIG_PATTERN.exec(filename)?.[1]
        const key = configName ? IGNORED_CONFIG_KEYS[configName] : undefined
        if (!key || !belongsToNuxtProject(physicalFilename))
          return

        context.report({
          node,
          messageId: 'ignoredConfig',
          data: { filename, key },
        })
      },
    }
  },
}
