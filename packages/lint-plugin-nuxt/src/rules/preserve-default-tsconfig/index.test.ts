import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { RuleTester } from 'eslint'
import { describe, expect, it } from 'vitest'
import plugin, { nuxtConfigs } from '../../index.js'

const rule = plugin.rules?.['preserve-default-tsconfig']
const DEFAULT_TSCONFIG = {
  files: [],
  references: [
    { path: './.nuxt/tsconfig.app.json' },
    { path: './.nuxt/tsconfig.server.json' },
    { path: './.nuxt/tsconfig.shared.json' },
    { path: './.nuxt/tsconfig.node.json' },
  ],
}

describe('preserve-default-tsconfig', () => {
  it('reports missing, invalid, or modified root tsconfig files', () => {
    const projectDirectories: string[] = []
    const createProject = (tsconfig?: string, configName = 'nuxt.config.ts'): string => {
      const directory = mkdtempSync(join(tmpdir(), 'preserve-default-tsconfig-'))
      projectDirectories.push(directory)
      if (tsconfig !== undefined)
        writeFileSync(join(directory, 'tsconfig.json'), tsconfig)
      return join(directory, configName)
    }

    const tester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module' } })

    try {
      tester.run('preserve-default-tsconfig', rule as never, {
        valid: [
          {
            code: 'export default {}',
            filename: createProject(JSON.stringify(DEFAULT_TSCONFIG, null, 2)),
          },
          {
            code: 'export default {}',
            filename: createProject(JSON.stringify({
              references: DEFAULT_TSCONFIG.references,
              files: [],
            })),
          },
          {
            code: 'export default {}',
            filename: createProject('', 'vite.config.ts'),
          },
        ],
        invalid: [
          {
            code: 'export default {}',
            filename: createProject(),
            errors: [{ messageId: 'modifiedTsconfig' }],
          },
          {
            code: 'export default {}',
            filename: createProject('{ invalid json'),
            errors: [{ messageId: 'modifiedTsconfig' }],
          },
          {
            code: 'export default {}',
            filename: createProject(JSON.stringify({
              ...DEFAULT_TSCONFIG,
              compilerOptions: { strict: true },
            })),
            errors: [{ messageId: 'modifiedTsconfig' }],
          },
          {
            code: 'export default {}',
            filename: createProject(JSON.stringify({
              files: [],
              references: [...DEFAULT_TSCONFIG.references].reverse(),
            })),
            errors: [{ messageId: 'modifiedTsconfig' }],
          },
          {
            code: 'export default {}',
            filename: createProject(JSON.stringify({
              files: ['nuxt.config.ts'],
              references: DEFAULT_TSCONFIG.references,
            })),
            errors: [{ messageId: 'modifiedTsconfig' }],
          },
        ],
      })
    }
    finally {
      for (const directory of projectDirectories)
        rmSync(directory, { recursive: true, force: true })
    }
  })

  it('is enabled on Nuxt config files in the recommended config only', () => {
    const recommended = nuxtConfigs()
    const modulesConfig = recommended.find(config => config.name === 'nustack/nuxt/modules')

    expect(modulesConfig?.files).toEqual(['**/nuxt.config.{ts,js,mjs,mts,cjs,cts}'])
    expect(modulesConfig?.rules?.['@nustack/nuxt/preserve-default-tsconfig']).toBe('error')
    expect(nuxtConfigs({ variant: 'minimal' }).some(config =>
      config.rules?.['@nustack/nuxt/preserve-default-tsconfig'])).toBe(false)
  })
})
