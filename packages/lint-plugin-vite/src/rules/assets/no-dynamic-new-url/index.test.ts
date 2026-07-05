/* eslint-disable no-template-curly-in-string -- fixtures embed `${...}` as literal source text under test, not accidental interpolation */
import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import plugin from '../../../index.js'

const rule = plugin.rules?.['no-dynamic-new-url']

describe('assets/no-dynamic-new-url', () => {
  it('reports template literals in new URL(..., import.meta.url)', () => {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module' } })

    tester.run('assets/no-dynamic-new-url', rule as never, {
      valid: [
        { code: 'const icon = new URL(\'./icons/home.svg\', import.meta.url).href' },
        { code: 'const icon = new URL(`./icons/home.svg`, import.meta.url).href' },
        { code: 'const icon = new URL(`./icons/${name}.svg`, someOtherBase).href' },
        { code: 'const worker = new Worker(`./workers/${name}.ts`)' },
      ],
      invalid: [
        { code: 'const icon = new URL(`./icons/${name}.svg`, import.meta.url).href', errors: [{ messageId: 'noDynamicNewUrl' }] },
        { code: 'const icon = new URL(`${dir}/icons/home.svg`, import.meta.url).href', errors: [{ messageId: 'noDynamicNewUrl' }] },
      ],
    })
  })
})
