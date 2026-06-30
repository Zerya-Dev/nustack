import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import vueParser from 'vue-eslint-parser'
import plugin from '../../../index.js'

const rule = plugin.rules?.['prefer-u-link']

describe('prefer-u-link', () => {
  it('reports raw anchors in Vue templates', () => {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module', parser: vueParser } })

    tester.run('prefer-u-link', rule as never, {
      valid: [
        { filename: 'component.vue', code: '<template><ULink to="/home">Home</ULink></template>' },
        { filename: 'component.vue', code: '<template><a data-raw href="/home">Home</a></template>' },
      ],
      invalid: [
        { filename: 'component.vue', code: '<template><a href="/home">Home</a></template>', errors: [{ messageId: 'preferULink' }] },
      ],
    })
  })
})
