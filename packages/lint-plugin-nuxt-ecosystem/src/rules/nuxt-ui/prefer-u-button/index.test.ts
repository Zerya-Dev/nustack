import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import vueParser from 'vue-eslint-parser'
import plugin from '../../../index.js'

const rule = plugin.rules?.['prefer-u-button']

describe('prefer-u-button', () => {
  it('reports raw buttons in Vue templates', () => {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module', parser: vueParser } })

    tester.run('prefer-u-button', rule as never, {
      valid: [
        { filename: 'component.vue', code: '<template><UButton>Save</UButton></template>' },
        { filename: 'component.vue', code: '<template><button data-raw>Save</button></template>' },
      ],
      invalid: [
        {
          filename: 'component.vue',
          code: '<template><button>Save</button></template>',
          errors: [{ messageId: 'preferUButton' }],
        },
      ],
    })
  })
})
