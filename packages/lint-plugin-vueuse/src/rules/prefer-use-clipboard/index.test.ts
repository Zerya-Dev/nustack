import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import plugin from '../../index.js'

const rule = plugin.rules?.['prefer-use-clipboard']

describe('prefer-use-clipboard', () => {
  it('reports navigator.clipboard access', () => {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module' } })

    tester.run('prefer-use-clipboard', rule as never, {
      valid: [{ code: 'const { copy } = useClipboard()' }],
      invalid: [{ code: 'navigator.clipboard.writeText(value)', errors: [{ messageId: 'preferUseClipboard' }] }],
    })
  })
})
