import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import plugin from '../../../index.js'

const rule = plugin.rules?.['no-secret-define']

describe('define/no-secret-define', () => {
  it('reports secret-looking define keys and process.env values', () => {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module' } })

    tester.run('define/no-secret-define', rule as never, {
      valid: [
        { code: 'defineConfig({ define: { __APP_VERSION__: JSON.stringify(pkg.version) } })' },
        { code: 'defineConfig({ define: { __PUBLIC_API_KEY__: JSON.stringify(process.env.API_KEY) } })' },
        { code: 'defineConfig({ define: { __FEATURE_FLAG__: JSON.stringify(true) } })' },
        { code: 'const other = { define: 1 }' },
      ],
      invalid: [
        {
          code: 'defineConfig({ define: { __API_SECRET__: JSON.stringify(process.env.API_SECRET) } })',
          errors: [{ messageId: 'noSecretDefineKey' }],
        },
        {
          code: 'defineConfig({ define: { __CONFIG__: JSON.stringify(process.env.STRIPE_SECRET_KEY) } })',
          errors: [{ messageId: 'noSecretDefineValue' }],
        },
        {
          code: 'defineConfig({ define: { __TOKEN__: \'"abc"\' } })',
          errors: [{ messageId: 'noSecretDefineKey' }],
        },
      ],
    })
  })
})
