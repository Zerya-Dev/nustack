import { describe, it } from 'vitest'
import { ruleTester as tester } from '../../../../tests/rule-tester.js'
import { nuxtUiPlugin } from '../../../index.js'

const rule = nuxtUiPlugin.rules['prefer-u-table']

describe('prefer-u-table', () => {
  it('reports raw tables in Vue templates', () => {
    tester.run('prefer-u-table', rule, {
      valid: [
        { code: '<template><UTable :data="rows" /></template>' },
      ],
      invalid: [
        { code: '<template><table><tbody /></table></template>', errors: [{ messageId: 'preferUTable' }] },
      ],
    })
  })
})
