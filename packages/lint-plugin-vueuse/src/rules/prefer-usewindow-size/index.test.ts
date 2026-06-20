import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import plugin from '../../index.js'

const rule = plugin.rules?.['prefer-usewindow-size']

describe('prefer-usewindow-size', () => {
  it('reports direct window size reads', () => {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module' } })

    tester.run('prefer-usewindow-size', rule as never, {
      valid: [{ code: 'const { width } = useWindowSize()' }],
      invalid: [{ code: 'const width = window.innerWidth', errors: [{ messageId: 'preferUseWindowSize' }] }],
    })
  })
})
