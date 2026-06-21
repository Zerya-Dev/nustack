import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import plugin from '../../index.js'

const rule = plugin.rules?.['no-process-env']

describe('no-process-env', () => {
  it('reports process.env member access', () => {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module' } })

    tester.run('no-process-env', rule as never, {
      valid: [
        { code: 'const value = import.meta.env.FOO' },
        { code: 'process.cwd()' },
      ],
      invalid: [
        { code: 'const value = process.env.FOO', errors: [{ messageId: 'noProcessEnv' }] },
        { code: 'const { FOO } = process.env', errors: [{ messageId: 'noProcessEnv' }] },
      ],
    })
  })
})
