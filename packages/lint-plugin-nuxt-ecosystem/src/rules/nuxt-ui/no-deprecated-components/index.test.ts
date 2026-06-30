import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'
import vueParser from 'vue-eslint-parser'
import plugin from '../../../index.js'

const rule = plugin.rules?.['no-deprecated-components']

describe('no-deprecated-components', () => {
  it('reports Nuxt UI components renamed in v4', () => {
    const tester = new RuleTester({ languageOptions: { ecmaVersion: 'latest', sourceType: 'module', parser: vueParser } })

    tester.run('no-deprecated-components', rule as never, {
      valid: [
        { filename: 'component.vue', code: '<template><UFieldGroup /></template>' },
        { filename: 'component.vue', code: '<template><UMarquee :items="items" /></template>' },
        { filename: 'component.vue', code: '<template><UAccordion :items="items" /></template>' },
      ],
      invalid: [
        { filename: 'component.vue', code: '<template><UButtonGroup /></template>', errors: [{ messageId: 'deprecated' }] },
        { filename: 'component.vue', code: '<template><UPageMarquee :items="items" /></template>', errors: [{ messageId: 'deprecated' }] },
        { filename: 'component.vue', code: '<template><UPageAccordion :items="items" /></template>', errors: [{ messageId: 'deprecated' }] },
      ],
    })
  })
})
