import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import plugin from '../../index.js'

const rule = plugin.rules?.['prefer-use-observers']

describe('prefer-use-observers', () => {
  it('reports raw observer constructors', () => {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module' } })

    tester.run('prefer-use-observers', rule as never, {
      valid: [{ code: 'useResizeObserver(target, onResize)' }],
      invalid: [{ code: 'new ResizeObserver(onResize)', errors: [{ messageId: 'preferUseObservers' }] }],
    })
  })
})
