import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import plugin from '../../index.js'

const rule = plugin.rules?.['prefer-useclipboard']

describe('prefer-useclipboard', () => {
  it('reports navigator.clipboard access', () => {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module' } })

    tester.run('prefer-useclipboard', rule as never, {
      valid: [{ code: 'const { copy } = useClipboard()' }],
      invalid: [{ code: 'navigator.clipboard.writeText(value)', errors: [{ messageId: 'preferUseClipboard' }] }],
    })
  })
})
