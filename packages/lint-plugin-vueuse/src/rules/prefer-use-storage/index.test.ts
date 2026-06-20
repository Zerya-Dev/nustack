import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import plugin from '../../index.js'

const rule = plugin.rules?.['prefer-use-storage']

describe('prefer-use-storage', () => {
  it('reports raw storage access', () => {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module' } })

    tester.run('prefer-use-storage', rule as never, {
      valid: [{ code: "const theme = useStorage('theme', 'light')" }],
      invalid: [
        { code: "localStorage.setItem('theme', theme)", errors: [{ messageId: 'preferUseStorage' }] },
        { code: 'window.localStorage', errors: [{ messageId: 'preferUseStorage' }] },
      ],
    })
  })
})
