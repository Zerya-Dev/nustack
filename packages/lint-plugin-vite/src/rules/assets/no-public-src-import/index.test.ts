import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import plugin from '../../../index.js'

const rule = plugin.rules?.['no-public-src-import']

describe('assets/no-public-src-import', () => {
  it('reports imports from public directories', () => {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module' } })

    tester.run('assets/no-public-src-import', rule as never, {
      valid: [
        { code: "import logo from './assets/logo.svg'" },
        { code: "export { icon } from './src/icon'" },
      ],
      invalid: [
        { code: "import logo from '../public/logo.svg'", errors: [{ messageId: 'noPublicSrcImport' }] },
        { code: "export * from './public/icons.js'", errors: [{ messageId: 'noPublicSrcImport' }] },
      ],
    })
  })
})
