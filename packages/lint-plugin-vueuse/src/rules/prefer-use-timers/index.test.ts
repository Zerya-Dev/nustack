import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import plugin from '../../index.js'

const rule = plugin.rules?.['prefer-use-timers']

describe('prefer-use-timers', () => {
  it('reports raw timer calls', () => {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module' } })

    tester.run('prefer-use-timers', rule as never, {
      valid: [{ code: 'useIntervalFn(poll, 1000)' }],
      invalid: [
        { code: 'setTimeout(run, 100)', errors: [{ messageId: 'preferUseTimers' }] },
        { code: 'window.clearInterval(id)', errors: [{ messageId: 'preferUseTimers' }] },
      ],
    })
  })
})
