import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import vueParser from 'vue-eslint-parser'
import plugin from '../../../index.js'

const rule = plugin.rules?.['prefer-u-table']

describe('prefer-u-table', () => {
  it('reports raw tables in Vue templates', () => {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module', parser: vueParser } })

    tester.run('prefer-u-table', rule as never, {
      valid: [
        { filename: 'component.vue', code: '<template><UTable :data="rows" /></template>' },
        { filename: 'component.vue', code: '<template><table data-raw><tbody /></table></template>' },
      ],
      invalid: [
        { filename: 'component.vue', code: '<template><table><tbody /></table></template>', errors: [{ messageId: 'preferUTable' }] },
      ],
    })
  })
})
