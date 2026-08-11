import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { basename, join } from 'node:path'
import { Linter, RuleTester } from 'eslint'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import plugin, { nuxtConfigs } from '../../index.js'

const rule = plugin.rules?.['no-ignored-config-files']
const CONFIG_KEYS = {
  nitro: 'nitro',
  postcss: 'postcss',
  vite: 'vite',
  webpack: 'webpack',
}
const CONFIG_EXTENSIONS = ['js', 'mjs', 'cjs', 'ts', 'mts', 'cts']

describe('no-ignored-config-files', () => {
  let projectRoot: string

  beforeAll(() => {
    projectRoot = mkdtempSync(join(process.cwd(), 'nuxt-rule-test-'))
    writeFileSync(join(projectRoot, 'nuxt.config.ts'), 'export default {}')
    mkdirSync(join(projectRoot, 'packages/vite-library'), { recursive: true })
  })

  afterAll(() => {
    rmSync(projectRoot, { recursive: true, force: true })
  })

  it('reports external configuration files ignored by Nuxt', () => {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module' } })

    tester.run('no-ignored-config-files', rule as never, {
      valid: [
        { code: 'export default {}', filename: 'nuxt.config.ts' },
        { code: 'export default {}', filename: 'vitest.config.ts' },
        { code: 'export default {}', filename: 'postcss.config.json' },
        { code: 'export default {}', filename: 'vite.config.jsx' },
      ],
      invalid: Object.entries(CONFIG_KEYS).flatMap(([configName, key]) =>
        CONFIG_EXTENSIONS.map(extension => ({
          code: 'export default {}',
          filename: join(projectRoot, `${configName}.config.${extension}`),
          errors: [{
            messageId: 'ignoredConfig',
            data: { filename: `${configName}.config.${extension}`, key },
          }],
        }))),
    })
  })

  it('is scoped to ignored config files in the recommended config only', () => {
    const recommended = nuxtConfigs()
    const externalConfig = recommended.find(config => config.name === 'nustack/nuxt/external-config')

    expect(externalConfig?.files).toEqual([
      'nitro.config.{js,mjs,cjs,ts,mts,cts}',
      'postcss.config.{js,mjs,cjs,ts,mts,cts}',
      'vite.config.{js,mjs,cjs,ts,mts,cts}',
      'webpack.config.{js,mjs,cjs,ts,mts,cts}',
    ])
    expect(externalConfig?.rules?.['@nustack/nuxt/no-ignored-config-files']).toBe('error')
    expect(nuxtConfigs({ variant: 'minimal' }).some(config => config.name === 'nustack/nuxt/external-config')).toBe(false)
  })

  it('scopes external configs to explicitly configured Nuxt project roots', () => {
    const externalConfig = nuxtConfigs({ projectDirectories: ['apps/site', './apps/admin/'] })
      .find(config => config.name === 'nustack/nuxt/external-config')

    expect(externalConfig?.files).toContain('apps/site/vite.config.{js,mjs,cjs,ts,mts,cts}')
    expect(externalConfig?.files).toContain('apps/admin/postcss.config.{js,mjs,cjs,ts,mts,cts}')
    expect(externalConfig?.files).not.toContain('**/vite.config.{js,mjs,cjs,ts,mts,cts}')
  })

  it('does not report a Vite project outside the configured Nuxt project root', () => {
    const linter = new Linter({ configType: 'flat' })
    const configs = nuxtConfigs({ projectDirectories: [basename(projectRoot)] })

    const rootMessages = linter.verify('export default {}', configs, join(projectRoot, 'vite.config.ts'))
    const libraryMessages = linter.verify('export default {}', configs, join(projectRoot, 'packages/vite-library/vite.config.ts'))

    expect(rootMessages.map(message => message.ruleId)).toContain('@nustack/nuxt/no-ignored-config-files')
    expect(libraryMessages.map(message => message.ruleId)).not.toContain('@nustack/nuxt/no-ignored-config-files')
  })
})
